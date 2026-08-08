"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { renderAssistantMarkdown } from "@/lib/markdown";
import styles from "./AIResponse.module.css";

type AIResponseProps = {
  content: string;
  modelId?: string;
};

export default function AIResponse({ content, modelId }: AIResponseProps) {
  const html = useMemo(() => renderAssistantMarkdown(content), [content]);

  const hasCodeBlock = useMemo(
    () => html.includes('class="code-block"'),
    [html],
  );

  const [copied, setCopied] = useState(false);

  const handleCopyResponse = useCallback(() => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [content]);

  const handleContentClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const button = (event.target as HTMLElement).closest(".code-copy-btn");
      if (!button) return;

      const code = button.closest(".code-block")?.querySelector("pre code");
      if (!code) return;

      navigator.clipboard.writeText(code.textContent ?? "").then(() => {
        button.classList.add("copied");
        setTimeout(() => {
          button.classList.remove("copied");
        }, 2000);
      });
    },
    [],
  );

  return (
    <div
      className={`${styles.aiBlock} ${hasCodeBlock ? "" : styles.aiBlockText}`}
    >
      <h2 className={styles.aiTitle}>
        <Image
          src="/icons/rabbit.svg"
          alt="logo-rabbit"
          height={41}
          width={41}
        />
        <p className={styles.aiParagraph}>GPTiti</p>
        {modelId && <span className={styles.aiModel}>{modelId}</span>}

        <button
          type="button"
          className={`${styles.copyBtn} ${copied ? styles.copyBtnCopied : ""}`}
          onClick={handleCopyResponse}
            aria-label={copied ? "Скопійовано" : "Копіювати відповідь"}
        >
          <Image
            src={copied ? "/icons/copied.svg" : "/icons/copy.svg"}
            alt=""
            width={16}
            height={16}
          />
          {copied && <span className={styles.copyBtnLabel}>Copied</span>}
        </button>
      </h2>

      <div
        className={styles.aiContent}
        onClick={handleContentClick}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
