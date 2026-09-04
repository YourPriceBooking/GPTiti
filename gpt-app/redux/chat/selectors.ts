import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export const selectChatList = (state: RootState) => state.chat.chatList;
export const selectSortedChatList = createSelector(
  [selectChatList],
  (chatList) => chatList,
);
export const selectActiveChatId = (state: RootState) => state.chat.activeChatId;
export const selectActiveChat = (state: RootState) =>
  state.chat.chatList.find((c) => c.id === state.chat.activeChatId);

export const selectActiveChatMessagesStatus = (state: RootState) =>
  state.chat.chatList.find((c) => c.id === state.chat.activeChatId)
    ?.messagesStatus;
export const selectActiveChatModelId = (state: RootState) =>
  state.chat.chatList.find((c) => c.id === state.chat.activeChatId)?.modelId;
export const selectActiveChatMessageCount = (state: RootState) =>
  state.chat.chatList.find((c) => c.id === state.chat.activeChatId)?.messages
    .length ?? 0;
export const selectIsTyping = (state: RootState) => state.chat.isTyping;
export const selectInputSent = (state: RootState) => state.chat.inputSent;
export const selectHasInput = (state: RootState) => state.chat.hasInput;
export const selectTemplateTick = (state: RootState) => state.chat.templateTick;
export const selectChatStatus = (state: RootState) => state.chat.status;
export const selectChatError = (state: RootState) => state.chat.error;
