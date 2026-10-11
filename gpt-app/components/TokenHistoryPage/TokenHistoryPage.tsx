"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoginModal from "@/components/HomePage/common/LoginModal/LoginModal";
import { useAppSelector } from "@/redux/hooks";
import { selectIsLoggedIn } from "@/redux/auth/selectors";
import { selectBalance, selectBalanceReady } from "@/redux/tokens/selectors";
import { clearTokenHistoryDraft } from "@/lib/tokenHistoryDraft";
import styles from "./TokenHistoryPage.module.css";

export default function TokenHistoryPage() {
  const router = useRouter();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const balance = useAppSelector(selectBalance);
  const balanceReady = useAppSelector(selectBalanceReady);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) clearTokenHistoryDraft();
  }, [isLoggedIn]);

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <nav className={styles.nav} aria-label="Token history navigation">
          <button
            type="button"
            className={styles.back}
            onClick={() => {
              if (window.history.length > 1) router.back();
              else router.replace("/");
            }}
          >
            <span aria-hidden="true">←</span> Back
          </button>
          <Link href="/" className={styles.home} aria-label="GPTiti home">
            <Image src="/icons/text-logo.svg" width={130} height={35} alt="GPTiti" />
          </Link>
        </nav>

        <header className={styles.header}>
          <div>
            <h1>Token history</h1>
            <p>Your balance and token activity in one place.</p>
          </div>
          {isLoggedIn && (
            <div className={styles.balance}>
              <div>
                <span>Current balance</span>
                <strong aria-live="polite">
                  {balanceReady ? balance.toLocaleString("en-US") : "Syncing…"}
                </strong>
              </div>
              <Image src="/icons/badge.svg" width={32} height={32} alt="" />
            </div>
          )}
        </header>

        <section className={styles.notice} aria-labelledby="history-status">
          <div className={styles.icon}>
            <Image src="/icons/token-history.svg" width={28} height={28} alt="" />
          </div>
          <h2 id="history-status">
            {isLoggedIn ? "Token history is coming soon" : "Sign in to view your token history"}
          </h2>
          <p>
            {isLoggedIn
              ? "Your token activity will appear here when history becomes available."
              : "Access the balance and token activity for your account."}
          </p>
          {isLoggedIn ? (
            <Link href="/top-up-your-tokens" className={styles.action}>
              Top up tokens
            </Link>
          ) : (
            <button type="button" className={styles.action} onClick={() => setLoginOpen(true)}>
              Sign in
            </button>
          )}
        </section>
      </div>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </main>
  );
}
