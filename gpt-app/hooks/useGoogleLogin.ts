"use client";

import { useState } from "react";
import { CredentialResponse } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";

export function useGoogleLogin(onSuccess?: () => void) {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const handleCredential = async (res: CredentialResponse) => {
    try {
      setLoading(true);
      setErrorText(null);
      if (!res.credential) {
        setErrorText("No credential returned from Google");
        return;
      }
      await login(res.credential);
      onSuccess?.();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Login failed:", err);
      setErrorText(err?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleError = () => setErrorText("Google login failed");

  return { handleCredential, handleError, loading, errorText };
}
