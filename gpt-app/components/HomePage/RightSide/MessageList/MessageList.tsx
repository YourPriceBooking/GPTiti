import React from "react";
import styles from "./MessageList.module.css";
import TypingPlaceholder from "../../TypingPlaceholder/TypingPlaceholder";

type Message = {
  user: string;
  ai: React.ReactNode | null;
};

type MessageListProps = {
  messages: Message[];
  isTyping?: boolean;
};

export default function MessageList({
  messages,
  isTyping = false,
}: MessageListProps) {
  return (
    <div className={styles.messageList}>
      {messages.map((message, index) => (
        <React.Fragment key={index}>
          <div className={styles.userMessage}>
            <p className={styles.userText}>{message.user}</p>
          </div>

          {message.ai ? (
            <div className={styles.aiMessage}>{message.ai}</div>
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
