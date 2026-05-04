"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./TooltipModalWindow.module.css";
import Image from "next/image";
import Link from "next/link";
import { ModelTooltip } from "@/types/types";

type Props = {
  onClose: () => void;
  tooltip: ModelTooltip;
};

const MODEL_IMAGES: Record<string, string[]> = {
  "Image → Create HD": [
    "/img/ImageCreateHD/img-1.webp",
    "/img/ImageCreateHD/img-2.webp",
    "/img/ImageCreateHD/img-3.webp",
  ],
  "Image → Create Fast": [
    "/img/ImageCreateFast/img-1.webp",
    "/img/ImageCreateFast/img-2.webp",
    "/img/ImageCreateFast/img-3.webp",
  ],
};

const MODEL_GUIDE_SLUG: Record<string, string> = {
  "GPT-5.4": "gpt-5-4",
  "GPT-5.4 mini": "gpt-5-4-mini",
  "GPT-5.1": "gpt-5-1",
  "GPT-5.1 mini": "gpt-5-1-mini",
  "GPT-5.1 realtime": "gpt-5-1-realtime",
  "GPT-4o": "gpt-4o",
  "GPT-4o mini": "gpt-4o-mini",
  "GPT-4o realtime": "gpt-4o-realtime",
  o1: "o1",
  "o1 mini": "o1-mini",
  "o3 mini": "o3-mini",
  "Smart Search": "smart-search",
  "Voice → Text": "voice-to-text",
  "Text → Speech": "text-to-speech",
  "Image → Create HD": "image-create-hd",
  "Image → Create Fast": "image-create-fast",
};

const READ_DELAY_MS = 1000;
const IMAGE_INTERVAL_MS = 2000;

function buildFullText(tooltip: ModelTooltip): string {
  const pros = tooltip.pros.map((p) => `✓ ${p}`).join("\n");
  const cons = tooltip.cons.map((c) => `— ${c}`).join("\n");
  return `${tooltip.intro}\n\n${pros}\n\n${cons}`;
}

export default function TooltipModalWindow({ onClose, tooltip }: Props) {
  const fullText = buildFullText(tooltip);
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const [showImagesPhase, setShowImagesPhase] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [prevImageIndex, setPrevImageIndex] = useState<number | null>(null);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const images = MODEL_IMAGES[tooltip.title] ?? [];

  useEffect(() => {
    indexRef.current = 0;
    setDisplayed("");
    setDone(false);
    setShowImagesPhase(false);
    setImageIndex(0);
    setPrevImageIndex(null);

    const type = () => {
      const i = indexRef.current;
      if (i < fullText.length) {
        setDisplayed(fullText.slice(0, i + 1));
        indexRef.current = i + 1;

        const ch = fullText[i];
        const speed =
          ch === "." || ch === "\n"
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

  useEffect(() => {
    if (!done || images.length === 0) return;
    const t = setTimeout(() => setShowImagesPhase(true), READ_DELAY_MS);
    return () => clearTimeout(t);
  }, [done, images.length]);

  useEffect(() => {
    if (!showImagesPhase || images.length <= 1) return;
    const id = setInterval(() => {
      setImageIndex((i) => {
        setPrevImageIndex(i);
        return (i + 1) % images.length;
      });
    }, IMAGE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [showImagesPhase, images.length]);

  const showImages = showImagesPhase && images.length > 0;
  const currentSrc = images[imageIndex];
  const prevSrc = prevImageIndex !== null ? images[prevImageIndex] : null;
  const guideSlug = MODEL_GUIDE_SLUG[tooltip.title];

  return (
    <div className={styles.tooltipContainer}>
      <button className={styles.closeBtn} onClick={onClose}>
        <Image width={30} height={30} src="/icons/close.svg" alt="close" />
      </button>

      <h5 className={styles.tooltipTitle}>{tooltip.title}</h5>
      <section className={styles.tooltipSection}>
        {!showImages && (
          <p className={styles.typingText}>
            {displayed}
            {!done && <span className={styles.cursor} />}
          </p>
        )}

        {showImages && (
          <div className={styles.tooltipImages}>
            {prevSrc && (
              <Image
                key={`prev-${prevSrc}`}
                className={`${styles.tooltipImage} ${styles.slideOut}`}
                src={prevSrc}
                alt={tooltip.title}
                width={220}
                height={220}
                onAnimationEnd={() => setPrevImageIndex(null)}
              />
            )}
            <Image
              key={`curr-${currentSrc}`}
              className={`${styles.tooltipImage} ${prevSrc ? styles.slideIn : ""}`}
              src={currentSrc}
              alt={tooltip.title}
              width={220}
              height={220}
            />
          </div>
        )}

        {done && guideSlug && (
          <Link
            href={`/ai-models-guide/${guideSlug}`}
            className={styles.readMore}
          >
            Read more
          </Link>
        )}
      </section>
    </div>
  );
}
