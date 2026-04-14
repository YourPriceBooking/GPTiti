
import { User } from "@/context/AuthContext";

export const tokenStorage = {
  getUser(): User | null {
    if (typeof window === "undefined") return null;
    const userJson = localStorage.getItem("user");
    return userJson ? JSON.parse(userJson) : null;
  },
  getAccess(): string | null {
    return typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  },
  getRefresh(): string | null {
    return typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
  },
  setUser(user: User) {
    localStorage.setItem("user", JSON.stringify(user));
  }
  ,
  set(accessToken: string, refreshToken: string) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  },
  setAccess(accessToken: string) {
    localStorage.setItem("accessToken", accessToken);
  },
  clear() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};
