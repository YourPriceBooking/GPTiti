"use client";

import styles from "./ChooseModelColumn.module.css";

interface ChooseModelColumnProps {
  selectedModel: string;
  showEstimate: boolean;
  onChoose: () => void;
  variant?: "default" | "project";
}

export default function ChooseModelColumn({
  selectedModel,
  showEstimate,
  onChoose,
  variant = "default",
}: ChooseModelColumnProps) {
  return (
    <div
      className={`${styles.chooseModelColumn} ${
        variant === "project" ? styles.project : ""
      }`}
    >
      <span
        className={`${styles.inputSpan2} ${
          showEstimate ? "" : styles.estimateHidden
        }`}
      >
        New chat created with {selectedModel}
      </span>
      <button
        type="button"
        className={`${styles.chooseModelBtn} ${
          showEstimate ? "" : styles.estimateNone
        }`}
        onClick={onChoose}
      >
        Choose model
      </button>
    </div>
  );
}
