import axios from "axios";
import type { AppStore } from "@/redux/store";
import { isAuthExpiredError } from "@/lib/authError";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
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
    const token = store.getState().auth.accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  axiosInstance.interceptors.response.use(
    (res) => res,
    async (error) => {
      const config = (error as { config?: RetryableConfig }).config;
      if (!config || !isAuthExpiredError(error)) throw error;

      const isRefreshCall = config.url?.includes("/users/refresh") ?? false;
      const hasRefreshToken = Boolean(store.getState().auth.refreshToken);

      // Try once to silently refresh the access token.
      if (hasRefreshToken && !isRefreshCall && !config._retry) {
        config._retry = true;
        try {
          const { refreshUser } = await import("@/redux/auth/operations");
          const { resetToken } = await import("@/redux/auth/slice");

          const accessToken = await store.dispatch(refreshUser()).unwrap();
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

      // Unrecoverable expiry (no refresh token / refresh failed / already retried)
      // → log out and surface the login window.
      const { refreshError } = await import("@/redux/auth/slice");
      store.dispatch(refreshError());
      throw error;
    },
  );
};
