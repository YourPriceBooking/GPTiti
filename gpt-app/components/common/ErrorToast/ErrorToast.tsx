"use client";

import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectErrorToast } from "@/redux/ui/selectors";
import { hideErrorToast } from "@/redux/ui/slice";

import styles from "./ErrorToast.module.css";

const AUTO_CLOSE_MS = 6000;

export default function ErrorToast() {
  const dispatch = useAppDispatch();
  const toast = useAppSelector(selectErrorToast);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(
      () => dispatch(hideErrorToast(toast.id)),
      AUTO_CLOSE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [dispatch, toast]);

  if (!toast) return null;

  return (
    <div className={styles.viewport} aria-live="assertive" aria-atomic="true">
      <div className={styles.toast} role="alert">
        <span className={styles.indicator} aria-hidden="true">
          !
        </span>
        <p className={styles.message}>{toast.message}</p>
        <button
          type="button"
          className={styles.close}
          onClick={() => dispatch(hideErrorToast(toast.id))}
          aria-label="Close notification"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <use href="/icons/ui-sprite.svg#ui-close" />
          </svg>
        </button>
      </div>
    </div>
  );
}
