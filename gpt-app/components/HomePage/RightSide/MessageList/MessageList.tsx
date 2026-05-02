import React from "react";
import styles from "./MessageList.module.css";
import TypingPlaceholder from "../../TypingPlaceholder/TypingPlaceholder";
import AIResponse from "../AIResponse/AIResponse";
import type { Message } from "@/types/types";

type MessageListProps = {
  messages: Message[];
  isTyping?: boolean;
  hasFirstRequest: boolean;
};

function renderAi(kind: Message["ai"]) {
  switch (kind) {
    case "default":
      return <AIResponse />;
    default:
      return null;
  }
}

export default function MessageList({
  messages,
  isTyping = false,
  hasFirstRequest,
}: MessageListProps) {
  return (
    <div className={styles.messageList}>
      {messages.map((message, index) => (
        <React.Fragment key={index}>
          {(message.user || (message.images && message.images.length > 0)) && (
            <div className={styles.userMessage}>
              <div className={styles.userBubble}>
                {message.images && message.images.length > 0 && (
                  <div className={styles.userImages}>
                    {message.images.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt="user attachment"
                        className={styles.userImage}
                      />
                    ))}
                  </div>
                )}
                {message.user && (
                  <p className={styles.userText}>{message.user}</p>
                )}
              </div>
            </div>
          )}

          {message.ai ? (
            <div className={styles.aiMessage}>
              {renderAi(message.ai)}
              {hasFirstRequest && message.tokens !== undefined && (
                <div className={styles.costInfo}>
                  <span className={styles.costSpan}>
                    Used: {message.tokens} tokens
                  </span>
                </div>
              )}
            </div>
          ) : isTyping && index === messages.length - 1 ? (
            <div className={styles.aiMessage}>
              <TypingPlaceholder />
            </div>
          ) : null}
        </React.Fragment>
      ))}
    </div>
  );
}
