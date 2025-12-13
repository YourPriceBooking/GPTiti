import CustomScrollbar from '@/components/CustomScrollBar/CustomScrollBar';
import styles from './SectionGptChats.module.css';
import Image from 'next/image';
import { SectionGptChatsProps } from '@/types/types';

export default function SectionGptChats({onNewChat,
  chatList,
  setActiveChatId}: SectionGptChatsProps) {
  return (
    
        <section className={styles.gptChats}>
          <article className={styles.gptNewChat} tabIndex={0}>
            <Image width={36} height={36} src="/icons/new-chat.svg" alt="new-chat" />
            <button className={styles.chatsSpan} onClick={onNewChat}>
              Start New Chat
            </button>
          </article>

          <article className={styles.yourChats}>
            <Image width={38} height={38} src="/icons/chat-bubble.svg" alt="chat-bubble" />
            <div className={styles.labelWrapper}>
              <button className={styles.span}>Your Chats</button>
              <div className={styles.icon}>
                <Image width={15} height={15} src="/icons/chevron-down.svg" alt="chevron-down" />
              </div>
            </div>
          </article>
          <div className={styles.chatsScrollArea}>
          <ul className={styles.chatsList}>
            {chatList
              .filter(chat => chat.title !== null)
              .map(chat => (
                <li
                  key={chat.id}
                  className={styles.chatsListItem}
                  tabIndex={0}
                  onClick={() => setActiveChatId(chat.id)}
                >
                  <span>
                    {chat.title && chat.title.length > 24
                      ? chat.title.slice(0, 24) + '...'
                      : chat.title}
                  </span>
                  <span className={styles.dotsIcon}></span>
                </li>
              ))}
          </ul>
          {chatList.filter(chat => chat.title !== null).length > 0 && (
    <CustomScrollbar scrollTargetClass={styles.chatsScrollArea} />
  )}
              </div>
          
        </section>
      
  )
}
