
export const tokenStorage = {
  getAccess(): string | null {
    return typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  },
  getRefresh(): string | null {
    return typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
  },
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
