// import CustomScrollbar from '@/components/CustomScrollBar/CustomScrollBar';
import { useState } from 'react';
import styles from './SectionGptChats.module.css';
import Image from 'next/image';
import { SectionGptChatsProps } from '@/types/types';
import ChatsMenu from '../ChatsMenu/ChatsMenu';

export default function SectionGptChats({ onNewChat,
  chatList,
  setActiveChatId }: SectionGptChatsProps) {
  const [openMenuChatId, setOpenMenuChatId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [renamingChatId, setRenamingChatId] = useState<string | null>(null);
  const handleRenameChat = (chatId: string, newTitle: string) => {
  const updatedList = chatList.map(chat =>
    chat.id === chatId ? { ...chat, title: newTitle } : chat
  );
  // Якщо chatList приходить з useChat — виклич метод оновлення
  // updateChatList(updatedList);
};
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
                // onBlur={() => setOpenMenuChatId(null)}
              >
                <span
                  contentEditable={renamingChatId === chat.id}
                  suppressContentEditableWarning={true}
                  className={styles.chatTitle}
                  onBlur={(e) => {
                    const newTitle = e.currentTarget.textContent?.trim();
                    if (newTitle && newTitle !== chat.title) {
                      handleRenameChat(chat.id, newTitle);
                    }
                    setRenamingChatId(null);
                    setOpenMenuChatId(null);
                  }}
                >
                  {chat.title && chat.title.length > 24
                    ? chat.title.slice(0, 24) + '...'
                    : chat.title}
                </span>

                <span
                  className={styles.dotsIcon}
                  onClick={e => {
                    e.stopPropagation();
                    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                    const centerY = rect.top + rect.height / 2;
                    const offsetX = rect.right + 8;
                    setMenuPosition({ top: centerY, left: offsetX });
                    setOpenMenuChatId(chat.id);
                  }}
                ></span>
              </li>
            ))}
        </ul>
      </div>
      {openMenuChatId && menuPosition && (
        <div
          className={styles.menuContainer}
          style={{ top: menuPosition.top, left: menuPosition.left }}
        >
          <ChatsMenu onRenameRequest={() => {
    setRenamingChatId(openMenuChatId); 
    setOpenMenuChatId(null);           
  }} />
        </div>
      )}
    </section>

  )
}
