"use client";

import { useEffect, useRef, useState } from "react";
import { localDay } from "@/lib/tokenHistory";
import styles from "./TokenHistoryPage.module.css";

type Props = {
  label: string;
  value: string;
  min?: string;
  max?: string;
  onChange: (value: string) => void;
  alignRight?: boolean;
};
export default function HistoryDateField({
  label,
  value,
  min,
  max,
  onChange,
  alignRight,
}: Props) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<Date | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);
  const select = (day: string) => {
    onChange(day);
    setOpen(false);
    trigger.current?.focus();
  };
  const first = month
    ? new Date(month.getFullYear(), month.getMonth(), 1)
    : null;
  const offset = first ? (first.getDay() + 6) % 7 : 0;
  const days = month
    ? new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
    : 0;
  return (
    <div
      ref={root}
      className={styles.dateField}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          setOpen(false);
          trigger.current?.focus();
        }
      }}
    >
      <span className={styles.dateLabel}>{label}</span>
      <button
        ref={trigger}
        className={styles.dateTrigger}
        type="button"
        aria-label={`${label} date${value ? `: ${value}` : ""}`}
        aria-expanded={open}
        aria-controls={open ? `history-date-${label}` : undefined}
        onClick={() => {
          if (!open)
            setMonth(value ? new Date(`${value}T12:00:00`) : new Date());
          setOpen(!open);
        }}
      >
        <span>
          {value
            ? new Date(`${value}T12:00:00`).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "DD / MM / YYYY"}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          aria-hidden="true"
        >
          <path d="M4 5h16v16H4zM8 2v6M16 2v6M4 10h16" />
        </svg>
      </button>
      {open && month && (
        <div
          id={`history-date-${label}`}
          className={`${styles.calendar} ${alignRight ? styles.calendarRight : ""}`}
          role="group"
          aria-label={`${label} calendar`}
        >
          <div className={styles.calendarHeader}>
            <button
              type="button"
              aria-label="Previous month"
              onClick={() =>
                setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
              }
            >
              ←
            </button>
            <strong aria-live="polite">
              {month.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </strong>
            <button
              type="button"
              aria-label="Next month"
              onClick={() =>
                setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
              }
            >
              →
            </button>
          </div>
          <div className={styles.calendarGrid}>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <span key={d}>{d}</span>
            ))}
            {Array.from({ length: offset }, (_, i) => (
              <span key={`gap-${i}`} />
            ))}
            {Array.from({ length: days }, (_, i) => {
              const day = localDay(
                new Date(
                  month.getFullYear(),
                  month.getMonth(),
                  i + 1,
                ).toISOString(),
              );
              return (
                <button
                  key={day}
                  type="button"
                  disabled={!!((min && day < min) || (max && day > max))}
                  aria-label={new Date(`${day}T12:00:00`).toLocaleDateString(
                    "en-US",
                    { month: "long", day: "numeric", year: "numeric" },
                  )}
                  aria-pressed={day === value}
                  onClick={() => select(day)}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <div className={styles.calendarFooter}>
            <button
              type="button"
              className={styles.textButton}
              onClick={() => select("")}
            >
              Clear date
            </button>
            <button
              type="button"
              className={styles.textButton}
              onClick={() => {
                setOpen(false);
                trigger.current?.focus();
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
