import Image from 'next/image';
import styles from './InputBar.module.css';

export default function InputBar({
  hasInput,
  onChange,
  onSend,
  inputRef
}: {
  hasInput: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
}) {
  

  return (
    <div className={styles.inputContainer}>
      <div className={styles.iconWrapper} tabIndex={0}>
        <Image width={20} height={20} src="/icons/plus.svg" alt="plus" />
      </div>
      <textarea
        ref={inputRef}
        className={styles.input}
        placeholder="Ask anything..."
        onChange={onChange}
      />
      <div className={styles.iconWrapper1} tabIndex={0}>
        <Image width={35} height={35} src="/icons/microphone.svg" alt="microphone" />
      </div>
      {hasInput ? (
        <div
          className={`${styles.iconWrapper2} ${styles.disabledHover}`}
          onClick={onSend}
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