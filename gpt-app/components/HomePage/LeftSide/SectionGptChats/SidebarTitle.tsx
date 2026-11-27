"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import styles from "./SidebarTitle.module.css";

const HOVER_DELAY_MS = 700;
const PIXELS_PER_SECOND = 40;
const DESKTOP_POINTER = "(min-width: 768px) and (hover: hover) and (pointer: fine)";

type Motion =
  | "idle"
  | "tooltip"
  | { kind: "read"; ms: number }
  | { kind: "return"; ms: number; x: number };

export default function SidebarTitle({ title, className = "" }: { title: string; className?: string }) {
  const [motion, setMotion] = useState<Motion>("idle");
  const hoverTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(hoverTimer.current), [title]);

  function enter({ currentTarget, pointerType }: PointerEvent<HTMLSpanElement>) {
    if (pointerType !== "mouse" || !window.matchMedia(DESKTOP_POINTER).matches) return;
    const track = currentTarget.firstElementChild;
    if (!track || track.scrollWidth <= currentTarget.clientWidth) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMotion("tooltip");
      return;
    }

    // A quick re-entry lets the in-flight return finish while the new hover waits.
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => {
      const fullWidth = track.scrollWidth;
      const distance = fullWidth - currentTarget.clientWidth;
      if (distance <= 0) return;
      currentTarget.style.containIntrinsicInlineSize = `${fullWidth}px`;
      setMotion({ kind: "read", ms: distance / PIXELS_PER_SECOND * 1000 });
    }, HOVER_DELAY_MS);
  }

  function leave({ currentTarget }: PointerEvent<HTMLSpanElement>) {
    window.clearTimeout(hoverTimer.current);
    if (typeof motion === "object") {
      if (motion.kind === "return") return;
      const track = currentTarget.firstElementChild;
      const transform = track && getComputedStyle(track).transform;
      if (transform && transform !== "none") {
        const x = new DOMMatrixReadOnly(transform).m41;
        if (x < 0) {
          setMotion({ kind: "return", x, ms: Math.min(420, 180 + Math.abs(x) * 0.6) });
          return;
        }
      }
    }
    setMotion("idle");
  }

  const active = typeof motion === "object";
  const returning = active && motion.kind === "return";
  const style = active ? {
    "--title-motion-duration": `${motion.ms}ms`,
    ...(returning && { "--title-return-from": `${motion.x}px` }),
  } as CSSProperties : undefined;

  return (
    <span
      className={`${styles.viewport} ${active ? styles.reading : ""} ${className}`}
      onPointerEnter={enter}
      onPointerLeave={leave}
      onPointerCancel={leave}
      title={motion === "tooltip" ? title : undefined}
    >
      <span
        className={`${styles.text} ${active ? (returning ? styles.returning : styles.scrolling) : ""}`}
        style={style}
        onAnimationEnd={returning ? (event) => {
          if (event.animationName === getComputedStyle(event.currentTarget).animationName) setMotion("idle");
        } : undefined}
      >
        {title}
      </span>
    </span>
  );
}
