"use client";

import { useState } from "react";
import { CredentialResponse } from "@react-oauth/google";

import { useAppDispatch } from "@/redux/hooks";
import { loginUser } from "@/redux/auth/operations";

export function useGoogleLogin(onSuccess?: () => void) {
  const dispatch = useAppDispatch();

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
      await dispatch(loginUser(res.credential)).unwrap();
      onSuccess?.();
    } catch (err) {
      const message =
        typeof err === "string" ? err : "Login failed. Please try again.";
      console.error("Login failed:", err);
      setErrorText(message);
    } finally {
      setLoading(false);
    }
  };

  const handleError = () => setErrorText("Google login failed");

  return { handleCredential, handleError, loading, errorText };
}
