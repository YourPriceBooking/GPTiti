import React from "react";

import AccountAvatar from "./AccountAvatar";

import { useAppSelector } from "@/redux/hooks";
import { selectIsLoggedIn } from "@/redux/auth/selectors";

import LoginModal from "@/components/HomePage/common/LoginModal/LoginModal";

import styles from "./SectionGptUser.module.css";

export default function SectionGptUser() {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  const [isLoginOpen, setIsLoginOpen] = React.useState(false);

  if (isLoggedIn) return null;

  return (
    <section className={styles.gptUser}>
      <article className={styles.userInfo}>
        <AccountAvatar />

        <span className={styles.gptUserEmail}>Guest</span>
      </article>

      <div className={styles.logoutBtnContainer}>
          <button
            className={styles.loginBtn}
            onClick={() => setIsLoginOpen(true)}
          >
            <span className={styles.loginBtnSpan}>
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  marginRight: "8px",
                  lineHeight: "28px",
                }}
              >
                G
              </span>
              Continue in with Google
            </span>
          </button>
      </div>
      <LoginModal open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </section>
  );
}
