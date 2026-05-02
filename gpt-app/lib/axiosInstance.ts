import axios from "axios";
import type { AppStore } from "@/redux/store";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
  headers: { "Content-Type": "application/json" },
});

interface RetryableConfig {
  _retry?: boolean;
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
      const { response, config } = error as {
        response?: { status?: number };
        config?: RetryableConfig;
      };
      if (!response || !config) throw error;

      if (response.status === 401 && !config._retry) {
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
        } catch (refreshErr) {
          const { refreshError } = await import("@/redux/auth/slice");
          store.dispatch(refreshError());
          throw refreshErr;
        }
      }

      throw error;
    },
  );
};
