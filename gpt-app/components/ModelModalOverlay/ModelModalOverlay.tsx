"use client";

import { useEffect, useState } from "react";
import { ModelModalOverlayProps } from "@/types/types";
import styles from "./ModelModalOverlay.module.css";
import ModalWindow from "@/components/HomePage/LeftSide/ModalWindow/ModalWindow";

const ANIM_MS = 220;

export default function ModelModalOverlay({
  isModalOpen,
  setIsModalOpen,
  selectedModel,
  setSelectedModel,
  selectedModelGroup,
  setSelectedModelGroup,
}: ModelModalOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
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

  if (!mounted) return null;

  return (
    <div
      className={`${styles.modalOverlay} ${visible ? styles.open : ""}`}
      onClick={() => setIsModalOpen(false)}
    >
      <div className={styles.backdrop} />

      <div
        className={`${styles.modalWrapper} ${visible ? styles.open : ""}`}
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
