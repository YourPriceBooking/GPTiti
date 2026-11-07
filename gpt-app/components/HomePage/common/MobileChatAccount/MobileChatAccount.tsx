"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AccountAvatar from "../../LeftSide/SectionGptUser/AccountAvatar";
import LoginModal from "../LoginModal/LoginModal";
import { useAppSelector } from "@/redux/hooks";
import { selectIsLoggedIn } from "@/redux/auth/selectors";
import { selectBalance, selectBalanceReady } from "@/redux/tokens/selectors";
import { captureTokenHistoryDraft } from "@/lib/tokenHistoryDraft";
import styles from "./MobileChatAccount.module.css";

export default function MobileChatAccount() {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const balance = useAppSelector(selectBalance);
  const balanceReady = useAppSelector(selectBalanceReady);
  const [loginOpen, setLoginOpen] = useState(false);
  const formatted = balance.toLocaleString("en-US");
  return (
    <div className={styles.root} data-mobile-chat-account>
      {isLoggedIn ? (
        <Link
          href="/token-history"
          className={styles.account}
          aria-label={balanceReady ? `Token history. Balance: ${formatted} TITI` : "Token history. Syncing balance"}
          onNavigate={captureTokenHistoryDraft}
        >
          <AccountAvatar />
          <span className={styles.amount}>{balanceReady ? formatted : "…"}</span>
          <Image src="/icons/token-history.svg" alt="" width={16} height={16} />
        </Link>
      ) : (
        <button type="button" className={styles.signIn} onClick={() => setLoginOpen(true)}>
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.7-.4-4.1H24v7.9h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15.1Z" />
            <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5.1a12.3 12.3 0 0 1-18.3-6.4H5.8v5.3A20.4 20.4 0 0 0 24 44Z" />
            <path fill="#FBBC05" d="M12.6 27.6a12.2 12.2 0 0 1 0-7.2v-5.3H5.8a20.4 20.4 0 0 0 0 18l6.8-5.5Z" />
            <path fill="#EA4335" d="M24 11.6c3 0 5.7 1 7.8 3.1l5.9-5.9A19.6 19.6 0 0 0 24 4 20.4 20.4 0 0 0 5.8 15.1l6.8 5.3A12.1 12.1 0 0 1 24 11.6Z" />
          </svg>
          Continue with Google
        </button>
      )}
      <LoginModal open={loginOpen && !isLoggedIn} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
