"use client";

import { useEffect, useMemo, useRef } from "react";

import { selectIsLoggedIn } from "@/redux/auth/selectors";
import {
  selectActiveChatId,
  selectActiveChatMessagesStatus,
  selectChatStatus,
} from "@/redux/chat/selectors";
import { fetchConversationMessages } from "@/redux/chat/operations";
import { isDraftId } from "@/redux/chat/slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export function useChatRestore(): { restoringActiveChat: boolean } {
  const dispatch = useAppDispatch();

  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const activeChatId = useAppSelector(selectActiveChatId);
  const messagesStatus = useAppSelector(selectActiveChatMessagesStatus);
  const chatListStatus = useAppSelector(selectChatStatus);
  const restoreRequestRef = useRef<{
    chatId: string;
    abort: () => void;
  } | null>(null);

  useEffect(() => {
    if (!isLoggedIn || !activeChatId || isDraftId(activeChatId)) return;

    if (messagesStatus !== "idle") return;
    const request = dispatch(fetchConversationMessages(activeChatId));
    const trackedRequest = { chatId: activeChatId, abort: request.abort };
    restoreRequestRef.current = trackedRequest;

    void request.finally(() => {
      if (restoreRequestRef.current === trackedRequest) {
        restoreRequestRef.current = null;
      }
    });
  }, [isLoggedIn, activeChatId, messagesStatus, dispatch]);

  useEffect(
    () => () => {
      const request = restoreRequestRef.current;
      if (request?.chatId !== activeChatId) return;
      request.abort();
      restoreRequestRef.current = null;
    },
    [activeChatId, isLoggedIn],
  );

  const restoringActiveChat = useMemo(() => {
    if (!isLoggedIn || !activeChatId || isDraftId(activeChatId)) return false;

    if (messagesStatus === undefined) {
      return chatListStatus === "idle" || chatListStatus === "loading";
    }

    return messagesStatus === "idle" || messagesStatus === "loading";
  }, [isLoggedIn, activeChatId, messagesStatus, chatListStatus]);

  return { restoringActiveChat };
}
