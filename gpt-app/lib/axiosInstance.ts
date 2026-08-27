import axios from "axios";
import type { AppStore } from "@/redux/store";
import { isAuthExpiredError } from "@/lib/authError";
import { runSingleFlightRefresh } from "@/lib/authSession";
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
  url?: string;
  headers?: Record<string, string>;
  [key: string]: unknown;
}

// Викликається один раз з store.ts після configureStore()
export const setupInterceptors = (store: AppStore) => {
  axiosInstance.interceptors.request.use((config) => {
    const isRefreshCall = config.url?.includes("/users/refresh") ?? false;
    const token = readAccessToken();
    if (token && !isRefreshCall) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  axiosInstance.interceptors.response.use(
    (res) => res,
    async (error) => {
      const config = (error as { config?: RetryableConfig }).config;
      if (!config || !isAuthExpiredError(error)) throw error;

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
          return axiosInstance.request(config);
        } catch {
          // refresh failed → fall through to force a logout
        }
      }

      const { refreshError } = await import("@/redux/auth/slice");
      clearAccessToken();
      store.dispatch(refreshError());
      throw error;
    },
  );
};
