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

  const textarea = inputRef.current;
  if (!textarea) return;

  const baseHeight = 68;
  const maxHeight = 240;

  textarea.style.height = `${baseHeight}px`;
  textarea.style.overflowY = 'hidden';

  
  const hasWrappedLine = textarea.scrollHeight > textarea.clientHeight;

  if (!textarea.value.trim()) {
    setIsMultiline(false);
    setShouldScroll(false);
    return;
  }

  if (!hasWrappedLine) {
    
    setIsMultiline(false);
    setShouldScroll(false);
    return;
  }

  
  if (textarea.scrollHeight > maxHeight) {
    textarea.style.height = `${maxHeight}px`;
    textarea.style.overflowY = 'auto';
    setShouldScroll(true);
  } else {
    textarea.style.height = `${textarea.scrollHeight}px`;
    setShouldScroll(false);
  }

  setIsMultiline(true);
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