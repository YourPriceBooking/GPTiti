"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectIsLoggedIn } from "@/redux/auth/selectors";
import { logoutUser } from "@/redux/auth/operations";

import { useGoogleLogin } from "@/hooks/useGoogleLogin";
import GoogleCredentialButton from "@/components/common/GoogleCredentialButton/GoogleCredentialButton";

import { motion } from "framer-motion";

export default function LoginButton({ checked }: { checked: boolean }) {
  const dispatch = useAppDispatch();

  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  const { handleCredential, handleError, errorText } = useGoogleLogin();

  if (isLoggedIn) {
    return (
      <div className="w-full">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          onClick={() => dispatch(logoutUser())}
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
            <GoogleCredentialButton
              onSuccess={handleCredential}
              onError={handleError}
              theme="filled_black"
              size="large"
              shape="pill"
              text="continue_with"
              logo_alignment="left"
              width={400}
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
