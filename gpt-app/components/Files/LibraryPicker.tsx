"use client";
import { useEffect, useRef } from "react";
import LibraryBrowser from "./LibraryBrowser";
import styles from "./Library.module.css";
export default function LibraryPicker({
  onClose,
  ...props
}: Omit<React.ComponentProps<typeof LibraryBrowser>, "picker"> & {
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    const previous = document.activeElement as HTMLElement | null;
    dialog.showModal();
    return () => {
      dialog.close();
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-label="Add from library"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.dialogHeader}>
        <button type="button" onClick={onClose} aria-label="Close file picker">
          ×
        </button>
      </div>
      <LibraryBrowser {...props} picker />
    </dialog>
  );
}
