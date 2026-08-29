"use client";

import { useEffect, useRef } from "react";
import { ModelModalOverlayProps } from "@/types/types";
import styles from "./ModelModalOverlay.module.css";
import ModalWindow from "@/components/HomePage/LeftSide/ModalWindow/ModalWindow";

export default function ModelModalOverlay({
  isModalOpen,
  setIsModalOpen,
  selectedModel,
  setSelectedModel,
  selectedModelGroup,
  setSelectedModelGroup,
}: ModelModalOverlayProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isModalOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarGap = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarGap > 0) {
      document.body.style.paddingRight = `${scrollbarGap}px`;
    }

    const focusFrame = window.requestAnimationFrame(() => {
      modalRef.current?.focus({ preventScroll: true });
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsModalOpen(false);
        return;
      }

      if (event.key !== "Tab" || !modalRef.current) return;

      const focusable = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.getClientRects().length > 0);

      if (focusable.length === 0) {
        event.preventDefault();
        modalRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      previouslyFocused?.focus();
    };
  }, [isModalOpen, setIsModalOpen]);

  if (!isModalOpen) return null;

  return (
    <div
      className={`${styles.modalOverlay} ${styles.open}`}
      onClick={() => setIsModalOpen(false)}
    >
      <div className={styles.backdrop} />

      <div
        className={`${styles.modalWrapper} ${styles.open}`}
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="model-picker-title"
        tabIndex={-1}
      >
        <ModalWindow
          selectedModelGroup={selectedModelGroup}
          setSelectedModelGroup={setSelectedModelGroup}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          setIsModalOpen={setIsModalOpen}
        />
      </div>
    </div>
  );
}
