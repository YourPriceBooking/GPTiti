import React from "react";
import styles from "./MessageList.module.css";
import TypingPlaceholder from "../../TypingPlaceholder/TypingPlaceholder";

type Message = {
  user: string;
  ai: React.ReactNode | null;
  tokens?: number;
};

type MessageListProps = {
  messages: Message[];
  isTyping?: boolean;
  hasFirstRequest: boolean;
};

export default function MessageList({
  messages,
  isTyping = false,
  hasFirstRequest
}: MessageListProps) {
  return (
    <div className={styles.messageList}>
      {messages.map((message, index) => (
        <React.Fragment key={index}>
          {message.user && (
  <div className={styles.userMessage}>
    <p className={styles.userText}>{message.user}</p>
  </div>
)}

{message.ai ? (
            <div className={styles.aiMessage}> 
            {message.ai} 
            {hasFirstRequest && message.tokens !== undefined 
            && ( <div className={styles.costInfo}> 
            <span className={styles.costSpan}>
              Used: {message.tokens} tokens
              </span> 
              </div> )} 
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
