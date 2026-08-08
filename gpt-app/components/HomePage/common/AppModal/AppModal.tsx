"use client";

import React, { useCallback, useEffect, useRef } from "react";
import styles from "./AppModal.module.css";

type AppModalProps = {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  showCloseButton?: boolean;
  dividers?: boolean;
  paperClassName?: string;
  titleClassName?: string;
  contentClassName?: string;
  closeBtnClassName?: string;
};

export default function AppModal({
  open,
  onClose,
  title,
  children,
  showCloseButton = true,
  dividers = true,
  paperClassName,
  titleClassName,
  contentClassName,
  closeBtnClassName,
}: AppModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const closingFromProp = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      return;
    }
    if (!open && dialog.open) {
      closingFromProp.current = true;
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      if (closingFromProp.current) {
        closingFromProp.current = false;
        return;
      }
      onClose();
    };

    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDialogElement>) => {
      if (event.target === event.currentTarget) onClose();
    },
    [onClose],
  );

  const closeButton = (extraClass?: string) => (
    <button
      type="button"
      className={`${styles.closeBtn} ${extraClass ?? ""} ${closeBtnClassName ?? ""}`}
      aria-label="Close modal"
      onClick={onClose}
    >
      <svg
        className={styles.closeIcon}
        viewBox="0 0 24 24"
        width="20"
        height="20"
        aria-hidden="true"
        focusable="false"
      >
        <use href="/icons/ui-sprite.svg#ui-close" />
      </svg>
    </button>
  );

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      onClick={handleBackdropClick}
    >
      <div className={`${styles.paper} ${paperClassName ?? ""}`}>
        {title != null ? (
          <div className={`${styles.title} ${titleClassName ?? ""}`}>
            <span className={styles.titleText}>{title}</span>
            {showCloseButton && closeButton()}
          </div>
        ) : (
          showCloseButton && closeButton(styles.closeBtnFloating)
        )}

        <div
          className={`${styles.content} ${dividers ? styles.contentDividers : ""} ${contentClassName ?? ""}`}
        >
          {children}
        </div>
      </div>
    </dialog>
  );
}
