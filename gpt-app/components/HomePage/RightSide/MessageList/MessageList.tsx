import React from "react";
import styles from "./MessageList.module.css";
import TypingPlaceholder from "../../TypingPlaceholder/TypingPlaceholder";

type Message = {
  user: string;
  ai: React.ReactNode | null;
  tokens?: number;
  images?: string[];
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
