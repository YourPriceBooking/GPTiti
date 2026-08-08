"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import styles from "./AIResponse.module.css";

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

marked.use({
  gfm: true,
  breaks: true,
  renderer: {
    code({ text, lang }) {
      const language = (lang ?? "").trim().split(/\s+/)[0] || "text";
      return (
        `<div class="code-block">` +
        `<div class="code-header">` +
        `<span class="code-lang">${escapeHtml(language)}</span>` +
        `<button type="button" class="code-copy-btn" aria-label="Копіювати код">` +
        `<span class="code-copy-icon"></span>` +
        `<span class="code-copy-label">Copied</span>` +
        `</button>` +
        `</div>` +
        `<pre><code class="language-${escapeHtml(language)}">${escapeHtml(text)}</code></pre>` +
        `</div>`
      );
    },
  },
});

type AIResponseProps = {
  content: string;
  modelId?: string;
};

export default function AIResponse({ content, modelId }: AIResponseProps) {
  const html = useMemo(() => {
    const raw = marked.parse(content, { async: false });
    return DOMPurify.sanitize(raw);
  }, [content]);

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
