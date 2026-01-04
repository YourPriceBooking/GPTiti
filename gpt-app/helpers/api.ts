
import { axiosInstance } from "@/lib/axiosInstance";
import { BackendAuthResponse } from "@/types/google.types";


export const api = {
  loginWithGoogle: async (googleToken: string) => {
    const res = await axiosInstance.post<BackendAuthResponse>("/user", { googleToken });
    return res.data;
  },
  refreshAccessToken: async (refreshToken: string) => {
    const res = await axiosInstance.post<{ accessToken: string }>("/refresh", { refreshToken });
    return res.data;
  },
  logout: async () => {
    await axiosInstance.get("/logout");
  },
};
