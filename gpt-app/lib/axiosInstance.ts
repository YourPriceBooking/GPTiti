import axios from "axios";
import type { AppStore } from "@/redux/store";
import { isAuthExpiredError } from "@/lib/authError";
import { AuthSessionChangedError, getAuthGeneration, isCurrentAuthGeneration, isLogoutPending, runSingleFlightRefresh } from "@/lib/authSession";
import {
  clearAccessToken,
  readAccessToken,
} from "@/lib/authTokenVault";
import { env } from "@/lib/env";

export const axiosInstance = axios.create({
  baseURL: env.backendApiUrl,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

interface RetryableConfig {
  _retry?: boolean;
  _authGeneration?: number;
  url?: string;
  headers?: Record<string, string>;
  [key: string]: unknown;
}

// Викликається один раз з store.ts після configureStore()
export const setupInterceptors = (store: AppStore) => {
  axiosInstance.interceptors.request.use((config) => {
    const scoped = config as typeof config & { _authGeneration?: number };
    scoped._authGeneration ??= getAuthGeneration();
    if (scoped._authGeneration !== getAuthGeneration()) throw new AuthSessionChangedError();
    const isRefreshCall = config.url?.includes("/users/refresh") ?? false;
    const token = readAccessToken();
    if (token && !isRefreshCall) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  axiosInstance.interceptors.response.use(
    (res) => {
      const started = (res.config as typeof res.config & { _authGeneration?: number })._authGeneration;
      if (started !== undefined && started !== getAuthGeneration()) throw new AuthSessionChangedError();
      return res;
    },
    async (error) => {
      const config = (error as { config?: RetryableConfig }).config;
      if (!config || !isAuthExpiredError(error) || isLogoutPending()) throw error;
      const generation = config._authGeneration ?? getAuthGeneration();
      if (!isCurrentAuthGeneration(generation)) throw error;

      const isAuthCall = ["/users/user", "/users/refresh", "/users/logout"].some(
        (path) => config.url?.includes(path) ?? false,
      );
      const isLoggedIn = store.getState().auth.isLoggedIn;

      if (!isLoggedIn || isAuthCall) throw error;

      if (!config._retry) {
        config._retry = true;
        try {
          const { refreshUser } = await import("@/redux/auth/operations");

          await runSingleFlightRefresh(() =>
            store.dispatch(refreshUser()).unwrap(),
          );
          if (!isCurrentAuthGeneration(generation)) throw new AuthSessionChangedError();
          return axiosInstance.request(config);
        } catch {
          // refresh failed → fall through to force a logout
        }
      }

      if (!isCurrentAuthGeneration(generation)) throw error;
      const { refreshError } = await import("@/redux/auth/slice");
      clearAccessToken();
      store.dispatch(refreshError());
      throw error;
    },
  );
};
