"use client";

import { useEffect, useState } from "react";

import InputBar from "../InputBar/InputBar";
import ChooseModelColumn from "../ChooseModelColumn/ChooseModelColumn";

import styles from "./InputComposer.module.css";

type InputComposerProps = React.ComponentProps<typeof InputBar> & {
  showEstimate: boolean;
  estimateSupported?: boolean;
  estimatedTokens?: number | null;
  onChooseModel: () => void;
  showDisclaimer?: boolean;
};

export default function InputComposer({
  showEstimate,
  estimateSupported,
  estimatedTokens,
  onChooseModel,
  showDisclaimer = false,
  ...inputBarProps
}: InputComposerProps) {
  const isProject = inputBarProps.variant === "project";

  const [animReady, setAnimReady] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setAnimReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={`${styles.composer} ${animReady ? "" : styles.noAnimation}`}
    >
      {showDisclaimer && (
        <span className={styles.disclaimer}>
          AI systems may make mistakes, so we recommend verifying important
          information.
        </span>
      )}

      <div className={styles.inputWrap}>
        <InputBar {...inputBarProps} />
      </div>

      <div
        className={`${styles.metaWrap} ${isProject ? styles.metaWrapPlain : ""}`}
      >
        {estimateSupported ? (
          <div className={styles.metaRow}>
            <span
              className={`${styles.estimate} ${
                isProject ? styles.estimateProject : ""
              } ${showEstimate ? "" : styles.estimateHidden}`}
            >
              ≈ Estimated cost: ~
              {(estimatedTokens ?? 0).toLocaleString("en-US")} tokens
            </span>
            <ChooseModelColumn
              selectedModel={inputBarProps.selectedModel}
              showEstimate={showEstimate}
              onChoose={onChooseModel}
              variant={isProject ? "project" : "default"}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
