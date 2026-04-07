"use client";
import { useState, useEffect, useRef } from 'react';
import styles from "./TooltipModalWindow.module.css";
import Image from "next/image";
import { ModelTooltip } from "@/types/types";

type Props = {
  onClose: () => void;
  tooltip: ModelTooltip;
};

function buildFullText(tooltip: ModelTooltip): string {
  const pros = tooltip.pros.map((p) => `✓ ${p}`).join('\n');
  const cons = tooltip.cons.map((c) => `— ${c}`).join('\n');
  return `${tooltip.intro}\n\n${pros}\n\n${cons}`;
}

export default function TooltipModalWindow({ onClose, tooltip }: Props) {
  const fullText = buildFullText(tooltip);
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayed('');
    setDone(false);

    const type = () => {
      const i = indexRef.current;
      if (i < fullText.length) {
        setDisplayed(fullText.slice(0, i + 1));
        indexRef.current = i + 1;

        const ch = fullText[i];
        const speed = ch === '.' || ch === '\n'
          ? 80 + Math.random() * 40
          : 10 + Math.random() * 25;

        timerRef.current = setTimeout(type, speed);
      } else {
        setDone(true);
      }
    };

    timerRef.current = setTimeout(type, 10);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [fullText]);

  return (
    <div className={styles.tooltipContainer}>
      <button className={styles.closeBtn} onClick={onClose}>
        <Image width={14} height={14} src="/icons/close.svg" alt="close" />
      </button>

      <h5 className={styles.tooltipTitle}>{tooltip.title}</h5>
      <section className={styles.tooltipSection}>
        <p className={styles.typingText}>
          {displayed}
          {!done && <span className={styles.cursor} />}
        </p>
      </section>
    </div>
  );
}
