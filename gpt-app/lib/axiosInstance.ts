import axios from "axios";
import type { AppStore } from "@/redux/store";
import { isAuthExpiredError } from "@/lib/authError";
import { runSingleFlightRefresh } from "@/lib/authSession";
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
    const token = store.getState().auth.accessToken;
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

      const isRefreshCall = config.url?.includes("/users/refresh") ?? false;
      const isLoggedIn = store.getState().auth.isLoggedIn;

      if (isLoggedIn && !isRefreshCall && !config._retry) {
        config._retry = true;
        try {
          const { refreshUser } = await import("@/redux/auth/operations");
          const { resetToken } = await import("@/redux/auth/slice");

          const accessToken = await runSingleFlightRefresh(() =>
            store.dispatch(refreshUser()).unwrap(),
          );
          store.dispatch(resetToken(accessToken));
          config.headers = {
            ...(config.headers ?? {}),
            Authorization: `Bearer ${accessToken}`,
          };
          return axiosInstance.request(config);
        } catch {
          // refresh failed → fall through to force a logout
        }
      }

      const { refreshError } = await import("@/redux/auth/slice");
      store.dispatch(refreshError());
      throw error;
    },
  );
};
