"use client";

import { useEffect, useState } from "react";
import type { Chat, Project } from "@/types/types";
import { useAppDispatch } from "@/redux/hooks";
import { fetchProject } from "@/redux/projects/operations";
import ChatBubbleIcon from "@/components/common/ChatBubbleIcon";
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
  const sorted = [
    ...conversations.filter((chat) => chat.pinnedAt),
    ...conversations.filter((chat) => !chat.pinnedAt),
  ];

  return (
    <div id={id} className={styles.projectChats}>
      {sorted.length > 0 && (
        <ul className={styles.projectChatList} aria-label={`Chats in ${project.title}`}>
          {sorted.map((chat) => {
            const title = chat.title || chats.find((item) => item.id === chat._id)?.title || "Untitled chat";
            return (
              <li key={chat._id}>
                <button
                  type="button"
                  className={`${styles.projectChatButton} ${activeChatId === chat._id ? styles.projectChatActive : ""}`}
                  aria-current={activeChatId === chat._id ? "page" : undefined}
                  title={title}
                  onClick={() => onOpenChat(chat._id)}
                >
                  <ChatBubbleIcon width={17} height={17} />
                  <span>{title}</span>
                </button>
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
