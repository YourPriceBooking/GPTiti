"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectIsLoggingOut, selectUser } from "@/redux/auth/selectors";
import { selectBalance, selectBalanceReady } from "@/redux/tokens/selectors";
import { logoutUser } from "@/redux/auth/operations";
import { captureTokenHistoryDraft } from "@/lib/tokenHistoryDraft";
import AccountAvatar from "../SectionGptUser/AccountAvatar";
import SendTokensModal from "@/components/SendTokensButton/SendTokensModal";
import styles from "./AccountMenu.module.css";

function MenuIcon({ kind }: { kind: "history" | "topup" | "send" | "logout" }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === "history" && <><path d="M3 11a9 9 0 1 1 2.6 7M3 5v6h6" /><path d="M12 7v5l3 2" /></>}
    {kind === "topup" && <><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></>}
    {kind === "send" && <><path d="m21 3-7 18-4-7-7-4 18-7ZM10 14 21 3" /></>}
    {kind === "logout" && <><path d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5M9 12h12m-4-4 4 4-4 4" /></>}
  </svg>;
}

export default function AccountMenu({ onNavigate }: { onNavigate?: () => void }) {
  const user = useAppSelector(selectUser);
  const balance = useAppSelector(selectBalance);
  const balanceReady = useAppSelector(selectBalanceReady);
  const loggingOut = useAppSelector(selectIsLoggingOut);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const firstFocus = useRef<"first" | "last">("first");
  const [open, setOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [error, setError] = useState("");
  const close = useCallback((restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) trigger.current?.focus();
  }, []);
  const closeTransfer = useCallback(() => setSendOpen(false), []);

  useLayoutEffect(() => {
    const panel = menu.current;
    const button = trigger.current;
    if (!open || !panel || !button) return;
    const position = () => {
      const viewport = window.visualViewport;
      const leftEdge = (viewport?.offsetLeft ?? 0) + 8;
      const topEdge = (viewport?.offsetTop ?? 0) + 8;
      const width = viewport?.width ?? document.documentElement.clientWidth;
      const height = viewport?.height ?? window.innerHeight;
      panel.style.maxWidth = `${width - 16}px`;
      panel.style.maxHeight = `${height - 16}px`;
      const anchor = button.getBoundingClientRect();
      const box = panel.getBoundingClientRect();
      panel.style.left = `${Math.max(leftEdge, Math.min(anchor.right + 8, leftEdge + width - 16 - box.width))}px`;
      panel.style.top = `${Math.max(topEdge, Math.min(anchor.bottom - box.height, topEdge + height - 16 - box.height))}px`;
      panel.style.visibility = "visible";
    };
    position();
    const items = panel.querySelectorAll<HTMLElement>("[role=menuitem]");
    items[firstFocus.current === "last" ? items.length - 1 : 0]?.focus();
    const observer = new ResizeObserver(position);
    observer.observe(panel);
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    viewportListeners(true);
    function viewportListeners(add: boolean) {
      const viewport = window.visualViewport;
      if (add) { viewport?.addEventListener("resize", position); viewport?.addEventListener("scroll", position); }
      else { viewport?.removeEventListener("resize", position); viewport?.removeEventListener("scroll", position); }
    }
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
      viewportListeners(false);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const outside = (event: Event) => {
      const target = event.target as Node;
      if (!menu.current?.contains(target) && !trigger.current?.contains(target)) close();
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", outside);
    };
  }, [open, close]);

  const onMenuKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault(); event.stopPropagation(); close(true); return;
    }
    if (event.key === "Tab") { close(true); return; }
    const items = Array.from(menu.current?.querySelectorAll<HTMLElement>("[role=menuitem]:not(:disabled)") ?? []);
    const current = items.indexOf(document.activeElement as HTMLElement);
    let next: number;
    if (event.key === "ArrowDown") next = (current + 1) % items.length;
    else if (event.key === "ArrowUp") next = (current - 1 + items.length) % items.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    else return;
    event.preventDefault(); items[next]?.focus();
  };
  const navigate = () => { captureTokenHistoryDraft(); close(); onNavigate?.(); };
  const logOut = async () => {
    if (loggingOut) return;
    setError("");
    const result = await dispatch(logoutUser());
    if (logoutUser.fulfilled.match(result)) {
      close();
      onNavigate?.();
      router.replace("/");
    } else if (!result.meta.condition) {
      setError(result.payload ?? "Could not log out. Please try again.");
    }
  };

  return <>
    <button ref={trigger} type="button" className={styles.trigger} aria-label="Account menu" aria-haspopup="menu" aria-expanded={open} aria-controls={open ? id : undefined}
      onClick={() => { firstFocus.current = "first"; setOpen(!open); }}
      onKeyDown={event => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault(); firstFocus.current = event.key === "ArrowUp" ? "last" : "first"; setOpen(true);
        }
      }}>
      <AccountAvatar />
      {!open && <span className={styles.tooltip}>Account</span>}
    </button>
    {open && createPortal(
      <div ref={menu} className={styles.panel} onKeyDown={onMenuKeyDown}>
        <div className={styles.identity}>
          <AccountAvatar />
          <div className={styles.identityText}>
            <strong>{user?.name || "Your account"}</strong>
            <span title={user?.email}>{user?.email}</span>
          </div>
        </div>
        <div id={id} role="menu" aria-label="Account">
          <Link href="/token-history" role="menuitem" tabIndex={-1} className={styles.item} onClick={navigate}>
            <MenuIcon kind="history" />
            <span className={styles.historyLabel}>Token history<span className={styles.balance}>{balanceReady ? `${balance.toLocaleString("en-US")} TITI` : "Syncing balance…"}</span></span>
          </Link>
          <Link href="/top-up-your-tokens" role="menuitem" tabIndex={-1} className={styles.item} onClick={navigate}><MenuIcon kind="topup" />Top up tokens</Link>
          <button type="button" role="menuitem" tabIndex={-1} className={styles.item} onClick={() => { close(true); setSendOpen(true); }}><MenuIcon kind="send" />Send tokens</button>
          <div role="separator" className={styles.separator} />
          <button type="button" role="menuitem" tabIndex={-1} className={styles.item} disabled={loggingOut} onClick={() => void logOut()}><MenuIcon kind="logout" />{loggingOut ? "Logging out…" : "Log out"}</button>
        </div>
        {error && <p role="alert" className={styles.error}>{error}</p>}
      </div>, document.body,
    )}
    {sendOpen && createPortal(<SendTokensModal onClose={closeTransfer} />, document.body)}
  </>;
}
