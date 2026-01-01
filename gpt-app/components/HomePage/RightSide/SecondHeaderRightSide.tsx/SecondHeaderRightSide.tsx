import { SecondHeaderRightSideProps } from '@/types/types';
import styles from './SecondHeaderRightSide.module.css';
import Image from 'next/image';

export default function SecondHeaderRightSide({
  chatTitle, 
  hidden
}: SecondHeaderRightSideProps & { hidden: boolean }) {
  return (
    <div
      className={`${styles.groupContainerChatInfo} ${
        hidden ? styles.hidden : styles.visible
      }`}
    >
      <Image src="/icons/chat-icon.svg" width={28} height={28} alt="chat-icon" /> 
      <div className={styles.containerChatInfo}> 
        <span className={styles.chatInfoSpan}>CHAT</span> 
        <span className={styles.chatInfoTitle}> 
          {chatTitle && chatTitle.length > 24 ? 
          chatTitle.slice(0, 24) + '...' : chatTitle} 
        </span> 
      </div> 
    </div> 
  )
}
