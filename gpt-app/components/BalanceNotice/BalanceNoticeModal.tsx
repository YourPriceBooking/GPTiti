"use client";

import { useEffect, useId, useRef } from "react";
import Link from "next/link";
import type { BalanceNotice } from "@/lib/chat/chatProtocol";
import { captureTokenHistoryDraft } from "@/lib/tokenHistoryDraft";
import styles from "./BalanceNoticeModal.module.css";

type Props = {
  notice: BalanceNotice;
  onClose: () => void;
  onChooseModel: () => void;
};

const formatTokens = (value: number) =>
  `${value.toLocaleString("en-US", { maximumFractionDigits: 6 }).replace("-", "−")} TITI`;

export default function BalanceNoticeModal({ notice, onClose, onChooseModel }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const blocked = notice.error.code === "BALANCE_LIMIT_EXCEEDED";
  const { balance, availableTokens, estimatedTokens } = notice.error.details ?? {};
  // No cheaper model can help when the server explicitly reports no available tokens.
  const canChooseModel = !blocked && (availableTokens === undefined || availableTokens > 0);

  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement;
    element?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = overflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
  }, []);

  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
      }}
    >
      <button className={styles.close} type="button" aria-label="Close notification" onClick={onClose}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
      </button>
      <div className={`${styles.icon} ${blocked ? styles.blockedIcon : ""}`}>
        <svg width="42" height="42" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M25 12V8a2 2 0 0 0-2-2L7 10a3 3 0 0 0-3 3v12a2 2 0 0 0 2 2h17a2 2 0 0 0 2-2V14a2 2 0 0 0-2-2H7" />
          {blocked ? <><rect x="19" y="22" width="10" height="8" rx="2" fill="var(--notice-panel)" /><path d="M21 22v-3a3 3 0 0 1 6 0v3M24 25v2" /></> : <><path d="M26 17h-6a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h6z" /><path d="M22 20h.1" /></>}
        </svg>
      </div>
      <h2 id={titleId} className={styles.title}>{blocked ? "Top up to continue" : "Not enough tokens"}</h2>
      <p id={descriptionId} className={styles.description}>
        {blocked
          ? "Your balance is below −1,000 TITI. New requests are paused for all models."
          : canChooseModel
            ? "You may not have enough tokens for this request. Top up or choose a lower-cost model."
            : "You don’t have enough available tokens for this request. Top up to continue."}
      </p>
      {blocked ? (
        balance !== undefined && <div className={styles.summary}><span>Current balance</span><strong className={styles.debt}>{formatTokens(balance)}</strong></div>
      ) : (
        (availableTokens !== undefined || estimatedTokens !== undefined) && <dl className={styles.summary}>
          {availableTokens !== undefined && <div className={styles.row}><dt>Available</dt><dd>{formatTokens(availableTokens)}</dd></div>}
          {estimatedTokens !== undefined && <div className={styles.row}><dt>Estimated cost</dt><dd>{formatTokens(estimatedTokens)}</dd></div>}
        </dl>
      )}
      {blocked ? <p className={styles.note}>Your top-up will cover the negative balance first.<br />Add enough tokens for your next request.</p>
        : notice.requestRejected && <p className={styles.note}>Your request hasn’t been sent.</p>}
      <div className={styles.actions}>
        <Link className={styles.primary} href="/top-up-your-tokens" onClick={() => { captureTokenHistoryDraft(); onClose(); }}>
          Top up tokens <span aria-hidden="true">→</span>
        </Link>
        {canChooseModel ? <button type="button" className={styles.secondary} onClick={onChooseModel}>Choose a cheaper model</button>
          : <button type="button" className={styles.back} onClick={onClose}>Back to chat</button>}
      </div>
    </dialog>
  );
}
