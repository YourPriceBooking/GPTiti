import React from 'react';
import styles from './SectionGptUser.module.css';
import Image from 'next/image';
import Link from "next/link";
import { useAuth } from '@/context/AuthContext';

export default function SectionGptUser() {
  const { user, accessToken, logout } = useAuth();

  const isLoggedIn = Boolean(accessToken || user);

  const handleLogout = async () => {
    await logout();
  };

  return (
   <section className={styles.gptUser}>
        <article className={styles.userInfo}>
          <Image
            width={27.11}
            height={35.65}
            src="/icons/ghost-user.svg"
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
            <Link className={styles.logoutBtn} href="/sign-in">
              <span className={styles.logoutBtnSpan}>Log in with Google</span>
            </Link>
          )}
        </div>
      </section>
  )
}
