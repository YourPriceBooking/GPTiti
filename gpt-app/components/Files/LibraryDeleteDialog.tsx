"use client";

import { useLayoutEffect, useId, useRef } from "react";
import type { LibraryFile } from "@/lib/files/library";
import { fileSize } from "@/lib/files/types";
import styles from "./Library.module.css";

export default function LibraryDeleteDialog({
  files,
  busy,
  onCancel,
  onConfirm,
}: {
  files: LibraryFile[];
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const warningId = useId();
  const single = files.length === 1;
  const action = single ? "Delete file" : `Delete ${files.length} files`;

  useLayoutEffect(() => {
    const element = dialog.current!;
    const trigger = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    element.showModal();
    cancel.current?.focus({ preventScroll: true });
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      if (trigger instanceof HTMLElement && trigger.isConnected) {
        trigger.focus({ preventScroll: true });
      }
    };
  }, []);

  return (
    <dialog
      ref={dialog}
      className={styles.confirm}
      aria-labelledby={titleId}
      aria-describedby={warningId}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onCancel();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && !busy) onCancel();
      }}
    >
      <div className={styles.confirmBody}>
        <header className={styles.confirmHeader}>
          <h2 id={titleId}>{action}?</h2>
          <button
            type="button"
            aria-label="Close"
            disabled={busy}
            onClick={onCancel}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <use href="/icons/ui-sprite.svg#ui-close" />
            </svg>
          </button>
        </header>
        <ul
          className={styles.confirmFiles}
          aria-label="Files to delete"
          tabIndex={0}
        >
          {files.map((file) => (
            <li key={file.fileId}>
              <span>{file.originalName}</span>
              <small>{fileSize(file.size)}</small>
            </li>
          ))}
        </ul>
        <p id={warningId} className={styles.confirmWarning}>
          {single
            ? "This file will be removed from your library and every chat where it was used."
            : "These files will be removed from your library and every chat where they were used."}
          {" Messages and responses will stay."}
          <strong>This cannot be undone.</strong>
        </p>
        <footer className={styles.confirmActions}>
          <button type="button" ref={cancel} disabled={busy} onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className={styles.danger}
            disabled={busy}
            onClick={onConfirm}
          >
            {busy ? "Deleting…" : action}
          </button>
        </footer>
      </div>
    </dialog>
  );
}
