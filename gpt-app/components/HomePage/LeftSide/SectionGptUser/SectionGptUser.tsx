import React from "react";

import Image from "next/image";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectIsLoggedIn, selectUser } from "@/redux/auth/selectors";
import { logoutUser } from "@/redux/auth/operations";

import LoginModal from "@/components/HomePage/common/LoginModal/LoginModal";

import styles from "./SectionGptUser.module.css";

export default function SectionGptUser() {
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  const [isLoginOpen, setIsLoginOpen] = React.useState(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
  };

  return (
    <section className={styles.gptUser}>
      <article className={styles.userInfo}>
        <Image
          className={styles.userAvatar}
          width={27.11}
          height={35.65}
          src={user?.avatar || "/icons/ghost-user.svg"}
          alt="ghost-user"
        />

        <span className={styles.gptUserEmail}>{user?.email || "Guest"}</span>
      </article>

      <div className={styles.logoutBtnContainer}>
        {isLoggedIn ? (
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <span className={styles.logoutBtnSpan}>Log out</span>
          </button>
        ) : (
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
        )}
      </div>
      <LoginModal open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </section>
  );
}
