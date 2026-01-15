"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { ModelModalOverlayProps } from "@/types/types";
import styles from "./ModelModalOverlay.module.css";
import ModalWindow from "@/components/HomePage/LeftSide/ModalWindow/ModalWindow";

const ANIM_MS = 220;
const AUTO_CLOSE_MS = 2000;

export default function ModelModalOverlay({
  isModalOpen,
  setIsModalOpen,
  selectedModel,
  setSelectedModel,
  selectedModelGroup,
  setSelectedModelGroup,
}: ModelModalOverlayProps) {
  const timerRef = useRef<number | null>(null);
  const cancelledByUserRef = useRef(false);

  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  const isMobile = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 767px)").matches;

  const clearAutoClose = useCallback(() => {
    cancelledByUserRef.current = true;

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMounted(true);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });

      return;
    }

    setVisible(false);
    const t = window.setTimeout(() => setMounted(false), ANIM_MS);
    return () => window.clearTimeout(t);
  }, [isModalOpen]);

  useEffect(() => {
    if (!isModalOpen) {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    cancelledByUserRef.current = false;

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (isMobile()) {
      timerRef.current = window.setTimeout(() => {
        if (!cancelledByUserRef.current) setIsModalOpen(false);
        timerRef.current = null;
      }, AUTO_CLOSE_MS);
    }

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isModalOpen, setIsModalOpen]);

  if (!mounted) return null;

  return (
    <div
      className={`${styles.modalOverlay} ${visible ? styles.open : ""}`}
      onClick={() => setIsModalOpen(false)}
    >
      <div className={styles.backdrop} />

      <div
        className={`${styles.modalWrapper} ${visible ? styles.open : ""}`}
        onPointerDown={clearAutoClose}
        onWheel={clearAutoClose}
        onTouchStart={clearAutoClose}
        onMouseDown={clearAutoClose}
        onClick={(e) => e.stopPropagation()}
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
