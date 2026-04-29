import React from "react";
import styles from "./SectionGptUser.module.css";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import LoginModal from "@/components/HomePage/common/LoginModal/LoginModal";
import ErrorPatchImgModal from "../../common/ErrorPatchImgModal/ErrorPatchImgModal";

export default function SectionGptUser() {
  const { user, accessToken, logout } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);
  const isLoggedIn = Boolean(accessToken || user);

  const handleLogout = async () => {
    await logout();
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
