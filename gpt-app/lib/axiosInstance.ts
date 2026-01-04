// lib/axiosInstance.ts
import axios from "axios";
import { tokenStorage } from "@/utils/tokenStorage";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Добавляємо Authorization заголовок з accessToken
axiosInstance.interceptors.request.use((config) => {
  const token = tokenStorage.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Авто-оновлення при 401 (якщо бекенд так відповідає)
let isRefreshing = false;
let pendingQueue: Array<(t: string | null) => void> = [];

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { response, config } = error;
    if (!response) throw error;

    // якщо 401 і є refreshToken — пробуємо оновити
    if (response.status === 401) {
      const refreshToken = tokenStorage.getRefresh();
      if (!refreshToken) throw error;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshRes = await axiosInstance.post("/refresh", { refreshToken });
          const newAccess = refreshRes.data.accessToken as string;
          tokenStorage.setAccess(newAccess);
          // пробуджуємо всі очікувані запити
          pendingQueue.forEach((cb) => cb(newAccess));
          pendingQueue = [];
        } catch (e) {
          tokenStorage.clear();
          pendingQueue.forEach((cb) => cb(null));
          pendingQueue = [];
          throw e;
        } finally {
          isRefreshing = false;
        }
      }

      // ставимо запит у чергу і повторимо його після оновлення
      return new Promise((resolve, reject) => {
        pendingQueue.push((newAccess) => {
          if (!newAccess) return reject(error);
          // повтор запиту з оновленим токеном
          const retryConfig = { ...config };
          retryConfig.headers = { ...retryConfig.headers, Authorization: `Bearer ${newAccess}` };
          resolve(axiosInstance.request(retryConfig));
        });
      });
    }

    throw error;
  }
);
