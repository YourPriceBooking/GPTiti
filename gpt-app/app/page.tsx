"use client"
import { useState } from 'react';
import LeftSide from '@/components/HomePage/LeftSide/LeftSide';
import styles from './page.module.css';
import Image from 'next/image';

export default function Home() {
  const [hasInput, setHasInput] = useState(false);

function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  setHasInput(e.target.value.trim().length > 0);
}
  return (
    <div className={styles.appContainer}>
      <LeftSide />
      <div className={styles.inputWrapper}>
  <div className={styles.inputContainer}>
    <div className={styles.iconWrapper} tabIndex={0}>
      <Image width={20} height={20} src="/icons/plus.svg" alt="plus" />
    </div>
    <input type="text" 
    className={styles.input} 
    placeholder="Ask anything..."
    onChange={handleChange} />
    <div className={styles.iconWrapper1} tabIndex={0}>
      <Image width={35} height={35} src="/icons/microphone.svg" alt="microphone" />
    </div>
  {hasInput ? (
  <div className={`${styles.iconWrapper2} ${hasInput ? styles.disabledHover : ""}`}>
    <Image src="/icons/send.svg" width={35} height={35} alt="send" />
  </div>
) : (
  <div className={`${styles.iconWrapper2}`} tabIndex={0}>
    <Image src="/icons/voice.svg" width={35} height={35} alt="voice" />
  </div>
)}
  </div>
</div>
      </div>
  )
}
