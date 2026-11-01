"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import type { Project } from "@/types/types";
import type { ProjectConversation } from "@/types/api.types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchProject, updateProjectConversationPin } from "@/redux/projects/operations";
import { removeConversation } from "@/redux/chat/operations";
import { setIsCreateProjectModalOpen, showErrorToast } from "@/redux/ui/slice";
import { useChatProjectMove } from "@/hooks/useChatProjectMove";
import ChatsMenu from "../ChatsMenu/ChatsMenu";
import DeleteModalWindow from "../DeleteModalWindow/DeleteModalWindow";
import ChatActionModal, { type ChatAction } from "../ConfirmModalWindow/ChatActionModal";
import ProjectPickerModal from "../ProjectPickerModal/ProjectPickerModal";
import styles from "./SectionGptChats.module.css";

export default function ProjectChatActions({ project, chat, onRename }: {
  project: Project;
  chat: ProjectConversation;
  onRename: () => void;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const projects = useAppSelector((state) => state.projects.list);
  const { moveToProject, removeFromProject } = useChatProjectMove();
  const [mode, setMode] = useState<"menu" | "delete" | ChatAction | null>(null);
  const [moving, setMoving] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const trigger = useRef<HTMLButtonElement>(null);
  const popup = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = popup.current;
    if (!mode || !element) return;
    const rect = element.getBoundingClientRect();
    element.style.top = `${Math.max(8, Math.min(rect.top, window.innerHeight - rect.height - 8))}px`;
    element.style.left = `${Math.max(8, Math.min(rect.left, window.innerWidth - rect.width - 8))}px`;
  }, [mode]);

  useEffect(() => {
    if (!mode) return;
    const closeOutside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!popup.current?.contains(target) && !trigger.current?.contains(target)) setMode(null);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMode(null); trigger.current?.focus(); }
    };
    const followTrigger = () => {
      const anchor = trigger.current?.getBoundingClientRect();
      const box = popup.current?.getBoundingClientRect();
      if (!anchor || !box || !popup.current) return;
      if (anchor.bottom < 0 || anchor.top > window.innerHeight) { setMode(null); return; }
      popup.current.style.top = `${Math.max(8, Math.min(anchor.bottom + 6, window.innerHeight - box.height - 8))}px`;
      popup.current.style.left = `${Math.max(8, Math.min(anchor.right - box.width, window.innerWidth - box.width - 8))}px`;
    };
    const frame = requestAnimationFrame(() => popup.current?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true }));
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", followTrigger);
    window.addEventListener("scroll", followTrigger, true);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", followTrigger);
      window.removeEventListener("scroll", followTrigger, true);
    };
  }, [mode]);

  const changeMode = (next: "menu" | "delete" | ChatAction) => {
    const rect = trigger.current?.getBoundingClientRect();
    if (!rect) return;
    const width = next === "menu" ? 260 : 300;
    const height = next === "menu" ? 390 : 230;
    setPosition({
      top: Math.max(8, Math.min(rect.bottom + 6, window.innerHeight - height - 8)),
      left: Math.max(8, Math.min(rect.right - width, window.innerWidth - width - 8)),
    });
    setMode(next);
  };

  const archiveOrDelete = async () => {
    // The existing DELETE endpoint soft-archives the conversation on the server.
    // Wait for navigation to commit before removing the currently viewed chat;
    // otherwise the existing route guard can report a false missing-chat error.
    const viewedPath = `/chats/${encodeURIComponent(chat._id)}`;
    if (window.location.pathname.endsWith(viewedPath)) {
      router.push("/");
      const left = await new Promise<boolean>((resolve) => {
        let frame = 0;
        const timeout = window.setTimeout(() => {
          cancelAnimationFrame(frame);
          resolve(false);
        }, 5000);
        const check = () => {
          if (!window.location.pathname.endsWith(viewedPath)) {
            window.clearTimeout(timeout);
            requestAnimationFrame(() => resolve(true));
          } else frame = requestAnimationFrame(check);
        };
        frame = requestAnimationFrame(check);
      });
      if (!left) {
        dispatch(showErrorToast("Could not leave this chat. Please try again."));
        return;
      }
    }
    const result = await dispatch(removeConversation(chat._id));
    if (removeConversation.fulfilled.match(result)) {
      setMode(null);
      void dispatch(fetchProject(project.id));
    }
  };

  return (
    <>
      <button
        ref={trigger}
        type="button"
        className={styles.projectChatDots}
        aria-label={`Actions for chat ${chat.title || "Untitled chat"} in ${project.title}`}
        aria-haspopup="menu"
        aria-expanded={mode === "menu"}
        onClick={() => mode ? setMode(null) : changeMode("menu")}
      ><span aria-hidden="true">···</span></button>
      {mode && createPortal(
        <div ref={popup} className={styles.projectChatPopup} style={position} onClick={(event) => event.stopPropagation()}>
          {mode === "menu" ? (
            <ChatsMenu
              onClose={() => { if (!popup.current?.contains(document.activeElement)) setMode(null); }}
              pinScope="project"
              isPinned={Boolean(chat.projectPinnedAt)}
              onPinToggle={() => {
                setMode(null);
                void dispatch(updateProjectConversationPin({ projectId: project.id, conversationId: chat._id, pinned: !chat.projectPinnedAt }));
              }}
              showCreateProject
              onCreateProject={() => { setMode(null); dispatch(setIsCreateProjectModalOpen(true)); }}
              projectTitle={project.title}
              onRenameRequest={() => { setMode(null); onRename(); }}
              onArchive={() => changeMode("archive")}
              onDeleteRequest={() => changeMode("delete")}
              onMoveToProject={() => changeMode("move")}
              onRemoveFromProject={() => changeMode("remove")}
            />
          ) : mode === "delete" ? (
            <DeleteModalWindow onCancel={() => setMode(null)} onConfirm={() => { void archiveOrDelete(); }} />
          ) : (
            <ChatActionModal action={mode} onCancel={() => setMode(null)} onConfirm={() => {
              if (mode === "move") { setMode(null); setMoving(true); }
              else if (mode === "remove") {
                setMode(null);
                void removeFromProject(chat._id, project.id);
              } else void archiveOrDelete();
            }} />
          )}
        </div>, document.body,
      )}
      {moving && createPortal(
        <ProjectPickerModal
          projects={projects.filter((item) => item.id !== project.id)}
          onClose={() => setMoving(false)}
          onConfirm={(target) => { setMoving(false); void moveToProject(chat._id, target, project.id); }}
        />, document.body,
      )}
    </>
  );
}
