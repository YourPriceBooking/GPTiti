"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

import LeftSide from "../LeftSide";
import { LeftSideProps } from "@/types/types";

import styles from "./LeftSideDrawer.module.css";

const ANIM_MS = 220;

type LeftSideDrawerProps = LeftSideProps & {
  /** Extra classes for the trigger button (positioning / margins per consumer). */
  className?: string;
};

export default function LeftSideDrawer({
  className,
  ...leftSideProps
}: LeftSideDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  const openPanel = () => {
    setClosing(false);
    setMounted(true);
    requestAnimationFrame(() => setVisible(true));
  };

  const closePanel = () => {
    setClosing(true);
    setVisible(false);
    window.setTimeout(() => {
      setMounted(false);
      setClosing(false);
    }, ANIM_MS);
  };

  // Close the panel first, then run an action once the slide-out finished
  // (so a newly opened modal doesn't stack on top of the drawer).
  const closeThen = (fn?: () => void) => {
    closePanel();
    if (fn) window.setTimeout(fn, ANIM_MS);
  };

  return (
    <>
      <button
        type="button"
        className={`${styles.openModal} ${className ?? ""}`}
        onClick={openPanel}
        aria-label="Open menu"
      >
        <Image
          src="/icons/open-icon.svg"
          width={25}
          height={25}
          alt="open-modal"
        />
      </button>

      {mounted &&
        createPortal(
          <div
            className={`${styles.modalOverlay} ${
              visible ? styles.modalOverlayOpen : ""
            } ${closing ? styles.modalOverlayClosing : ""}`}
            onClick={closePanel}
          >
            <div
              className={`${styles.modalContent} ${
                visible ? styles.modalContentOpen : ""
              } ${closing ? styles.modalContentClosing : ""}`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles.closeButton}
                onClick={closePanel}
                aria-label="Close modal"
                type="button"
              >
                <Image src="/icons/close.svg" width={20} height={20} alt="" />
              </button>

              <LeftSide
                {...leftSideProps}
                onNewChat={() => {
                  leftSideProps.onNewChat();
                  closePanel();
                }}
                onNewProject={() => closeThen(leftSideProps.onNewProject)}
                setActiveChatId={(id) => {
                  leftSideProps.setActiveChatId(id);
                  closePanel();
                }}
                onSelectProject={closePanel}
                setIsModalOpen={(open) => {
                  if (open) closeThen(() => leftSideProps.setIsModalOpen(true));
                  else leftSideProps.setIsModalOpen(false);
                }}
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
