import type { CSSProperties } from "react";
import type { ModelGptitiTitleWithIconProps } from "@/types/types";
import { findModelCard } from "@/config/modelDiscovery";
import styles from "./ModelGptitiTitleWithIcon.module.css";

export default function ModelGptitiTitleWithIcon({
  modelRef, selectedModel, setIsModalOpen,
}: ModelGptitiTitleWithIconProps) {
  const card = findModelCard(selectedModel);
  const label = card?.name ?? selectedModel;
  return (
    <div ref={modelRef}>
      <button type="button" className={styles.titleContainer}
        style={card ? { "--model-accent": card.accent } as CSSProperties : undefined}
        aria-label={`Choose model: ${label}`} aria-haspopup="dialog"
        disabled={card?.group !== "Chat"} onClick={() => setIsModalOpen(true)}>
        {card && <span className={styles.swatch} aria-hidden="true" />}
        <span className={styles.title}>{label}</span>
        {card && <svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden="true"><path d="m1 1.5 5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </button>
    </div>
  );
}
