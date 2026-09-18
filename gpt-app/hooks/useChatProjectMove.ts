"use client";

import { useCallback } from "react";

import { fetchConversations } from "@/redux/chat/operations";
import { useAppDispatch } from "@/redux/hooks";
import {
  addProjectConversations,
  removeProjectConversation,
} from "@/redux/projects/operations";

export function useChatProjectMove() {
  const dispatch = useAppDispatch();

  const removeFromProject = useCallback(
    async (conversationId: string, projectId: string) => {
      const action = await dispatch(
        removeProjectConversation({ projectId, conversationId }),
      );
      if (removeProjectConversation.fulfilled.match(action)) {
        dispatch(fetchConversations());
      }
    },
    [dispatch],
  );

  const moveToProject = useCallback(
    async (
      conversationId: string,
      toProjectId: string,
      fromProjectId?: string,
    ) => {
      if (fromProjectId) {
        const removed = await dispatch(
          removeProjectConversation({
            projectId: fromProjectId,
            conversationId,
          }),
        );
        if (!removeProjectConversation.fulfilled.match(removed)) return;
      }

      await dispatch(
        addProjectConversations({
          projectId: toProjectId,
          conversationIds: [conversationId],
        }),
      );
      dispatch(fetchConversations());
    },
    [dispatch],
  );

  return { moveToProject, removeFromProject };
}
