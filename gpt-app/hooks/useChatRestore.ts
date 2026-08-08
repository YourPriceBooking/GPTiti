"use client";

import { useEffect, useMemo } from "react";

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

  useEffect(() => {
    if (!isLoggedIn || !activeChatId || isDraftId(activeChatId)) return;

    if (messagesStatus !== "idle") return;
    dispatch(fetchConversationMessages(activeChatId));
  }, [isLoggedIn, activeChatId, messagesStatus, dispatch]);

  const restoringActiveChat = useMemo(() => {
    if (!isLoggedIn || !activeChatId || isDraftId(activeChatId)) return false;

    if (messagesStatus === undefined) {
      return chatListStatus === "idle" || chatListStatus === "loading";
    }

    return messagesStatus === "idle" || messagesStatus === "loading";
  }, [isLoggedIn, activeChatId, messagesStatus, chatListStatus]);

  return { restoringActiveChat };
}
