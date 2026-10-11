"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./ActionTooltip.module.css";

const GAP = 8;
const VIEWPORT_MARGIN = 8;

export default function ActionTooltip({
  label,
  appearance = "default",
}: {
  label: string;
  appearance?: "default" | "plain";
}) {
  const markerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const dismissedRef = useRef(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const trigger = markerRef.current?.closest<HTMLElement>("button, a[href]");
    if (!trigger) return;
    let hovered =
      window.matchMedia("(hover: hover)").matches && trigger.matches(":hover");
    const syncVisibility = () => {
      setOpen(
        !dismissedRef.current && (hovered || trigger.matches(":focus-visible")),
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
    trigger.addEventListener("pointerenter", onEnter);
    trigger.addEventListener("pointerleave", onLeave);
    trigger.addEventListener("focus", onFocus);
    trigger.addEventListener("blur", syncVisibility);
    const initialFrame = requestAnimationFrame(syncVisibility);
    return () => {
      cancelAnimationFrame(initialFrame);
      trigger.removeEventListener("pointerenter", onEnter);
      trigger.removeEventListener("pointerleave", onLeave);
      trigger.removeEventListener("focus", onFocus);
      trigger.removeEventListener("blur", syncVisibility);
    };
  }, []);

  useLayoutEffect(() => {
    const trigger = markerRef.current?.closest<HTMLElement>("button, a[href]");
    const tooltip = tooltipRef.current;
    if (!open || !trigger || !tooltip) return;
    let frame = 0;
    const viewport = window.visualViewport;
    const position = () => {
      const leftEdge = (viewport?.offsetLeft ?? 0) + VIEWPORT_MARGIN;
      const topEdge = (viewport?.offsetTop ?? 0) + VIEWPORT_MARGIN;
      const width = viewport?.width ?? document.documentElement.clientWidth;
      const height = viewport?.height ?? window.innerHeight;
      const maxWidth = `${Math.max(0, width - 2 * VIEWPORT_MARGIN)}px`;
      if (tooltip.style.maxWidth !== maxWidth) tooltip.style.maxWidth = maxWidth;
      const anchor = trigger.getBoundingClientRect();
      const box = tooltip.getBoundingClientRect();
      const rightLimit = leftEdge + width - 2 * VIEWPORT_MARGIN - box.width;
      const bottomLimit = topEdge + height - 2 * VIEWPORT_MARGIN - box.height;
      // Prefer top-end with an 8 px gap; shift only at viewport boundaries.
      const left = `${Math.max(leftEdge, Math.min(anchor.right - box.width, rightLimit))}px`;
      const top = `${Math.max(topEdge, Math.min(anchor.top - box.height - GAP, bottomLimit))}px`;
      if (tooltip.style.left !== left) tooltip.style.left = left;
      if (tooltip.style.top !== top) tooltip.style.top = top;
      tooltip.style.visibility = "visible";
      // Model-picker entry uses JS transforms, which ResizeObserver cannot
      // detect. Follow the anchor while the hint is open without React renders.
      frame = requestAnimationFrame(position);
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
    resizeObserver.observe(trigger);
    if (trigger.parentElement) resizeObserver.observe(trigger.parentElement);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) setOpen(false);
    });
    visibilityObserver.observe(trigger);
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
  }, [open, label, appearance]);

  return (
    <>
      <span ref={markerRef} hidden aria-hidden="true" />
      {open &&
        createPortal(
          <span
            ref={tooltipRef}
            className={`${styles.tooltip} ${appearance === "plain" ? styles.plain : ""}`}
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
