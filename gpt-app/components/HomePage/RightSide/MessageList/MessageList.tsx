import { Message } from '@/types/types';
import styles from './MessageList.module.css';

export default function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div className={styles.messagesContainer}>
      {messages.map((msg, index) => (
        <div key={index}>
          <div className={styles.userMessageContainer}>
            <div className={styles.userMessage}>
              <span className={styles.userText}>{msg.user}</span>
            </div>
          </div>
          <div className={styles.aiMessageContainer}>
            <div className={styles.aiMessage}>{msg.ai}</div>
          </div>
        </div>
      ))}
    </div>
  );
}