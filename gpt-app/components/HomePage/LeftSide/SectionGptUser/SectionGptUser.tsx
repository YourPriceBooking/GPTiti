import React from 'react';
import styles from './SectionGptUser.module.css';
import Image from 'next/image';

export default function SectionGptUser() {
  return (
   <section className={styles.gptUser}>
        <article className={styles.userInfo}>
          <Image
            width={27.11}
            height={35.65}
            src="/icons/ghost-user.svg"
            alt="ghost-user"
          />
          <span className={styles.gptUserEmail}>henrinkwinta@gmail.com</span>
        </article>

        <div className={styles.logoutBtnContainer}>
          <button className={styles.logoutBtn}>
            <span className={styles.logoutBtnSpan}>Log out</span>
          </button>
        </div>
      </section>
  )
}
