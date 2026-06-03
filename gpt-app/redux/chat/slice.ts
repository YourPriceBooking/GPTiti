import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Chat, Message } from "@/types/types";
import { isAnyOf } from "@reduxjs/toolkit";
import {
  fetchConversations,
  fetchConversationMessages,
  removeConversation,
} from "./operations";
import { logoutUser, refreshUser } from "../auth/operations";
import { refreshError } from "../auth/slice";

interface ChatState {
  chatList: Chat[];
  activeChatId: string | null;
  isTyping: boolean;
  inputSent: boolean;
  hasInput: boolean;
  templateTick: number;
  status: "idle" | "loading" | "error";
  error: string | null;
}

const randomId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const makeDraftId = () => `draft-${randomId()}`;

export const isDraftId = (id: string | null | undefined): boolean =>
  typeof id === "string" && id.startsWith("draft-");

const removeChatById = (state: ChatState, id: string) => {
  state.chatList = state.chatList.filter((c) => c.id !== id);

  if (state.activeChatId !== id) return;

  if (state.chatList.length > 0) {
    state.activeChatId = state.chatList[state.chatList.length - 1].id;
  } else {
    const draftId = makeDraftId();
    state.chatList.push({ id: draftId, title: null, messages: [] });
    state.activeChatId = draftId;
  }
  state.hasInput = false;
  state.inputSent = false;
  state.isTyping = false;
};

const initialDraftId = makeDraftId();

const initialState: ChatState = {
  chatList: [{ id: initialDraftId, title: null, messages: [] }],
  activeChatId: initialDraftId,
  isTyping: false,
  inputSent: false,
  hasInput: false,
  templateTick: 0,
  status: "idle",
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveChatId(state, { payload }: PayloadAction<string | null>) {
      state.activeChatId = payload;
    },

    handleNewChat(state) {
      // Reuse an existing empty draft instead of stacking blank chats.
      const emptyDraft = state.chatList.find(
        (c) => isDraftId(c.id) && c.messages.length === 0,
      );
      if (emptyDraft) {
        state.activeChatId = emptyDraft.id;
      } else {
        const draftId = makeDraftId();
        state.chatList.push({ id: draftId, title: null, messages: [] });
        state.activeChatId = draftId;
      }
      state.hasInput = false;
      state.inputSent = false;
      state.isTyping = false;
    },

    promoteDraft(
      state,
      {
        payload,
      }: PayloadAction<{
        draftId: string;
        realId: string;
        title: string | null;
      }>,
    ) {
      const chat = state.chatList.find((c) => c.id === payload.draftId);
      if (!chat) return;
      chat.id = payload.realId;
      if (payload.title) chat.title = payload.title;
      chat.messagesLoaded = true; // brand-new conversation, nothing to fetch
      if (state.activeChatId === payload.draftId) {
        state.activeChatId = payload.realId;
      }
    },

    appendUserMessage(
      state,
      {
        payload,
      }: PayloadAction<{ chatId: string; content: string; images?: string[] }>,
    ) {
      const chat = state.chatList.find((c) => c.id === payload.chatId);
      if (!chat) return;
      if (chat.title === null) {
        chat.title = payload.content || "Image";
      }
      const msg: Message = {
        role: "user",
        content: payload.content,
        images: payload.images,
      };
      chat.messages.push(msg);
    },

    startAssistantMessage(
      state,
      { payload }: PayloadAction<{ chatId: string; modelId?: string }>,
    ) {
      const chat = state.chatList.find((c) => c.id === payload.chatId);
      if (!chat) return;
      chat.messages.push({
        role: "assistant",
        content: "",
        streaming: true,
        modelId: payload.modelId,
      });
    },

    appendAssistantChunk(
      state,
      { payload }: PayloadAction<{ chatId: string; chunk: string }>,
    ) {
      const chat = state.chatList.find((c) => c.id === payload.chatId);
      if (!chat) return;
      let last = chat.messages[chat.messages.length - 1];
      if (!last || last.role !== "assistant" || !last.streaming) {
        chat.messages.push({ role: "assistant", content: "", streaming: true });
        last = chat.messages[chat.messages.length - 1];
      }
      last.content += payload.chunk;
    },

    finishAssistantMessage(
      state,
      { payload }: PayloadAction<{ chatId: string; tokens?: number }>,
    ) {
      const chat = state.chatList.find((c) => c.id === payload.chatId);
      if (!chat) return;
      const last = chat.messages[chat.messages.length - 1];
      if (last && last.role === "assistant") {
        last.streaming = false;
        if (payload.tokens !== undefined) last.tokens = payload.tokens;
      }
    },

    deleteDraftChat(state, { payload }: PayloadAction<string>) {
      removeChatById(state, payload);
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

  extraReducers: (builder) =>
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, { payload }) => {
        state.status = "idle";
        // Preserve local drafts and any already-loaded chats; merge in server chats.
        const drafts = state.chatList.filter((c) => isDraftId(c.id));
        const existingById = new Map(state.chatList.map((c) => [c.id, c]));
        const serverChats = payload.map(
          (c) =>
            existingById.get(c._id) ?? {
              id: c._id,
              title: c.title,
              messages: [],
              messagesLoaded: false,
            },
        );
        state.chatList = [...drafts, ...serverChats];
        if (!state.chatList.some((c) => c.id === state.activeChatId)) {
          state.activeChatId = state.chatList[0]?.id ?? null;
        }
      })
      .addCase(fetchConversations.rejected, (state, { payload }) => {
        state.status = "error";
        state.error = payload ?? "Failed to load conversations";
      })
      .addCase(fetchConversationMessages.fulfilled, (state, { payload }) => {
        const chat = state.chatList.find((c) => c.id === payload.id);
        if (!chat) return;
        chat.messages = payload.messages.map((m) => ({
          id: m._id,
          role: m.role,
          content: m.content,
          tokens: m.tokens,
          modelId: m.modelId,
        }));
        chat.messagesLoaded = true;
      })
      .addCase(fetchConversationMessages.rejected, (state, { payload }) => {
        state.error = payload ?? "Failed to load messages";
      })
      .addCase(removeConversation.fulfilled, (state, { payload }) => {
        removeChatById(state, payload);
      })
      .addCase(removeConversation.rejected, (state, { payload }) => {
        state.error = payload ?? "Failed to delete conversation";
      })

      .addMatcher(
        isAnyOf(logoutUser.fulfilled, refreshError, refreshUser.rejected),
        (state) => {
          const draftId = makeDraftId();
          state.chatList = [{ id: draftId, title: null, messages: [] }];
          state.activeChatId = draftId;
          state.isTyping = false;
          state.inputSent = false;
          state.hasInput = false;
          state.status = "idle";
          state.error = null;
        },
      ),
});

export const {
  setActiveChatId,
  handleNewChat,
  promoteDraft,
  appendUserMessage,
  startAssistantMessage,
  appendAssistantChunk,
  finishAssistantMessage,
  deleteDraftChat,
  renameChat,
  setHasInput,
  setInputSent,
  setIsTyping,
  bumpTemplateTick,
} = chatSlice.actions;

export const chatReducer = chatSlice.reducer;
