import React from 'react'
import styles from './FooterLeftSide.module.css'
import Link from 'next/link'

export default function FooterLeftSide() {
  return (
     <footer className={styles.footer}>
        <ul className={styles.footerList}>
          <li className={styles.footerItem}>
            <Link href="/" className={styles.footerLink}>Home</Link>
          </li>
          <li className={styles.footerItem}>
            <Link href="/our-mission" className={styles.footerLink}>Our Mission</Link>
          </li>
          <li className={styles.footerItem}>
            <Link href="/sign-in" className={styles.footerLink}>Sign in</Link>
          </li>
        </ul>

        <ul className={styles.footerList1}>
          <li className={styles.footerItem}>
            <Link href="/terms-conditions" className={styles.footerLink}>Terms & Conditions</Link>
          </li>
          <li className={styles.footerItem}>
            <Link href="/privacy-policy" className={styles.footerLink}>Privacy Policy</Link>
          </li>
        </ul>

        <section className={styles.footerSection}>
          <span className={styles.footerSpan}>
            * We show an approximate price based on a typical 30-word message.
            Real token usage depends on how much you write — shorter prompts cost less,
            longer ones cost more.
          </span>
          <p className={styles.footerParagraph}>
            © 2025 Your Price Booking. All rights reserved.
          </p>
        </section>
      </footer>
  )
}
