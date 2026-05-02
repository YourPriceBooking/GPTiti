import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Chat, Message } from "@/types/types";

interface ChatState {
  chatList: Chat[];
  activeChatId: string | null;
  isTyping: boolean;
  inputSent: boolean;
  hasInput: boolean;
  templateTick: number;
}

const initialChatId =
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `chat-${Date.now()}`;

const initialState: ChatState = {
  chatList: [{ id: initialChatId, title: null, messages: [] }],
  activeChatId: initialChatId,
  isTyping: false,
  inputSent: false,
  hasInput: false,
  templateTick: 0,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveChatId(state, { payload }: PayloadAction<string | null>) {
      state.activeChatId = payload;
    },
    appendUserMessage(
      state,
      {
        payload,
      }: PayloadAction<{ chatId: string; user: string; images?: string[] }>,
    ) {
      const chat = state.chatList.find((c) => c.id === payload.chatId);
      if (!chat) return;
      if (chat.title === null) {
        chat.title = payload.user || "Image";
      }
      const msg: Message = {
        user: payload.user,
        ai: null,
        images: payload.images,
      };
      chat.messages.push(msg);
    },
    appendAiMessage(
      state,
      {
        payload,
      }: PayloadAction<{ chatId: string; ai: Message["ai"]; tokens?: number }>,
    ) {
      const chat = state.chatList.find((c) => c.id === payload.chatId);
      if (!chat) return;
      chat.messages.push({
        user: "",
        ai: payload.ai,
        tokens: payload.tokens,
      } as Message);
    },
    handleNewChat(state) {
      const newChatId =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `chat-${Date.now()}`;
      state.chatList.push({ id: newChatId, title: null, messages: [] });
      state.activeChatId = newChatId;
      state.hasInput = false;
      state.inputSent = false;
      state.isTyping = false;
    },
    deleteChat(state, { payload }: PayloadAction<string>) {
      state.chatList = state.chatList.filter((c) => c.id !== payload);

      if (state.activeChatId === payload) {
        if (state.chatList.length > 0) {
          state.activeChatId = state.chatList[state.chatList.length - 1].id;
        } else {
          const newChatId = crypto.randomUUID?.() ?? `chat-${Date.now()}`;
          state.chatList.push({ id: newChatId, title: null, messages: [] });
          state.activeChatId = newChatId;
        }
        state.hasInput = false;
        state.inputSent = false;
        state.isTyping = false;
      }
    },
    renameChat(
      state,
      { payload }: PayloadAction<{ chatId: string; newTitle: string }>,
    ) {
      const chat = state.chatList.find((c) => c.id === payload.chatId);
      if (chat) chat.title = payload.newTitle;
    },
    setHasInput(state, { payload }: PayloadAction<boolean>) {
      state.hasInput = payload;
    },
    setInputSent(state, { payload }: PayloadAction<boolean>) {
      state.inputSent = payload;
    },
    setIsTyping(state, { payload }: PayloadAction<boolean>) {
      state.isTyping = payload;
    },
    bumpTemplateTick(state) {
      state.templateTick += 1;
    },
  },
});

export const {
  setActiveChatId,
  appendUserMessage,
  appendAiMessage,
  handleNewChat,
  deleteChat,
  renameChat,
  setHasInput,
  setInputSent,
  setIsTyping,
  bumpTemplateTick,
} = chatSlice.actions;

export const chatReducer = chatSlice.reducer;
