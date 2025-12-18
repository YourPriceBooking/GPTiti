"use client"
import { createContext, useContext, useState, useEffect } from "react";
import { TokensContextType } from "@/types/types";


const TokensContext = createContext<TokensContextType | undefined>(undefined);

export function TokensProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(10000);
  const [nextClaimTime, setNextClaimTime] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState("7 days 00:00");

  function handleClaim() {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    setBalance(prev => prev + 10000);
    setNextClaimTime(nextWeek);
  }

  useEffect(() => {
    if (!nextClaimTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = nextClaimTime.getTime() - now.getTime();

      if (diff <= 0) {
        clearInterval(interval);
        setCountdown("Available now");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      setCountdown(`${days} days ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [nextClaimTime]);

  return (
    <TokensContext.Provider value={{ balance, countdown, handleClaim }}>
      {children}
    </TokensContext.Provider>
  );
}

export function useTokensContext() {
  const context = useContext(TokensContext);
  if (!context) {
    throw new Error("useTokensContext must be used within TokensProvider");
  }
  return context;
}