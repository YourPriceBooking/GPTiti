"use client";

import Image from "next/image";
import Link from "next/link";
import ActionTooltip from "@/components/common/ActionTooltip/ActionTooltip";
import { captureTokenHistoryDraft } from "@/lib/tokenHistoryDraft";
import styles from "./TokenBalanceLink.module.css";

type Props = {
  balance: number;
  variant?: "sidebar" | "card" | "compact";
  onNavigate?: () => void;
};

export default function TokenBalanceLink({
  balance,
  variant = "sidebar",
  onNavigate,
}: Props) {
  const formatted = balance.toLocaleString("en-US");
  const amount = variant === "card" ? formatted : formatted.replaceAll(",", "\u00a0");

  return (
    <Link
      href="/token-history"
      className={`${styles.link} ${styles[variant]}`}
      aria-label={`Token history. Balance: ${formatted} tokens`}
      data-token-balance={variant}
      onNavigate={() => {
        captureTokenHistoryDraft();
        onNavigate?.();
      }}
    >
      <span className={styles.value}>
        {variant === "card" && (
          <span className={styles.label}>Balance tokens</span>
        )}
        <span className={styles.amount}>{amount}</span>
      </span>
      <Image
        className={styles.history}
        src="/icons/token-history.svg"
        width={18}
        height={18}
        alt=""
      />
      {variant !== "compact" && (
        <Image
          className={styles.token}
          src="/icons/badge.svg"
          width={variant === "card" ? 30 : 24}
          height={variant === "card" ? 30 : 24}
          alt=""
        />
      )}
      <ActionTooltip label="Token history" appearance="plain" />
    </Link>
  );
}
