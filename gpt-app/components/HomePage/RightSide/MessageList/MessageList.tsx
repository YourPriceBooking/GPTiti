import { useEffect, useRef, useState } from "react";

import styles from "./MessageList.module.css";
import TypingPlaceholder from "../../TypingPlaceholder/TypingPlaceholder";
import AIResponse from "../AIResponse/AIResponse";
import type { Message } from "@/types/types";

type MessageListProps = {
  messages: Message[];
  isTyping?: boolean;
  hasFirstRequest: boolean;
};

const HIDE_DELAY_MS = 1000;
const COPIED_RESET_MS = 2000;

function CopyGlyph() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckGlyph() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function UserMessage({ message }: { message: Message }) {
  const hasImages = !!message.images && message.images.length > 0;
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
    };
  }, []);

  const showButton = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setHovered(true);
  };

  const scheduleHide = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setHovered(false), HIDE_DELAY_MS);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content).then(() => {
      setCopied(true);
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
      copiedTimer.current = setTimeout(() => setCopied(false), COPIED_RESET_MS);
    });
  };

  const visible = hovered || copied;

  return (
    <div className={styles.userMessage}>
      <div
        className={styles.userBubble}
        onMouseEnter={showButton}
        onMouseLeave={scheduleHide}
      >
        {hasImages && (
          <div className={styles.userImages}>
            {message.images!.map((src, i) => (
              <img
                key={i}
                src={src}
                alt="user attachment"
                className={styles.userImage}
              />
            ))}
          </div>
        )}
        {message.content && (
          <p className={styles.userText}>{message.content}</p>
        )}

        {message.content && (
          <button
            type="button"
            className={`${styles.copyBtn} ${
              visible ? styles.copyBtnVisible : ""
            } ${copied ? styles.copyBtnCopied : ""}`}
            onClick={handleCopy}
            aria-label={copied ? "Copied" : "Copy message"}
          >
            <span className={styles.copyIcon}>
              {copied ? <CheckGlyph /> : <CopyGlyph />}
            </span>
            {copied && <span className={styles.copyLabel}>Copied</span>}
          </button>
        )}
      </div>
    </div>
  );
}

export default function MessageList({
  messages,
  hasFirstRequest,
}: MessageListProps) {
  return (
    <div className={styles.messageList}>
      {messages.map((message, index) => {
        const key = message.id ?? index;

        if (message.role === "user") {
          const hasImages = !!message.images && message.images.length > 0;
          if (!message.content && !hasImages) return null;
          return <UserMessage key={key} message={message} />;
        }

        const isWaiting = message.streaming && message.content.length === 0;
        return (
          <div key={key} className={styles.aiMessage}>
            {isWaiting ? (
              <TypingPlaceholder />
            ) : (
              <>
                <AIResponse
                  content={message.content}
                  modelId={message.modelId}
                />
                {hasFirstRequest && message.tokens !== undefined && (
                  <div className={styles.costInfo}>
                    <span className={styles.costSpan}>
                      Used: {message.tokens} tokens
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
