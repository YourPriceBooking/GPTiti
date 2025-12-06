import Image from 'next/image';
import styles from './InputBar.module.css';
import { useState, useEffect } from 'react';

export default function InputBar({
  hasInput,
  onChange,
  onSend,
  inputRef
}: {
  hasInput: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: (message: string) => void;   
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
}) {
  const [isMultiline, setIsMultiline] = useState(false);
  const [shouldScroll, setShouldScroll] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "68px"; 
    }
  }, [inputRef]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e);

    if (inputRef.current) {
      const textarea = inputRef.current;

      textarea.style.height = 'auto'; 
      const currentHeight = textarea.scrollHeight;

      const baseHeight = 68; 
      const lineHeight = 25; 
      const maxHeightBeforeScroll = 240;

      if (textarea.value === '') {
        textarea.style.height = `${baseHeight}px`;
        setIsMultiline(false);
        setShouldScroll(false);
      } 
      else if (currentHeight > baseHeight && currentHeight <= baseHeight + lineHeight) {
        textarea.style.height = `${currentHeight}px`;
        setIsMultiline(true);
        setShouldScroll(false);
      } 
      else if (currentHeight > baseHeight + lineHeight) {
        if (currentHeight > maxHeightBeforeScroll) {
          textarea.style.height = `${maxHeightBeforeScroll}px`;
          setIsMultiline(true);
          setShouldScroll(true);
        } else {
          textarea.style.height = `${currentHeight}px`;
          setIsMultiline(true);
          setShouldScroll(false);
        }
      } else {
        textarea.style.height = `${baseHeight}px`;
        setIsMultiline(false);
        setShouldScroll(false);
      }
    }
  };

  const handleSend = () => {
    if (inputRef.current) {
      const message = inputRef.current.value; 
      if (message.trim() !== "") {
        onSend(message);                      
      }
      inputRef.current.value = "";            
      inputRef.current.style.height = "68px"; 
      setIsMultiline(false);
      setShouldScroll(false);
    }
  };

  return (
    <div
      className={`
        ${styles.inputContainer} 
        ${isMultiline ? styles.multiline : ''} 
        ${isMultiline ? styles.expanded : ''} 
        ${shouldScroll ? styles.scrollable : ''}
      `}
    >
      <div className={styles.iconWrapper} tabIndex={0}>
        <Image width={20} height={20} src="/icons/plus.svg" alt="plus" />
      </div>

      <textarea
        ref={inputRef}
        className={styles.input}
        placeholder="Ask anything..."
        onChange={handleChange}
        style={{ height: "68px" }} 
      />

      <div className={styles.iconWrapper1} tabIndex={0}>
        <Image width={35} height={35} src="/icons/microphone.svg" alt="microphone" />
      </div>

      {hasInput ? (
        <div
          className={`${styles.iconWrapper2} ${styles.disabledHover}`}
          onClick={handleSend}   
        >
          <Image src="/icons/send.svg" width={35} height={35} alt="send" />
        </div>
      ) : (
        <div className={styles.iconWrapper2} tabIndex={0}>
          <Image src="/icons/voice.svg" width={35} height={35} alt="voice" />
        </div>
      )}
    </div>
  );
}