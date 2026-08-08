"use client";

import { useCallback, useEffect, useMemo } from "react";

import { readErrorMessage } from "@/lib/errorMessage";
import { selectIsLoggedIn } from "@/redux/auth/selectors";
import { selectChatList } from "@/redux/chat/selectors";
import { fetchConversations } from "@/redux/chat/operations";
import { isDraftId } from "@/redux/chat/slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addProjectConversations,
  fetchProject,
  removeProjectConversation,
} from "@/redux/projects/operations";
import { selectProjectList } from "@/redux/projects/selectors";
import {
  selectActiveProjectId,
  selectAddChatsProjectId,
} from "@/redux/ui/selectors";
import type { Chat } from "@/types/types";

const ADD_TO_PROJECT_FAILED = "Couldn't add the chat to the project.";
const REMOVE_FROM_PROJECT_FAILED = "Couldn't remove the chat from the project.";

type UseProjectChatsParams = {
  onError: (message: string) => void;
};

export function useProjectChats({ onError }: UseProjectChatsParams) {
  const dispatch = useAppDispatch();

  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const chatList = useAppSelector(selectChatList);
  const projectList = useAppSelector(selectProjectList);
  const activeProjectId = useAppSelector(selectActiveProjectId);
  const addChatsProjectId = useAppSelector(selectAddChatsProjectId);

  const activeProject = projectList.find((p) => p.id === activeProjectId);
  const addChatsProject = projectList.find((p) => p.id === addChatsProjectId);

  const projectChats = useMemo<Chat[]>(
    () =>
      (activeProject?.conversationIds ?? []).map((conv) => {
        const loaded = chatList.find((c) => c.id === conv._id);
        return {
          id: conv._id,
          title: conv.title ?? loaded?.title ?? null,
          preview: conv.summary,
          modelId: conv.modelId ?? loaded?.modelId,
          lastMessageAt: conv.lastMessageAt ?? loaded?.lastMessageAt,
          createdAt: conv.createdAt ?? loaded?.createdAt,
          messages: loaded?.messages ?? [],
          messagesStatus: loaded?.messagesStatus ?? "idle",
        };
      }),
    [activeProject?.conversationIds, chatList],
  );

  const availableChatsForProject = useMemo(() => {
    const inProject = new Set(
      (addChatsProject?.conversationIds ?? []).map((c) => c._id),
    );
    return chatList.filter(
      (c) => !isDraftId(c.id) && c.title !== null && !inProject.has(c.id),
    );
  }, [chatList, addChatsProject?.conversationIds]);

  useEffect(() => {
    if (!isLoggedIn || !activeProjectId) return;
    dispatch(fetchProject(activeProjectId));
  }, [isLoggedIn, activeProjectId, dispatch]);

  useEffect(() => {
    if (!isLoggedIn || !addChatsProjectId) return;
    dispatch(fetchProject(addChatsProjectId));
  }, [isLoggedIn, addChatsProjectId, dispatch]);

  const linkConversations = useCallback(
    (projectId: string, conversationIds: string[]) => {
      if (conversationIds.length === 0) return;
      dispatch(addProjectConversations({ projectId, conversationIds }))
        .unwrap()
        .then(() => dispatch(fetchConversations()))
        .catch((err: unknown) =>
          onError(readErrorMessage(err, ADD_TO_PROJECT_FAILED)),
        );
    },
    [dispatch, onError],
  );

  const unlinkConversation = useCallback(
    (conversationId: string) => {
      if (!activeProjectId) return;
      dispatch(
        removeProjectConversation({
          projectId: activeProjectId,
          conversationId,
        }),
      )
        .unwrap()
        .then(() => dispatch(fetchConversations()))
        .catch((err: unknown) =>
          onError(readErrorMessage(err, REMOVE_FROM_PROJECT_FAILED)),
        );
    },
    [dispatch, activeProjectId, onError],
  );

  return {
    projectList,
    activeProject,
    addChatsProject,
    addChatsProjectId,
    projectChats,
    availableChatsForProject,
    linkConversations,
    unlinkConversation,
  };
}
