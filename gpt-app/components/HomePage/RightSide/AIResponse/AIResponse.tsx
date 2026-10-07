"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { formatActivity } from "@/lib/formatActivity";
import ActionTooltip from "@/components/common/ActionTooltip/ActionTooltip";
import MarkdownContent from "@/components/common/MarkdownContent/MarkdownContent";
import styles from "./AIResponse.module.css";

type AIResponseProps = {
  content: string;
  modelId?: string;
  updatedAt?: string;
};

export default function AIResponse({
  content,
  modelId,
  updatedAt,
}: AIResponseProps) {
  const updatedLabel = useMemo(() => formatActivity(updatedAt), [updatedAt]);

  const [copied, setCopied] = useState(false);

  const handleCopyResponse = useCallback(() => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [content]);

  return (
    <div className={styles.aiBlock}>
      <h2 className={styles.aiTitle}>
        <Image
          src="/icons/rabbit.svg"
          alt="logo-rabbit"
          height={23}
          width={41}
        />
        <p className={styles.aiParagraph}>GPTiti</p>
        {modelId && <span className={styles.aiModel}>{modelId}</span>}
        {updatedLabel && (
          <span className={styles.aiUpdated}>{updatedLabel}</span>
        )}

        <span className={styles.actions}>
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.continueBtn}`}
            aria-label="Continue in a new chat"
          >
            <Image
              src="/icons/continue-in-new-chat.svg"
              alt=""
              width={22}
              height={22}
            />
            <ActionTooltip label="Continue in a new chat" />
          </button>

          <button
            type="button"
            className={`${styles.actionBtn} ${copied ? styles.copyBtnCopied : ""}`}
            onClick={handleCopyResponse}
            aria-label={copied ? "Copied" : "Copy response"}
          >
            <Image
              src={copied ? "/icons/copied.svg" : "/icons/copy.svg"}
              alt=""
              width={16}
              height={16}
            />
            {copied ? (
              <span className={styles.copyBtnLabel}>Copied</span>
            ) : (
              <ActionTooltip label="Copy response" />
            )}
          </button>
        </span>
      </h2>

      <MarkdownContent className={styles.aiContent} content={content} />
    </div>
  );
}
