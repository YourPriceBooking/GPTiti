"use client";

import Image from "next/image";
import Link from "next/link";
import ActionTooltip from "@/components/common/ActionTooltip/ActionTooltip";
import { captureTokenHistoryDraft } from "@/lib/tokenHistoryDraft";
import { useAppSelector } from "@/redux/hooks";
import { selectReservedTokens, selectAvailableTokens } from "@/redux/tokens/selectors";
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
  const reserved = useAppSelector(selectReservedTokens);
  const available = useAppSelector(selectAvailableTokens);
  const formatted = balance.toLocaleString("en-US");
  const amount = variant === "card" ? formatted : formatted.replaceAll(",", "\u00a0");

  return (
    <Link
      href="/token-history"
      className={`${styles.link} ${styles[variant]}`}
      aria-label={`Token history. Balance: ${formatted} tokens${reserved > 0 ? `. Reserved for requests: ${reserved.toLocaleString("en-US")} TITI. Available: ${available.toLocaleString("en-US")} TITI` : ""}`}
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
        {reserved > 0 && <span className={styles.reservations} aria-live="polite" aria-atomic="true">
          <span>Reserved for requests: <strong>{reserved.toLocaleString("en-US")} TITI</strong></span>
          <span>Available: <strong>{available.toLocaleString("en-US")} TITI</strong></span>
        </span>}
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
