import { useState, useRef, useEffect } from 'react';
import styles from './SectionGptChats.module.css';
import Image from 'next/image';
import { SectionGptChatsProps } from '@/types/types';
import ChatsMenu from '../ChatsMenu/ChatsMenu';
import DeleteModalWindow from '../DeleteModalWindow/DeleteModalWindow';

export default function SectionGptChats({
  onNewChat,
  chatList,
  setActiveChatId,
  deleteChat,
  renameChat,
}: SectionGptChatsProps) {
  const [openMenuChatId, setOpenMenuChatId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [renamingChatId, setRenamingChatId] = useState<string | null>(null);
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);
  const [isChatsOpen, setIsChatsOpen] = useState(false);
  const [showAllChats, setShowAllChats] = useState(false);

  const MAX_VISIBLE_CHATS = 5;
  const titledChats = chatList.filter((chat) => chat.title !== null);
  const chatsCount = titledChats.length;
  const hasChats = chatsCount > 0;
  // Header toggles the list only with fewer than 5 chats; with 5+ it is always shown.
  const isCollapsible = hasChats && chatsCount < MAX_VISIBLE_CHATS;
  const hasMoreChats = chatsCount > MAX_VISIBLE_CHATS;
  const listVisible = hasChats && (isCollapsible ? isChatsOpen : true);
  const visibleChats =
    hasMoreChats && !showAllChats
      ? titledChats.slice(0, MAX_VISIBLE_CHATS)
      : titledChats;
  const hiddenChatsCount = chatsCount - MAX_VISIBLE_CHATS;
  // Folder icon appears only when the >5 list is expanded via the show-more button.
  const showFolderIcon = hasMoreChats && showAllChats;
  const menuRef = useRef<HTMLDivElement | null>(null);
  const titleRefs = useRef<Record<string, HTMLSpanElement | null>>({});

 
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setOpenMenuChatId(null);
        setDeletingChatId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  useEffect(() => {
  if (!renamingChatId) return;

  const el = titleRefs.current[renamingChatId];
  if (!el) return;

  el.focus();

  
  const range = document.createRange();
  const selection = window.getSelection();

  range.selectNodeContents(el);
  range.collapse(false);

  selection?.removeAllRanges();
  selection?.addRange(range);
}, [renamingChatId]);

  return (
    <section className={styles.gptChats}>
      <article className={styles.gptNewChat} tabIndex={0}>
        <Image width={36} height={36} src="/icons/new-chat.svg" alt="new-chat" />
        <button className={styles.chatsSpan} onClick={onNewChat}>
          Start New Chat
        </button>
      </article>

      <article
        className={styles.yourChats}
        onClick={isCollapsible ? () => setIsChatsOpen((open) => !open) : undefined}
        role={isCollapsible ? "button" : undefined}
        tabIndex={isCollapsible ? 0 : undefined}
      >
        <Image
          width={36}
          height={36}
          src={showFolderIcon ? "/icons/folder-icon.svg" : "/icons/chat-bubble.svg"}
          alt="your-chats"
        />
        <div className={styles.labelWrapper}>
          <button className={styles.span}>Your Chats</button>
          {isCollapsible && (
            <div
              className={`${styles.icon} ${isChatsOpen ? styles.iconOpen : ""}`}
            >
              <Image width={15} height={15} src="/icons/chevron-down.svg" alt="chevron-down" />
            </div>
          )}
        </div>
      </article>

      {listVisible && (
        <div
          className={`${styles.chatsScrollArea} ${
            showAllChats && hasMoreChats ? styles.chatsScrollAreaScroll : ""
          }`}
        >
          <ul className={styles.chatsList}>
            {visibleChats.map(chat => (
              <li
                key={chat.id}
                className={styles.chatsListItem}
                tabIndex={0}
                onClick={() => setActiveChatId(chat.id)}
              >
                <span
                  ref={(el) => {
                    if (el) titleRefs.current[chat.id] = el;
                  }}
                  contentEditable={renamingChatId === chat.id}
                  suppressContentEditableWarning
                  className={styles.chatTitle}
                  onBlur={(e) => {
                    const newTitle = e.currentTarget.textContent?.trim();
                    if (newTitle && newTitle !== chat.title) {
                      renameChat(chat.id, newTitle);
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
      )}

      {hasMoreChats && (
        <button
          type="button"
          className={styles.showMoreBtn}
          onClick={() => setShowAllChats((prev) => !prev)}
          aria-label={showAllChats ? "Show fewer chats" : "Show more chats"}
        >
          {!showAllChats && (
            <span className={styles.showMoreDots}>
              {Array.from({ length: hiddenChatsCount }).map((_, i) => (
                <span key={i} className={styles.showMoreDot} />
              ))}
            </span>
          )}
          <Image
            className={`${styles.showMoreChevron} ${
              showAllChats ? styles.showMoreChevronUp : ""
            }`}
            width={15}
            height={15}
            src="/icons/chevron-down.svg"
            alt="toggle chats"
          />
        </button>
      )}

      {openMenuChatId && menuPosition && (
        <div
          ref={menuRef}
          className={styles.menuContainer}
          style={{ top: menuPosition.top, left: menuPosition.left }}
        >
          <ChatsMenu
            onRenameRequest={() => {
              setRenamingChatId(openMenuChatId);
              setOpenMenuChatId(null);
            }}
            onDeleteRequest={() => {
              setDeletingChatId(openMenuChatId);
              setOpenMenuChatId(null);
            }}
          />
        </div>
      )}

      {deletingChatId && menuPosition && (
        <div
          ref={menuRef}
          className={styles.menuContainer}
          style={{ top: menuPosition.top, left: menuPosition.left }}
        >
          <DeleteModalWindow
            onCancel={() => setDeletingChatId(null)}
            onConfirm={() => {
              deleteChat(deletingChatId);
              setDeletingChatId(null);
            }}
          />
        </div>
      )}
    </section>
  );
}