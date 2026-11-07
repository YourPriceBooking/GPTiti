"use client";

import { useRef, useState } from "react";
import ActionTooltip from "@/components/common/ActionTooltip/ActionTooltip";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectSelectedModel } from "@/redux/model/selectors";
import { createConversation, fetchConversations } from "@/redux/chat/operations";
import { addProjectConversations, fetchProject } from "@/redux/projects/operations";
import styles from "./SectionGptChats.module.css";

export default function ProjectNewChatButton({ projectId, projectTitle, onCreated }: {
  projectId: string;
  projectTitle: string;
  onCreated: (id: string) => void;
}) {
  const dispatch = useAppDispatch();
  const modelId = useAppSelector(selectSelectedModel);
  const [creating, setCreating] = useState(false);
  const inFlight = useRef(false);
  // Keep a created blank chat on failure so Retry does not create another one.
  const createdId = useRef<string | null>(null);

  const create = async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setCreating(true);
    try {
      if (!createdId.current) {
        const chat = await dispatch(createConversation({ modelId })).unwrap();
        createdId.current = chat._id;
      }
      await dispatch(addProjectConversations({
        projectId, conversationIds: [createdId.current],
      })).unwrap();
      // Do not navigate until the target chat is present in the route guard's list.
      await dispatch(fetchConversations()).unwrap();
      void dispatch(fetchProject(projectId));
      const id = createdId.current;
      createdId.current = null;
      onCreated(id);
    } catch {
      // Existing rejected-thunk middleware displays the error; retain the chat for retry.
    } finally {
      inFlight.current = false;
      setCreating(false);
    }
  };

  return (
    <button
      type="button"
      className={`${styles.projectOpenButton} ${styles.projectNewChatButton}`}
      aria-label={`New chat in ${projectTitle}`}
      aria-busy={creating}
      disabled={creating}
      onClick={(event) => { event.stopPropagation(); void create(); }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <path d="M12 5v14M5 12h14" />
      </svg>
      <ActionTooltip label={creating ? "Creating chat…" : "New chat in project"} />
    </button>
  );
}
