"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { formatActivity } from "@/lib/formatActivity";
import { renderAssistantMarkdown } from "@/lib/markdown";
import { highlightCodeHtml } from "@/lib/shiki";
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
  const html = useMemo(() => renderAssistantMarkdown(content), [content]);

  const [copied, setCopied] = useState(false);

  const [highlighted, setHighlighted] = useState({ source: "", html: "" });

  useEffect(() => {
    if (!html.includes('class="code-block"')) return;

    let cancelled = false;

    const timer = setTimeout(() => {
      void highlightCodeHtml(html)
        .then((result) => {
          if (!cancelled) setHighlighted({ source: html, html: result });
        })
        .catch((error) => {
          console.error("Syntax highlighting failed", error);
        });
    }, 150);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [html]);

  const renderedHtml = highlighted.source === html ? highlighted.html : html;

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
    <div className={styles.aiBlock}>
      <h2 className={styles.aiTitle}>
        <Image
          src="/icons/rabbit.svg"
          alt="logo-rabbit"
          height={41}
          width={41}
        />
        <p className={styles.aiParagraph}>GPTiti</p>
        {modelId && <span className={styles.aiModel}>{modelId}</span>}
        {updatedLabel && (
          <span className={styles.aiUpdated}>{updatedLabel}</span>
        )}

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
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />
    </div>
  );
}
