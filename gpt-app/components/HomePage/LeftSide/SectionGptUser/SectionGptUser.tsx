import React from 'react';
import styles from './SectionGptUser.module.css';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

export default function SectionGptUser() {
  const { user, logout } = useAuth();

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
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <span className={styles.logoutBtnSpan}>Log out</span>
          </button>
        </div>
      </section>
  )
}
