"use client"
import { useRef, useState } from 'react';
import LeftSide from '@/components/HomePage/LeftSide/LeftSide';
import styles from './page.module.css';
import Image from 'next/image';

import { Message } from '@/types/types';

export default function Home() {
  const [hasInput, setHasInput] = useState(false);
  const [inputSent, setInputSent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
 const [messages, setMessages] = useState<Message[]>([]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setHasInput(e.target.value.trim().length > 0);
  }

   function handleSendClick() {
  if (hasInput && inputRef.current) {
    const userText = inputRef.current.value.trim();
    const aiResponse = generateAIResponse(userText); 

    setMessages(prev => [...prev, { user: userText, ai: aiResponse }]);
    setInputSent(true);
    setHasInput(false);
    inputRef.current.value = '';
  }
}

function generateAIResponse(userText: string) {
  return (
    <div className={styles.aiBlock}>
      <h2 className={styles.aiTitle}>✅ Рекомендовані стилі (під твій інтерфейс)</h2>

      <p className={styles.aiSubtitle}>1. Заголовок блоку</p>
      <p className={styles.aiText}>
        (наприклад: “2. Баланс білого простору”) пппппппппппппппппппппппппппппппронононгоононорр
      </p>
      <ul className={styles.aiList}>
        <li>Font size: 20–22px</li>
        <li>Font weight: 600</li>
        <li>Line height: 130%</li>
        <li>Letter spacing: 0</li>
        <li>Color: #1A1A1A</li>
      </ul>

      <p className={styles.aiSubtitle}>2. Підзаголовок / підписи</p>
      <p className={styles.aiText}>
        (рядки типу “Зараз воно:”, “Зроби:”) птптьпрьрпьпбььптатрпьрьптиваиапитттттттттттттттттттии
      </p>
      <ul className={styles.aiList}>
        <li>Font size: 16px</li>
        <li>Font weight: 500</li>
        <li>Line height: 140%</li>
        <li>Letter spacing: 0</li>
      </ul>
</div>
  );
}
  
  return (
    <div className={styles.appContainer}>
      <LeftSide />
      <div className={styles.rightSection}>
        <div className={inputSent ? styles.inputBottom : styles.inputWrapper}>
        {messages.map((msg, index) => (
  <div key={index}>
    <div className={styles.userMessageContainer}>
      <div className={styles.userMessage}>
        <span className={styles.userText}>{msg.user}</span>
      </div>
    </div>
    <div className={styles.aiMessageContainer}>
      <div className={styles.aiMessage}>
        <span className={styles.aiText}>{msg.ai}</span>
      </div>
    </div>
  </div>
))}
          <div className={styles.inputContainer}>
            <div className={styles.iconWrapper} tabIndex={0}>
              <Image width={20} height={20} src="/icons/plus.svg" alt="plus" />
            </div>
            <input 
              type="text" 
              ref={inputRef}
              className={styles.input} 
              placeholder="Ask anything..."
              onChange={handleChange} 
            />
            <div className={styles.iconWrapper1} tabIndex={0}>
              <Image width={35} height={35} src="/icons/microphone.svg" alt="microphone" />
            </div>
            {hasInput ? (
              <div 
                className={`${styles.iconWrapper2} ${styles.disabledHover}`}
                onClick={() => handleSendClick()}
              >
                <Image src="/icons/send.svg" width={35} height={35} alt="send" />
              </div>
            ) : (
              <div className={styles.iconWrapper2} tabIndex={0}>
                <Image src="/icons/voice.svg" width={35} height={35} alt="voice" />
              </div>
            )}
          </div>
          {inputSent && (
            <div className={styles.spanContainer}>
            <span className={styles.inputSpan}>AI systems may make mistakes, 
              so we recommend verifying important information.
              </span>
            </div>
            )}
        </div>
      </div>
    </div>
  )
}