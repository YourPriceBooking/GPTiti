"use client";

import { useState, type PointerEvent } from "react";
import styles from "./SidebarTitle.module.css";

const PIXELS_PER_SECOND = 40;

export default function SidebarTitle({ title, className = "" }: { title: string; className?: string }) {
  const [reveal, setReveal] = useState<number | "tooltip">(0);

  function measure({ currentTarget, pointerType }: PointerEvent<HTMLSpanElement>) {
    if (pointerType !== "mouse") return;
    const text = currentTarget.firstElementChild;
    if (!text) return;
    const fullWidth = text.scrollWidth;
    const overflow = fullWidth - currentTarget.clientWidth;
    if (overflow > 0) {
      // Preserve a content-sized link's intrinsic width when it becomes a query container.
      currentTarget.style.containIntrinsicInlineSize = `${fullWidth}px`;
      setReveal(window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "tooltip" : overflow / PIXELS_PER_SECOND);
    }
  }

  const scroll = typeof reveal === "number" && reveal > 0;
  return (
    <span
      className={`${styles.viewport} ${scroll ? styles.reading : ""} ${className}`}
      onPointerEnter={measure}
      onPointerLeave={() => setReveal(0)}
      onPointerCancel={() => setReveal(0)}
      title={reveal === "tooltip" ? title : undefined}
    >
      <span
        className={scroll ? styles.scrolling : styles.text}
        style={scroll ? { animationDuration: `${reveal}s` } : undefined}
      >
        {title}
      </span>
    </span>
  );
}
