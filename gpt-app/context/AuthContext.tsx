
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/helpers/api";
import { tokenStorage } from "@/utils/tokenStorage";

interface User { id: number; email: string; name: string; }
interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (googleToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  // Ініціалізація зі сховища (переживає перезавантаження)
  useEffect(() => {
    const a = tokenStorage.getAccess();
    const r = tokenStorage.getRefresh();
    if (a) setTimeout(()=> {setAccessToken(a)}, 0);
    if (r) setTimeout(()=> {setRefreshToken(r)}, 0);
    // опційно — профіль з бекенду: якщо є endpoint /me
    // тоді можна підвантажити user
  }, []);

  const login = async (googleToken: string) => {
    const data = await api.loginWithGoogle(googleToken);
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    setUser(data.user);
    tokenStorage.set(data.accessToken, data.refreshToken);
  };

  const logout = async () => {
    try { await api.logout(); } catch { /* ignore */ }
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    tokenStorage.clear();
  };

  // Периодичне оновлення access token (наприклад, кожні 10 хв)
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!refreshToken) return;
      try {
        const { accessToken: newAccess } = await api.refreshAccessToken(refreshToken);
        setAccessToken(newAccess);
        tokenStorage.setAccess(newAccess);
      } catch (e) {
        // якщо не вдалось — логаут
        await logout();
      }
    }, 1000 * 60 * 10);
    return () => clearInterval(interval);
  }, [refreshToken]);

  return (
    <AuthContext.Provider value={{ user, accessToken, refreshToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
