"use client";

import { useEffect, useState } from "react";

import InputBar from "../InputBar/InputBar";
import ChooseModelColumn from "../ChooseModelColumn/ChooseModelColumn";

import styles from "./InputComposer.module.css";
import { isSelectableModel } from "@/config/models.config";

import { findModelCard } from "@/config/modelDiscovery";

type InputComposerProps = React.ComponentProps<typeof InputBar> & {
  feedback?: React.ReactNode;
  showEstimate: boolean;
  estimateSupported?: boolean;
  estimatedTokens?: number | null;
  onChooseModel: () => void;
  showDisclaimer?: boolean;
  discovery?: boolean;
  showModelSelection?: boolean;
};

export default function InputComposer({
  feedback,
  discovery = false,
  showEstimate,
  estimateSupported,
  estimatedTokens,
  onChooseModel,
  showDisclaimer = false,
  showModelSelection = true,
  ...inputBarProps
}: InputComposerProps) {
  const isProject = inputBarProps.variant === "project";
  const modelAvailable = isSelectableModel(inputBarProps.selectedModel);

  const demo = discovery && !estimateSupported ? findModelCard(inputBarProps.selectedModel)?.demoTokens : undefined;

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
        <span className={discovery ? styles.discoveryDisclaimer : styles.disclaimer}>
          AI systems may make mistakes, so we recommend verifying important
          information.
        </span>
      )}

      {feedback}
      {inputBarProps.stopState === "stopping" && (
        <p className={styles.stopStatus} role="status">Stopping… Waiting for confirmation.</p>
      )}
      <div className={styles.inputWrap}>
        <InputBar {...inputBarProps} discovery={discovery} />
      </div>

      <div
        className={`${styles.metaWrap} ${isProject ? styles.metaWrapPlain : ""}`}
      >
        {(estimateSupported || demo !== undefined) && modelAvailable ? (
          <div className={styles.metaRow}>
            <span
              className={`${styles.estimate} ${
                isProject ? styles.estimateProject : ""
              } ${showEstimate ? "" : styles.estimateHidden}`}
            >
              ≈ Estimated cost: ~
              {(estimatedTokens ?? demo ?? 0).toLocaleString("en-US")} tokens{demo !== undefined && " · Demo"}
            </span>
            {showModelSelection && (
              <ChooseModelColumn
                selectedModel={inputBarProps.selectedModel}
                showEstimate={showEstimate}
                onChoose={onChooseModel}
                variant={isProject ? "project" : "default"}
              />
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
