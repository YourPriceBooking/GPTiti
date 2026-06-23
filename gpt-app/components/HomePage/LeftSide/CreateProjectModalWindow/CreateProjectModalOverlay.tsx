"use client";

import { useEffect, useState } from "react";
import styles from "./CreateProjectModalOverlay.module.css";
import CreateProjectModalWindow from "./CreateProjectModalWindow";

const ANIM_MS = 220;

type CreateProjectModalOverlayProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onCreate: (name: string) => void;
};

export default function CreateProjectModalOverlay({
  isOpen,
  setIsOpen,
  onCreate,
}: CreateProjectModalOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
      return;
    }

    setVisible(false);
    const t = window.setTimeout(() => setMounted(false), ANIM_MS);
    return () => window.clearTimeout(t);
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <div
      className={`${styles.modalOverlay} ${visible ? styles.open : ""}`}
      onClick={() => setIsOpen(false)}
    >
      <div className={styles.backdrop} />

      <div
        className={`${styles.modalWrapper} ${visible ? styles.open : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <CreateProjectModalWindow
          onCancel={() => setIsOpen(false)}
          onCreate={onCreate}
        />
      </div>
    </div>
  );
}
