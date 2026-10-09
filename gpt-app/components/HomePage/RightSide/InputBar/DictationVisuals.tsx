"use client";

import { useEffect, useRef } from "react";
import { attachVoiceWaveform } from "@/lib/dictation/waveform";
import styles from "./DictationVisuals.module.css";

export function DictationStopIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={styles.stopIcon}
      width="64"
      height="64"
      viewBox="0 0 64 64"
      aria-hidden="true"
    >
      <g className={active ? styles.breathing : styles.inactive}>
        <circle
          cx="32"
          cy="32"
          r="22.75"
          fill="var(--flow-fill)"
          opacity=".08"
        />
        <circle
          cx="32"
          cy="32"
          r="19.75"
          fill="var(--flow-fill)"
          opacity=".18"
        />
      </g>
      <circle cx="32" cy="32" r="17.5" fill="var(--flow-fill)" />
      <rect x="27.2" y="27.2" width="9.6" height="9.6" rx="2" fill="white" />
    </svg>
  );
}

export function DictationWaveform({ stream }: { stream: MediaStream | null }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!stream || !svg) return;
    try {
      return attachVoiceWaveform(svg, stream);
    } catch {
      // A visualizer failure must not interrupt microphone capture.
    }
  }, [stream]);
  return (
    <div className={styles.waveEnter}>
      <svg
        ref={ref}
        className={styles.wave}
        viewBox="0 0 640 40"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {Array.from({ length: 80 }, (_, index) => (
          <rect
            key={index}
            data-wave-bar
            x={4 + index * 8}
            y="19"
            width="3"
            height="2"
            rx="1.5"
            fill="var(--flow-fill)"
            opacity=".35"
          />
        ))}
      </svg>
    </div>
  );
}
