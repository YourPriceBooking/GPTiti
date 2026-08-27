"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Chat } from "@/types/types";
import styles from "./AddChatsModalOverlay.module.css";

const ANIM_MS = 220;

type AddChatsModalOverlayProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  projectName: string;
  chats: Chat[];
  onConfirm: (conversationIds: string[]) => void;
};

export default function AddChatsModalOverlay({
  isOpen,
  setIsOpen,
  projectName,
  chats,
  onConfirm,
}: AddChatsModalOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setSelected([]);
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

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);

  if (!mounted) return null;

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const canAdd = selected.length > 0;

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
        <div
          className={styles.container}
          role="dialog"
          aria-modal="true"
          aria-label="Add chats to project"
        >
          <header className={styles.header}>
            <div className={styles.headerIcon}>
              <Image
                src="/icons/add-chats.svg"
                alt="add chats"
                width={26}
                height={18}
              />
            </div>
            <div className={styles.headerText}>
              <h2 className={styles.title}>Add chats</h2>
              <p className={styles.subtitle}>
                Attach existing chats to “{projectName}”.
              </p>
            </div>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              <Image
                src="/icons/close-modal-project.svg"
                alt="close"
                width={20}
                height={20}
              />
            </button>
          </header>

          {chats.length > 0 ? (
            <ul className={styles.list}>
              {chats.map((chat) => {
                const isSelected = selected.includes(chat.id);
                return (
                  <li
                    key={chat.id}
                    className={`${styles.item} ${
                      isSelected ? styles.itemSelected : ""
                    }`}
                    onClick={() => toggle(chat.id)}
                  >
                    <span
                      className={`${styles.checkbox} ${
                        isSelected ? styles.checkboxOn : ""
                      }`}
                      aria-hidden="true"
                    >
                      {isSelected ? "✓" : ""}
                    </span>
                    <span className={styles.itemTitle}>
                      {chat.title || "Untitled chat"}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className={styles.empty}>
              No chats available to add — every chat is already in this project.
            </p>
          )}

          <footer className={styles.footer}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className={styles.addButton}
              disabled={!canAdd}
              onClick={() => onConfirm(selected)}
            >
              {canAdd
                ? `Add ${selected.length} chat${selected.length > 1 ? "s" : ""}`
                : "Add chats"}
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}
