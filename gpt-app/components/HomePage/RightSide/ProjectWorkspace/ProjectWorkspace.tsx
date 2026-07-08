import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import InputBar from "@/components/HomePage/RightSide/InputBar/InputBar";
import ChooseModelColumn from "@/components/HomePage/RightSide/ChooseModelColumn/ChooseModelColumn";
import ChatsMenu from "@/components/HomePage/LeftSide/ChatsMenu/ChatsMenu";
import DeleteModalWindow from "@/components/HomePage/LeftSide/DeleteModalWindow/DeleteModalWindow";
import { useAppSelector } from "@/redux/hooks";
import { selectActiveChatId } from "@/redux/chat/selectors";
import type { Chat } from "@/types/types";

import styles from "./ProjectWorkspace.module.css";

const PINNED_CHATS_KEY = "pinnedChatIds";

type ProjectWorkspaceProps = {
  name: string;
  onCreateFirstChat: () => void;
  inputProps: React.ComponentProps<typeof InputBar>;
  onChooseModel: () => void;
  showEstimate: boolean;
  chats?: Chat[];
  chatsLoaded?: boolean;
  onOpenChat?: (id: string) => void;
  onRemoveChat?: (id: string) => void;
};

/**style label from an ISO timestamp. */
function formatRelativeTime(iso?: string): string | null {
  if (!iso) return null;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return null;

  const sec = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (sec < 60) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  const wk = Math.floor(day / 7);
  if (wk < 5) return `${wk}w ago`;
  const mo = Math.floor(day / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(day / 365)}y ago`;
}

function getChatPreview(chat: Chat): string | null {
  const lastAssistant = [...chat.messages]
    .reverse()
    .find((m) => m.role === "assistant")?.content;
  return lastAssistant?.trim().replace(/\s+/g, " ") || null;
}

export default function ProjectWorkspace({
  name,
  onCreateFirstChat,
  inputProps,
  onChooseModel,
  showEstimate,
  chats = [],
  chatsLoaded = true,
  onOpenChat,
  onRemoveChat,
}: ProjectWorkspaceProps) {
  const chatCount = chats.length;
  const hasChats = chatCount > 0;

  const activeChatId = useAppSelector(selectActiveChatId);

  const [openMenuChatId, setOpenMenuChatId] = useState<string | null>(null);
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);
  const [pinnedChatIds, setPinnedChatIds] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem(PINNED_CHATS_KEY) || "[]");
  });
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    localStorage.setItem(PINNED_CHATS_KEY, JSON.stringify(pinnedChatIds));
  }, [pinnedChatIds]);

  const togglePinChat = (id: string) => {
    setPinnedChatIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const pinnedChats = [...pinnedChatIds]
    .reverse()
    .map((id) => chats.find((c) => c.id === id))
    .filter((c): c is Chat => c !== undefined);
  const sortedChats = [
    ...pinnedChats,
    ...chats.filter((c) => !pinnedChatIds.includes(c.id)),
  ];

  useEffect(() => {
    if (!openMenuChatId && !deletingChatId) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setOpenMenuChatId(null);
        setDeletingChatId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuChatId, deletingChatId]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerIcon}>
          <Image
            src="/icons/create-modal-project.svg"
            alt="project"
            width={40}
            height={40}
          />
        </div>
        <div className={styles.headerText}>
          <h1 className={styles.title}>{name}</h1>
          <p className={styles.subtitle}>Project workspace</p>
          <p className={styles.description}>
            Organize chats, links, images, edited images and uploaded files in
            one place.
          </p>
        </div>
      </header>

      <div className={styles.inputRow}>
        <InputBar
          {...inputProps}
          placeholder="Start a new chat in this project"
          variant="project"
        />
        <div className={styles.modelRow}>
          <ChooseModelColumn
            selectedModel={inputProps.selectedModel}
            showEstimate={showEstimate}
            onChoose={onChooseModel}
          />
        </div>
      </div>

      <div className={styles.tabsRow}>
        <span className={styles.tab}>Chats</span>
        <span className={styles.counter}>
          <Image src="/icons/chat-bubble.svg" alt="" width={18} height={18} />
          {chatCount} chats
        </span>
      </div>

      <div className={styles.divider} />

      {hasChats ? (
        <ul className={styles.chatGrid}>
          {sortedChats.map((chat) => {
            const preview = getChatPreview(chat);
            const updated = formatRelativeTime(chat.lastMessageAt);
            const isActive = chat.id === activeChatId;
            const isPinned = pinnedChatIds.includes(chat.id);

            return (
              <li
                key={chat.id}
                className={`${styles.chatCard} ${
                  isActive ? styles.chatCardActive : ""
                }`}
                tabIndex={0}
                onClick={() => onOpenChat?.(chat.id)}
              >
                {isPinned && (
                  <span className={styles.cardPin}>
                    <Image
                      src="/icons/pin.svg"
                      alt="pinned"
                      width={14}
                      height={15}
                    />
                  </span>
                )}
                <div className={styles.cardIcon}>
                  <Image
                    src="/icons/new-chat.svg"
                    alt=""
                    width={24}
                    height={24}
                  />
                </div>

                <div className={styles.cardBody}>
                  <span className={styles.cardTitle}>
                    {chat.title || "Untitled chat"}
                  </span>
                  {chat.modelId && (
                    <span className={styles.cardBadge}>{chat.modelId}</span>
                  )}
                  {preview && <p className={styles.cardPreview}>{preview}</p>}
                  {updated && (
                    <span className={styles.cardMeta}>Updated {updated}</span>
                  )}
                </div>

                <button
                  type="button"
                  className={styles.cardMenuBtn}
                  aria-label="Chat options"
                  aria-haspopup="menu"
                  aria-expanded={openMenuChatId === chat.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuChatId((prev) =>
                      prev === chat.id ? null : chat.id,
                    );
                  }}
                >
                  <Image
                    src="/icons/three-points.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                </button>

                {openMenuChatId === chat.id && (
                  <div
                    ref={menuRef}
                    className={styles.cardMenu}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ChatsMenu
                      isPinned={pinnedChatIds.includes(chat.id)}
                      onPinToggle={() => {
                        togglePinChat(chat.id);
                        setOpenMenuChatId(null);
                      }}
                      showCreateProject
                      onCreateProject={() => setOpenMenuChatId(null)}
                      onRenameRequest={() => setOpenMenuChatId(null)}
                      onDeleteRequest={() => {
                        setDeletingChatId(chat.id);
                        setOpenMenuChatId(null);
                      }}
                    />
                  </div>
                )}

                {deletingChatId === chat.id && (
                  <div
                    ref={menuRef}
                    className={styles.cardMenu}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DeleteModalWindow
                      onCancel={() => setDeletingChatId(null)}
                      onConfirm={() => {
                        onRemoveChat?.(chat.id);
                        setDeletingChatId(null);
                      }}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : chatsLoaded ? (
        <div className={styles.emptyState}>
          <div className={styles.decorPattern} aria-hidden="true">
            <div className={styles.decorDots} />
          </div>
          <div className={styles.emptyContent}>
            <div className={styles.emptyIcon}>
              <Image
                src="/icons/create-modal-project.svg"
                alt=""
                width={36}
                height={36}
              />
            </div>
            <h2 className={styles.emptyTitle}>No chats yet</h2>
            <p className={styles.emptyDescription}>
              Create your first chat in this project. Chats, links, images,
              edited images, and uploaded files stay in this project history.
            </p>
            <button
              type="button"
              className={styles.createButton}
              onClick={onCreateFirstChat}
            >
              Create first chat
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
