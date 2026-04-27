"use client";

import { GoogleLogin } from "@react-oauth/google";

import AppModal from "@/components/HomePage/common/AppModal/AppModal";
import SimpleCheckbox from "@/components/common/SimpleCheckbox/SimpleCheckbox";
import { useGoogleLogin } from "@/hooks/useGoogleLogin";
import styles from "./LoginModal.module.css";

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const { handleCredential, handleError, errorText } = useGoogleLogin(onClose);
  return (
    <AppModal open={open} onClose={onClose} title="Welcome to GPTiti ">
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ color: "#A9BEDC", fontSize: 14, lineHeight: 1.4, marginBottom: '32px' }}>
          Premium AI models. No subscriptions. Just access. 
        </div>
        <div style={{ color: "#ffffff", fontSize: 14, lineHeight: 1.4, marginBottom: '9px' }}>
          🎁 10,000 free tokens for your first sign-in 
        </div>
        <div style={{ color: "#ffffff", fontSize: 14, lineHeight: 1.4, marginBottom: '9px' }}>
          ⚡ Access to premium GPT models  
        </div>
        <div style={{ color: "#ffffff", fontSize: 14, lineHeight: 1.4, marginBottom: '9px' }}>
          🎁 Weekly token gifts — automatically unlocked  
        </div>
        <div style={{ color: "#ffffff", fontSize: 14, lineHeight: 1.4, marginBottom: '9px' }}>
          ⏳ Tokens never expire — use them anytime 
        </div>

        <div style={{ height: 1, width: "100%", background: "#243052", margin: "16px 0" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <SimpleCheckbox ariaLabel="Accept terms" />
          <div style={{ fontSize: 14, color: "#A9BEDC" }}>
            I agree to the Terms Conditions and Privacy Policy
          </div>
        </div>
        <div className={styles.actionsRow}>
          <div className={styles.googleWrap}>
          <GoogleLogin
            onSuccess={handleCredential}
            onError={handleError}
            theme="filled_black" 
            size="large"
            shape="pill"
            text="continue_with"
            logo_alignment="left"
            width="auto"
          />
        </div>

        {errorText && (
          <div style={{ color: "#ffb4b4", fontSize: 13 }}>
            {errorText}
          </div>
        )}

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