"use client";

import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from "@/hooks/useGoogleLogin";
import { useAuth } from "@/context/AuthContext";

export default function LoginButton({ checked }: { checked: boolean }) {
  const { handleCredential, handleError, errorText } = useGoogleLogin();
  const { user, accessToken, logout } = useAuth();
  const isLoggedIn = Boolean(accessToken || user);

  if (isLoggedIn) {
    return (
      <div className="w-full">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          onClick={() => logout()}
          type="button"
          className="w-full py-3 rounded-xl text-white font-semibold text-lg transition-all focus:ring-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-300"
        >
          Log out
        </motion.button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative w-full">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className={`w-full py-3 rounded-xl text-white font-semibold text-lg transition-all focus:ring-4 ${
            checked
              ? "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-300"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!checked}
          type="button"
        >
          Sign in with Google
        </motion.button>

        {checked && (
          <div className="absolute inset-0 opacity-0">
            <GoogleLogin
              onSuccess={handleCredential}
              onError={handleError}
              theme="filled_black"
              size="large"
              shape="pill"
              text="continue_with"
              logo_alignment="left"
              width="100%"
            />
          </div>
        )}
      </div>

      {errorText && (
        <div style={{ color: "#ffb4b4", fontSize: 13, marginTop: 8 }}>
          {errorText}
        </div>
      )}
    </div>
  );
}
