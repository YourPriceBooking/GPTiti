"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import axios from "axios";
import Image from "next/image";

import { api } from "@/helpers/api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectBalance, selectBalanceReady } from "@/redux/tokens/selectors";
import { applyBalanceSnapshot } from "@/redux/tokens/slice";
import { refreshCurrentBalance } from "@/redux/tokens/operations";
import { readBalanceSnapshot } from "@/lib/balance/balanceProtocol";
import type {
  SendTokensPayload,
  TokenTransferErrorResponse,
} from "@/types/api.types";

import styles from "./SendTokensModal.module.css";

type LookupStatus = "idle" | "checking" | "valid" | "error";

const transferErrors: Record<string, string> = {
  RECIPIENT_DELETED:
    "This user deleted their account. The transfer is unavailable.",
  RECIPIENT_NOT_FOUND: "User not found.",
  SELF_TRANSFER: "You cannot send tokens to yourself.",
  INSUFFICIENT_BALANCE: "Insufficient balance.",
};

function errorMessage(
  data: { code?: string; message?: string } | undefined,
  fallback: string,
) {
  return (data?.code && transferErrors[data.code]) || data?.message || fallback;
}

interface Props {
  onClose: () => void;
}

export default function SendTokensModal({ onClose }: Props) {
  const dispatch = useAppDispatch();
  const balance = useAppSelector(selectBalance);
  const [stage, setStage] = useState<"form" | "confirm">("form");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [lookupStatus, setLookupStatus] = useState<LookupStatus>("idle");
  const [lookupError, setLookupError] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const balanceReady = useAppSelector(selectBalanceReady);
  const availableTokens = balanceReady ? balance : null;
  const applyResponse = useCallback((data: unknown) => {
    const snapshot = readBalanceSnapshot(data);
    if (snapshot) dispatch(applyBalanceSnapshot(snapshot));
    else void dispatch(refreshCurrentBalance());
  }, [dispatch]);
  const [sendError, setSendError] = useState("");
  const [sending, setSending] = useState(false);
  const [receipt, setReceipt] = useState<{
    email: string;
    amount: number;
    status: "pending" | "confirmed" | "failed";
    operationId?: string;
  } | null>(null);
  const [receiptBalanceState, setReceiptBalanceState] = useState<
    "current" | "refreshing" | "unavailable"
  >("current");
  const lookupVersion = useRef(0);
  const lookupAbort = useRef<AbortController | null>(null);
  const finalAbort = useRef<AbortController | null>(null);
  const refreshAbort = useRef<AbortController | null>(null);
  const pendingTransfer = useRef<SendTokensPayload | null>(null);
  const requestInFlight = useRef(false);
  const emailInput = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLElement>(null);
  const confirmButton = useRef<HTMLButtonElement>(null);

  const normalizedEmail = email.trim();
  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
  const parsedAmount = Number(amount);
  const amountIsPositive =
    /^\d+$/.test(amount) &&
    Number.isSafeInteger(parsedAmount) &&
    parsedAmount > 0;
  const amountIsValid =
    amountIsPositive &&
    availableTokens !== null &&
    parsedAmount <= availableTokens;
  const pendingMatches =
    pendingTransfer.current?.email.toLowerCase() ===
      normalizedEmail.toLowerCase() &&
    pendingTransfer.current?.amount === parsedAmount;
  const canContinue =
    lookupStatus === "valid" &&
    verifiedEmail.toLowerCase() === normalizedEmail.toLowerCase() &&
    (amountIsValid || pendingMatches) &&
    !sending;
  const shownBalance = availableTokens ?? balance;
  const insufficientBalance =
    amountIsPositive &&
    availableTokens !== null &&
    parsedAmount > availableTokens &&
    !pendingMatches;

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    emailInput.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !requestInFlight.current) onClose();
      if (event.key !== "Tab") return;
      const controls = modalRef.current?.querySelectorAll<HTMLElement>(
        "button:not(:disabled), input:not(:disabled)",
      );
      if (!controls?.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      lookupVersion.current += 1;
      lookupAbort.current?.abort();
      finalAbort.current?.abort();
      refreshAbort.current?.abort();
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [onClose]);

  useEffect(() => {
    if (stage === "confirm") confirmButton.current?.focus();
  }, [stage]);

  useEffect(() => {
    if (!emailLooksValid || receipt || stage !== "form") return;
    const version = lookupVersion.current;
    const timer = window.setTimeout(async () => {
      const controller = new AbortController();
      lookupAbort.current = controller;
      setLookupStatus("checking");
      try {
        const result = await api.getTokenTransferRecipient(
          normalizedEmail,
          controller.signal,
        );
        if (version !== lookupVersion.current) return;
        applyResponse(result);
        if (result.success && result.canTransfer) {
          setVerifiedEmail(result.recipient.email);
          setLookupStatus("valid");
          setLookupError("");
        } else {
          setLookupStatus("error");
          setLookupError(
            errorMessage(result, "This recipient cannot receive tokens."),
          );
        }
      } catch (error) {
        if (version !== lookupVersion.current || controller.signal.aborted)
          return;
        const data = axios.isAxiosError<TokenTransferErrorResponse>(error)
          ? error.response?.data
          : undefined;
        applyResponse(data);
        setLookupStatus("error");
        setLookupError(
          errorMessage(data, "Could not check this email. Try again."),
        );
      }
    }, 300);
    return () => window.clearTimeout(timer);
  }, [email, normalizedEmail, emailLooksValid, receipt, stage, applyResponse]);

  useEffect(() => {
    if (receipt?.status !== "pending" || !receipt.operationId) return;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    const poll = async () => {
      try {
        const operation = await api.getTokenOperation(receipt.operationId!, controller.signal);
        if (controller.signal.aborted) return;
        if (operation.status !== "pending") {
          setReceipt((current) => current ? { ...current, status: operation.status } : current);
          void dispatch(refreshCurrentBalance());
          return;
        }
      } catch { if (controller.signal.aborted) return; }
      timer = setTimeout(() => void poll(), 2000);
    };
    timer = setTimeout(() => void poll(), 2000);
    return () => { controller.abort(); clearTimeout(timer); };
  }, [receipt?.operationId, receipt?.status, dispatch]);

  const changeEmail = (value: string) => {
    lookupVersion.current += 1;
    lookupAbort.current?.abort();
    pendingTransfer.current = null;
    setEmail(value);
    setVerifiedEmail("");
    setLookupStatus("idle");
    setLookupError("");
    setSendError("");
  };

  const changeAmount = (value: string) => {
    const digits = value.replaceAll(",", "");
    if (digits && !/^\d+$/.test(digits)) return;
    pendingTransfer.current = null;
    setAmount(digits);
    setSendError("");
  };

  const continueToConfirm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canContinue) return;
    setSendError("");
    setStage("confirm");
  };

  const refreshReceiptBalance = () => {
    const controller = new AbortController();
    refreshAbort.current = controller;
    const request = dispatch(refreshCurrentBalance());
    if (!request) { setReceiptBalanceState("unavailable"); return; }
    void request.unwrap().then(() => {
      if (!controller.signal.aborted) setReceiptBalanceState("current");
    }).catch(() => {
      if (!controller.signal.aborted) setReceiptBalanceState("unavailable");
    });
  };

  const finalSend = async () => {
    if (!canContinue || stage !== "confirm" || requestInFlight.current) return;
    requestInFlight.current = true;
    setSending(true);
    setSendError("");
    lookupVersion.current += 1;
    lookupAbort.current?.abort();

    try {
      let payload = pendingTransfer.current;
      if (!payload) {
        const controller = new AbortController();
        finalAbort.current = controller;
        const check = await api.getTokenTransferRecipient(
          normalizedEmail,
          controller.signal,
        );
        applyResponse(check);
        if (!check.success || !check.canTransfer) {
          setLookupStatus("error");
          setLookupError(
            errorMessage(check, "This recipient cannot receive tokens."),
          );
          setStage("form");
          return;
        }
        if (parsedAmount > check.appTokens) {
          setSendError("Insufficient balance. Please reduce the amount.");
          setStage("form");
          return;
        }
        payload = {
          email: check.recipient.email,
          amount: parsedAmount,
          clientTransferId: crypto.randomUUID(),
        };
        pendingTransfer.current = payload;
      }

      const result = await api.sendTokens(payload);
      if (!result.success) {
        pendingTransfer.current = null;
        applyResponse(result);
        setSendError(
          result.code === "INSUFFICIENT_BALANCE" &&
            typeof result.appTokens === "number"
            ? ""
            : errorMessage(result, "Could not send tokens. Try again."),
        );
        if (
          [
            "RECIPIENT_DELETED",
            "RECIPIENT_NOT_FOUND",
            "SELF_TRANSFER",
          ].includes(result.code ?? "")
        ) {
          setLookupStatus("error");
          setLookupError(
            errorMessage(result, "This recipient cannot receive tokens."),
          );
        }
        if (result.code) setStage("form");
        return;
      }

      pendingTransfer.current = null;
      if (result.operation?.status === "failed") {
        setSendError("Transfer failed. Your confirmed balance has not changed.");
        void dispatch(refreshCurrentBalance());
        return;
      }
      applyResponse(result);
      setReceiptBalanceState("refreshing");
      setReceipt({ email: payload.email, amount: payload.amount,
        status: result.operation?.status ?? "confirmed", operationId: result.operation?.id });
      refreshReceiptBalance();
    } catch (error) {
      const data = axios.isAxiosError<TokenTransferErrorResponse>(error)
        ? error.response?.data
        : undefined;
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;
      const wasPostAttempted = pendingTransfer.current !== null;
      if (data?.code || (status && status < 500))
        pendingTransfer.current = null;
      applyResponse(data);
      setSendError(
        data?.code === "INSUFFICIENT_BALANCE" &&
          typeof data.appTokens === "number"
          ? ""
          : errorMessage(
              data,
              wasPostAttempted
                ? "Connection problem. Try again; the same transfer ID will be used."
                : "Could not verify the recipient. Try again.",
            ),
      );
      if (data?.code === "INSUFFICIENT_BALANCE") setStage("form");
      if (
        ["RECIPIENT_DELETED", "RECIPIENT_NOT_FOUND", "SELF_TRANSFER"].includes(
          data?.code ?? "",
        )
      ) {
        setLookupStatus("error");
        setLookupError(
          errorMessage(data, "This recipient cannot receive tokens."),
        );
        setStage("form");
      }
    } finally {
      requestInFlight.current = false;
      setSending(false);
    }
  };

  const sendAnother = () => {
    refreshAbort.current?.abort();
    setReceipt(null);
    setReceiptBalanceState("current");
    setStage("form");
    setEmail("");
    setAmount("");
    setLookupStatus("idle");
    setVerifiedEmail("");
    setSendError("");
    requestAnimationFrame(() => emailInput.current?.focus());
  };

  return (
    <div
      className={styles.backdrop}
      onClick={(event) => {
        if (event.target === event.currentTarget && !requestInFlight.current)
          onClose();
      }}
    >
      <section
        ref={modalRef}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="send-tokens-title"
        aria-describedby="send-tokens-description"
      >
        {receipt ? (
          <div className={styles.receipt} role="status">
            <span className={styles.successIcon} aria-hidden="true">
              ✓
            </span>
            <h2 id="send-tokens-title">{receipt.status === "pending" ? "Transfer submitted" : receipt.status === "failed" ? "Transfer failed" : "Tokens sent"}</h2>
            <p id="send-tokens-description" className={styles.description}>
              {receipt.amount.toLocaleString("en-US")} tokens {receipt.status === "confirmed" ? "sent" : "submitted"} to{" "}
              {receipt.email}.
            </p>
            <p className={styles.balanceText}>
              {receiptBalanceState === "current"
                ? `Current balance: ${balance.toLocaleString("en-US")} tokens`
                : receiptBalanceState === "refreshing"
                  ? "Refreshing balance…"
                  : "Balance unavailable right now."}
            </p>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={onClose}
              >
                Done
              </button>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={sendAnother}
              >
                Send another
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.icon}>
              <Image src="/icons/send-tokens-modal.svg" alt="" width={32} height={32} />
            </div>
            <h2 id="send-tokens-title">
              {stage === "confirm" ? "Confirm transfer" : "Send tokens"}
            </h2>
            <p id="send-tokens-description" className={styles.description}>
              {stage === "confirm"
                ? "Review the details before sending."
                : "Enter the recipient email and token amount."}
            </p>

            {stage === "confirm" ? (
              <div className={styles.confirmation}>
                <div className={styles.summary}>
                  <div className={styles.summaryRow}>
                    <span>To</span>
                    <strong>
                      {verifiedEmail}{" "}
                      <span className={styles.check} aria-label="Verified">
                        ✓
                      </span>
                    </strong>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Amount</span>
                    <strong>
                      {parsedAmount.toLocaleString("en-US")} tokens
                    </strong>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Balance after transfer</span>
                    <strong>
                      {Math.max(0, shownBalance - parsedAmount).toLocaleString(
                        "en-US",
                      )}{" "}
                      tokens
                    </strong>
                  </div>
                </div>
                <p className={styles.warning}>
                  <span className={styles.warningIcon} aria-hidden="true">
                    !
                  </span>
                  <span>
                    This transfer can&apos;t be undone.
                    <br />
                    Check the recipient email carefully.
                  </span>
                </p>
                {sendError && (
                  <p className={styles.error} role="alert">
                    {sendError}
                  </p>
                )}
                <div className={styles.actions}>
                  <button
                    ref={confirmButton}
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => setStage("form")}
                    disabled={sending}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={() => void finalSend()}
                    disabled={!canContinue}
                  >
                    {sending
                      ? "Sending…"
                      : `Send ${parsedAmount.toLocaleString("en-US")} tokens`}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={continueToConfirm} noValidate>
                <div className={styles.balanceRow}>
                  <span>Available balance</span>
                  <strong>{balanceReady ? `${shownBalance.toLocaleString("en-US")} tokens` : "Syncing balance…"}</strong>
                </div>
                <label className={styles.label} htmlFor="transfer-email">
                  Recipient email
                </label>
                <input
                  ref={emailInput}
                  id="transfer-email"
                  className={styles.input}
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(event) => changeEmail(event.target.value)}
                  disabled={sending}
                  aria-invalid={lookupStatus === "error"}
                  aria-describedby="recipient-feedback"
                />
                <p
                  id="recipient-feedback"
                  className={
                    lookupStatus === "valid"
                      ? styles.validText
                      : lookupStatus === "error" || (email && !emailLooksValid)
                        ? styles.amountError
                        : styles.feedback
                  }
                  aria-live="polite"
                >
                  {lookupStatus === "checking" ? (
                    "Checking recipient…"
                  ) : lookupStatus === "valid" ? (
                    <>
                      <span className={styles.check} aria-hidden="true">
                        ✓
                      </span>{" "}
                      Account found
                    </>
                  ) : lookupStatus === "error" ? (
                    lookupError
                  ) : email && !emailLooksValid ? (
                    "Enter a valid email address."
                  ) : (
                    "We'll verify the account automatically."
                  )}
                </p>

                <label className={styles.label} htmlFor="transfer-amount">
                  Amount
                </label>
                <div
                  className={`${styles.amountField} ${insufficientBalance ? styles.amountInvalid : ""}`}
                >
                  <input
                    id="transfer-amount"
                    className={styles.amountInput}
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="0"
                    value={amount.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    onChange={(event) => changeAmount(event.target.value)}
                    disabled={sending}
                    aria-invalid={insufficientBalance}
                    aria-describedby="amount-feedback"
                  />
                  <span className={styles.unit}>tokens</span>
                  <button
                    type="button"
                    className={styles.maxButton}
                    onClick={() =>
                      changeAmount(String(Math.max(0, availableTokens ?? 0)))
                    }
                    disabled={!balanceReady || lookupStatus !== "valid" || sending}
                  >
                    Max
                  </button>
                </div>
                <p
                  id="amount-feedback"
                  className={
                    insufficientBalance
                      ? `${styles.amountError} ${styles.balanceError}`
                      : styles.hint
                  }
                >
                  {insufficientBalance ? (
                    <>
                      <span
                        className={styles.balanceErrorIcon}
                        aria-hidden="true"
                      />
                      <span>
                        Insufficient balance. You can send up to{" "}
                        {shownBalance.toLocaleString("en-US")} tokens.
                      </span>
                    </>
                  ) : pendingMatches && !amountIsValid ? (
                    "Retrying the pending transfer with the same ID."
                  ) : amount && !amountIsPositive ? (
                    "Enter a positive whole number."
                  ) : amountIsValid ? (
                    `Balance after transfer: ${(shownBalance - parsedAmount).toLocaleString("en-US")} tokens`
                  ) : (
                    ""
                  )}
                </p>
                {sendError && (
                  <p className={styles.error} role="alert">
                    {sendError}
                  </p>
                )}
                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={onClose}
                    disabled={sending}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={styles.primaryButton}
                    disabled={!canContinue}
                  >
                    Continue
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </section>
    </div>
  );
}
