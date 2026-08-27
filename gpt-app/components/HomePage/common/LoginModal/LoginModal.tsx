"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import AppModal from "@/components/HomePage/common/AppModal/AppModal";
import GoogleCredentialButton from "@/components/common/GoogleCredentialButton/GoogleCredentialButton";
import { useGoogleLogin } from "@/hooks/useGoogleLogin";
import styles from "./LoginModal.module.css";

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function LoginModal({ open, onClose }: LoginModalProps) {
  if (!open) return null;
  return <OpenLoginModal onClose={onClose} />;
}

function OpenLoginModal({ onClose }: Pick<LoginModalProps, "onClose">) {
  const { handleCredential, handleError, errorText } = useGoogleLogin(onClose);
  const [agreed, setAgreed] = useState(false);

  return (
    <AppModal open onClose={onClose} title="Welcome to GPTiti ">
      <div className={styles.root}>
        <p className={styles.lead}>
          Premium AI models. No subscriptions. Just access.
        </p>

        <ul className={styles.benefits}>
          <li className={styles.benefit}>
            🎁 10,000 free tokens for your first sign-in
          </li>
          <li className={styles.benefit}>⚡ Access to premium GPT models</li>
          <li className={styles.benefit}>
            🎁 Weekly token gifts — automatically unlocked
          </li>
          <li className={styles.benefit}>
            ⏳ Tokens never expire — use them anytime
          </li>
        </ul>

        <div className={styles.divider} />

        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            className={styles.checkboxInput}
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <span className={styles.checkboxBox}>
            {agreed && (
              <Image
                src="/checkbox_hecked.svg"
                alt=""
                width={20}
                height={20}
                unoptimized
              />
            )}
          </span>
          <span className={styles.checkboxLabel}>
            I agree to the{" "}
            <Link href="/terms-conditions" className={styles.link}>
              Terms Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className={styles.link}>
              Privacy Policy
            </Link>
          </span>
        </label>

        <div className={styles.actionsRow}>
          <div
            className={`${styles.googleWrap} ${
              !agreed ? styles.googleWrapDisabled : ""
            }`}
            aria-disabled={!agreed}
          >
            <GoogleCredentialButton
              onSuccess={handleCredential}
              onError={handleError}
              theme="filled_black"
              size="large"
              shape="pill"
              text="continue_with"
              logo_alignment="left"
            />
          </div>

          {errorText && <div className={styles.error}>{errorText}</div>}

          <button
            type="button"
            onClick={onClose}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </div>
    </AppModal>
  );
}
