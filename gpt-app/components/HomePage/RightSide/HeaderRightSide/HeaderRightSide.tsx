import styles from './HeaderRightSide.module.css';
import Image from 'next/image';

export default function HeaderRightSide({chatTitle}:{chatTitle: string | null | undefined}) {
  return (
    <div className={styles.container}>
        <div className={styles.containerGroupLogos}>
        <Image className={styles.rabbitLogo} src='/icons/rabbit.svg' alt='logo-rabbit' width={47} height={47}/>
        <Image className={styles.headerTextLogo} src='/icons/text-logo.svg' alt='text-gptiti-logo' width={92} height={27}/>
        </div>
        <div className={styles.containerChatInfo}>
            <span className={styles.chatInfoSpan}>CHAT</span>
            <span className={styles.chatInfoTitle}>
                {chatTitle && chatTitle.length > 24
                ? chatTitle.slice(0, 24) + '...'
                : chatTitle}
                </span>
        </div>
    </div>
  )
}
