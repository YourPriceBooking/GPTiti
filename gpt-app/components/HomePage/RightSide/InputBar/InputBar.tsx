import Image from "next/image";
import styles from "./InputBar.module.css";
import { useState, useEffect, useLayoutEffect } from "react";

export default function InputBar({
  hasInput,
  onChange,
  onSend,
  inputRef,
  onHideSection,
  templateTick,
}: {
  hasInput: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: (message: string) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  onHideSection: () => void;
  templateTick: number;
}) {
  const [isMultiline, setIsMultiline] = useState(false);
  const [shouldScroll, setShouldScroll] = useState(false);

  const resizeTextarea = () => {
    const textarea = inputRef.current;
    if (!textarea) return;

    const BASE = 68;
    const MAX = 240;

    const PB_NORMAL = 20;
    const PB_MULTI = 60;

    textarea.style.overflowY = "hidden";
    textarea.style.paddingBottom = `${PB_NORMAL}px`;
    textarea.style.height = `${BASE}px`;
    textarea.scrollTop = 0;

    if (!textarea.value.trim()) {
      setIsMultiline(false);
      setShouldScroll(false);
      return;
    }

    const overflows = textarea.scrollHeight > textarea.clientHeight;

    if (!overflows) {
      setIsMultiline(false);
      setShouldScroll(false);
      return;
    }

    textarea.style.paddingBottom = `${PB_MULTI}px`;
    textarea.style.height = "auto";

    const full = textarea.scrollHeight;
    const next = Math.min(full + 2, MAX);
    textarea.style.height = `${next}px`;

    const needScroll = full > MAX;
    textarea.style.overflowY = needScroll ? "auto" : "hidden";
    textarea.scrollTop = 0;

    setIsMultiline(true);
    setShouldScroll(needScroll);
  };

  useLayoutEffect(() => {
    resizeTextarea();

    requestAnimationFrame(() => {
      resizeTextarea();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateTick]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e);
    resizeTextarea();
  };

  const handleSend = () => {
    if (inputRef.current) {
      const message = inputRef.current.value;
      if (message.trim() !== "") {
        onSend(message);
        onHideSection();
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
    ${isMultiline ? styles.multiline : ""} 
    ${shouldScroll ? styles.scrollable : ""}
  `}
    >
      <div className={styles.iconWrapper} tabIndex={0}>
        <Image width={28} height={28} src="/icons/plus.svg" alt="plus" />
      </div>

      <textarea
        ref={inputRef}
        className={styles.input}
        placeholder="Ask anything..."
        onChange={handleChange}
        rows={1}
      />

      <div className={styles.iconWrapper1} tabIndex={0}>
        <Image
          width={35}
          height={35}
          src="/icons/microphone.svg"
          alt="microphone"
        />
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
