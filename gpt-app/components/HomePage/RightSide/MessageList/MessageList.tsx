import styles from "./MessageList.module.css";
import TypingPlaceholder from "../../TypingPlaceholder/TypingPlaceholder";
import AIResponse from "../AIResponse/AIResponse";
import type { Message } from "@/types/types";

type MessageListProps = {
  messages: Message[];
  isTyping?: boolean;
  hasFirstRequest: boolean;
};

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
          return (
            <div key={key} className={styles.userMessage}>
              <div className={styles.userBubble}>
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
              </div>
            </div>
          );
        }

        const isWaiting = message.streaming && message.content.length === 0;
        return (
          <div key={key} className={styles.aiMessage}>
            {isWaiting ? (
              <TypingPlaceholder />
            ) : (
              <>
                <AIResponse content={message.content} />
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
