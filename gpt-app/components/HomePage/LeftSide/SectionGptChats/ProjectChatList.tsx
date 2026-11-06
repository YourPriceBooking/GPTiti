"use client";

import { useEffect, useRef, useState } from "react";
import type { Chat, Project } from "@/types/types";
import { useAppDispatch } from "@/redux/hooks";
import { fetchProject } from "@/redux/projects/operations";
import { newestRequestAt, sortProjectChats } from "@/lib/projects/projectChatOrder";
import ProjectChatActions from "./ProjectChatActions";
import { renameConversation } from "@/redux/chat/operations";
import { renameChat } from "@/redux/chat/slice";
import styles from "./SectionGptChats.module.css";

export default function ProjectChatList({
  id,
  project,
  chats,
  activeChatId,
  onOpenChat,
}: {
  id: string;
  project: Project;
  chats: Chat[];
  activeChatId: string | null;
  onOpenChat: (id: string) => void;
}) {
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [renaming, setRenaming] = useState<{ id: string; title: string } | null>(null);
  const savingRename = useRef(false);
  const cancelledRename = useRef(false);
  const [retry, setRetry] = useState(0);

  // Fetch only expanded projects; never change the selected project or route.
  useEffect(() => {
    let current = true;
    void dispatch(fetchProject(project.id)).then((action) => {
      if (current) {
        setStatus(fetchProject.fulfilled.match(action) ? "ready" : "error");
      }
    });
    return () => { current = false; };
  }, [dispatch, project.id, retry]);

  const conversations = project.conversationIds ?? [];
  const chatsById = new Map(chats.map((chat) => [chat.id, chat]));
  const sorted = sortProjectChats(conversations.map((chat) => ({
    ...chat,
    lastRequestAt: newestRequestAt(chat.lastRequestAt, chatsById.get(chat._id)?.lastRequestAt),
  })));

  return (
    <div id={id} className={styles.projectChats}>
      {sorted.length > 0 && (
        <ul className={styles.projectChatList} aria-label={`Chats in ${project.title}`}>
          {sorted.map((chat) => {
            const title = chat.title || chats.find((item) => item.id === chat._id)?.title || "Untitled chat";
            return (
              <li key={chat._id} className={`${styles.projectChatRow} ${activeChatId === chat._id ? styles.projectChatActive : ""}`}>
                {renaming?.id === chat._id ? (
                  <input
                    autoFocus
                    aria-label="Rename project chat"
                    className={styles.projectChatRename}
                    value={renaming.title}
                    maxLength={60}
                    onChange={(event) => setRenaming({ id: chat._id, title: event.target.value })}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") event.currentTarget.blur();
                      if (event.key === "Escape") { cancelledRename.current = true; setRenaming(null); }
                    }}
                    onBlur={async () => {
                      if (cancelledRename.current || savingRename.current) return;
                      const next = renaming.title.trim();
                      if (!next || next === title) { setRenaming(null); return; }
                      savingRename.current = true;
                      const result = await dispatch(renameConversation({ id: chat._id, title: next }));
                      savingRename.current = false;
                      if (renameConversation.fulfilled.match(result)) {
                        dispatch(renameChat({ chatId: chat._id, newTitle: next }));
                        setRenaming(null);
                        void dispatch(fetchProject(project.id));
                      }
                    }}
                  />
                ) : (
                <button
                  type="button"
                  className={`${styles.projectChatButton} ${activeChatId === chat._id ? styles.projectChatActive : ""}`}
                  aria-current={activeChatId === chat._id ? "page" : undefined}
                  title={title}
                  onClick={() => onOpenChat(chat._id)}
                >
                  <span>{title}</span>
                </button>
                )}
                <ProjectChatActions project={project} chat={chat} onRename={() => {
                  cancelledRename.current = false;
                  setRenaming({ id: chat._id, title });
                }} />
              </li>
            );
          })}
        </ul>
      )}
      {status === "loading" && project.conversationIds === undefined && <p className={styles.projectChatsNotice} role="status">Loading chats…</p>}
      {status === "ready" && sorted.length === 0 && <p className={styles.projectChatsNotice}>No chats yet</p>}
      {status === "error" && (
        <div className={styles.projectChatsNotice} role="status">
          Could not load chats.
          <button type="button" className={styles.projectChatsRetry} onClick={() => {
            setStatus("loading");
            setRetry((value) => value + 1);
          }}>Try again</button>
        </div>
      )}
    </div>
  );
}
