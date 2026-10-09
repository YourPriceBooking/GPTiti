"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./ActionTooltip.module.css";

const GAP = 8;
const VIEWPORT_MARGIN = 8;

export default function ActionTooltip({ label }: { label: string }) {
  const markerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const dismissedRef = useRef(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const button = markerRef.current?.closest("button");
    if (!button) return;
    let hovered =
      window.matchMedia("(hover: hover)").matches && button.matches(":hover");
    const syncVisibility = () => {
      setOpen(
        !dismissedRef.current && (hovered || button.matches(":focus-visible")),
      );
    };
    const onEnter = (event: PointerEvent) => {
      if (
        event.pointerType === "touch" ||
        !window.matchMedia("(hover: hover)").matches
      )
        return;
      hovered = true;
      dismissedRef.current = false;
      syncVisibility();
    };
    const onLeave = () => {
      hovered = false;
      syncVisibility();
    };
    const onFocus = () => {
      dismissedRef.current = false;
      syncVisibility();
    };
    button.addEventListener("pointerenter", onEnter);
    button.addEventListener("pointerleave", onLeave);
    button.addEventListener("focus", onFocus);
    button.addEventListener("blur", syncVisibility);
    const initialFrame = requestAnimationFrame(syncVisibility);
    return () => {
      cancelAnimationFrame(initialFrame);
      button.removeEventListener("pointerenter", onEnter);
      button.removeEventListener("pointerleave", onLeave);
      button.removeEventListener("focus", onFocus);
      button.removeEventListener("blur", syncVisibility);
    };
  }, []);

  useLayoutEffect(() => {
    const button = markerRef.current?.closest("button");
    const tooltip = tooltipRef.current;
    if (!open || !button || !tooltip) return;
    let frame = 0;
    const viewport = window.visualViewport;
    const position = () => {
      const leftEdge = (viewport?.offsetLeft ?? 0) + VIEWPORT_MARGIN;
      const topEdge = (viewport?.offsetTop ?? 0) + VIEWPORT_MARGIN;
      const width = viewport?.width ?? document.documentElement.clientWidth;
      const height = viewport?.height ?? window.innerHeight;
      tooltip.style.maxWidth = `${Math.max(0, width - 2 * VIEWPORT_MARGIN)}px`;
      const anchor = button.getBoundingClientRect();
      const box = tooltip.getBoundingClientRect();
      const rightLimit = leftEdge + width - 2 * VIEWPORT_MARGIN - box.width;
      const bottomLimit = topEdge + height - 2 * VIEWPORT_MARGIN - box.height;
      // Prefer top-end with an 8 px gap; shift only at viewport boundaries.
      tooltip.style.left = `${Math.max(leftEdge, Math.min(anchor.right - box.width, rightLimit))}px`;
      tooltip.style.top = `${Math.max(topEdge, Math.min(anchor.top - box.height - GAP, bottomLimit))}px`;
      tooltip.style.visibility = "visible";
    };
    const schedulePosition = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(position);
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      dismissedRef.current = true;
      setOpen(false);
    };
    position();
    window.addEventListener("scroll", schedulePosition, true);
    window.addEventListener("resize", schedulePosition);
    window.addEventListener("keydown", onEscape);
    viewport?.addEventListener("resize", schedulePosition);
    viewport?.addEventListener("scroll", schedulePosition);
    const resizeObserver = new ResizeObserver(schedulePosition);
    resizeObserver.observe(tooltip);
    resizeObserver.observe(button);
    if (button.parentElement) resizeObserver.observe(button.parentElement);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) setOpen(false);
    });
    visibilityObserver.observe(button);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener("scroll", schedulePosition, true);
      window.removeEventListener("resize", schedulePosition);
      window.removeEventListener("keydown", onEscape);
      viewport?.removeEventListener("resize", schedulePosition);
      viewport?.removeEventListener("scroll", schedulePosition);
    };
  }, [open, label]);

  return (
    <>
      <span ref={markerRef} hidden aria-hidden="true" />
      {open &&
        createPortal(
          <span
            ref={tooltipRef}
            className={styles.tooltip}
            aria-hidden="true"
            data-action-tooltip
          >
            {label}
          </span>,
          document.body,
        )}
    </>
  );
}
