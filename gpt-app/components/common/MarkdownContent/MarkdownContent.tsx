"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { renderAssistantMarkdown } from "@/lib/markdown";
import { fenceBareCodeBlocks, highlightCodeHtml } from "@/lib/shiki";
import styles from "./MarkdownContent.module.css";

type MarkdownContentProps = {
  content: string;
  className?: string;
  highlightCode?: boolean;
  fenceBareCode?: boolean;
  codeCopy?: boolean;
};

export default function MarkdownContent({
  content,
  className = "",
  highlightCode = true,
  fenceBareCode = false,
  codeCopy = true,
}: MarkdownContentProps) {
  const html = useMemo(() => {
    const source = fenceBareCode ? fenceBareCodeBlocks(content) : content;

    return renderAssistantMarkdown(source);
  }, [content, fenceBareCode]);

  const [highlighted, setHighlighted] = useState({ source: "", html: "" });

  useEffect(() => {
    if (!highlightCode || !html.includes('class="code-block"')) return;

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
  }, [html, highlightCode]);

  const renderedHtml = highlighted.source === html ? highlighted.html : html;

  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
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
  }, []);

  return (
    <div
      className={`${styles.markdown} ${codeCopy ? "" : styles.noCodeCopy} ${className}`}
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
}
