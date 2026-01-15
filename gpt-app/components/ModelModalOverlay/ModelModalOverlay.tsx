"use client";
import { useEffect, useRef, useCallback } from "react";
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
  const timerRef = useRef<number | null>(null);
  const cancelledByUserRef = useRef(false);

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
    if (!isModalOpen) {
      cancelledByUserRef.current = false;
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    if (
      isMobile() &&
      !cancelledByUserRef.current &&
      timerRef.current === null
    ) {
      timerRef.current = window.setTimeout(() => {
        if (!cancelledByUserRef.current) setIsModalOpen(false);
        timerRef.current = null;
      }, 2000);
    }

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isModalOpen, setIsModalOpen]);

  if (!isModalOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.backdrop} onClick={() => setIsModalOpen(false)} />
      <div
        className={styles.modalWrapper}
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
