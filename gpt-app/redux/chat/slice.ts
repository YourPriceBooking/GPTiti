import { createSlice, isAnyOf, type PayloadAction } from "@reduxjs/toolkit";
import type { Chat, ChatProject, Message, PendingChatTurn } from "@/types/types";
import type { ConversationProject } from "@/types/api.types";
import type {
  ChatEndEvent,
  ChatErrorEvent,
  ChatStreamEvent,
  ChatTurnSnapshot,
} from "@/lib/chat/chatProtocol";
import {
  mergeServerMessages,
  removeCorrelatedTurnMessages,
  upsertCorrelatedMessage,
} from "@/lib/chat/chatState";
import {
  fetchConversations,
  fetchConversationMessages,
  removeConversation,
  updateConversationPin,
} from "./operations";
import { logoutUser, refreshUser } from "../auth/operations";
import { refreshError } from "../auth/slice";

type ChatListStatus = "idle" | "loading" | "loaded" | "error";

interface ChatState {
  chatList: Chat[];
  activeChatId: string | null;
  pendingTurns: Record<string, PendingChatTurn>;
  isTyping: boolean;
  inputSent: boolean;
  hasInput: boolean;
  templateTick: number;
  status: ChatListStatus;
  error: string | null;
  pinMutations: Record<string, string>;
}

const ACTIVE_TURN_STATUSES = new Set<PendingChatTurn["status"]>([
  "awaiting_ack",
  "queued",
  "processing",
  "syncing",
]);

const toChatProject = (
  project?: ConversationProject | null,
): ChatProject | undefined =>
  project
    ? {
        id: project._id,
        title: project.title,
        icon: project.icon,
        color: project.color,
      }
    : undefined;

const randomId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const makeDraftId = () => `draft-${randomId()}`;

const makeDraftChat = (): Chat => ({
  id: makeDraftId(),
  title: null,
  messages: [],
  messagesStatus: "loaded",
  pinnedAt: null,
});

export const isDraftId = (id: string | null | undefined): boolean =>
  typeof id === "string" && id.startsWith("draft-");

const refreshIsTyping = (state: ChatState) => {
  state.isTyping = Object.values(state.pendingTurns).some((turn) =>
    ACTIVE_TURN_STATUSES.has(turn.status),
  );
};

const findChat = (state: ChatState, conversationId: string) =>
  state.chatList.find((chat) => chat.id === conversationId);

const updateTurnMessages = (
  state: ChatState,
  clientMessageId: string,
  update: (message: Message) => void,
) => {
  const turn = state.pendingTurns[clientMessageId];
  if (!turn) return;
  const chat = findChat(state, turn.conversationId);
  if (!chat) return;
  for (const message of chat.messages) {
    if (message.clientMessageId === clientMessageId) update(message);
  }
};

const reconcileSnapshot = (state: ChatState, snapshot: ChatTurnSnapshot) => {
  const turn = state.pendingTurns[snapshot.clientMessageId];
  if (!turn || turn.conversationId !== snapshot.conversationId) return;
  if (turn.turnId && turn.turnId !== snapshot.turnId) return;
  if (snapshot.attempt < turn.attempt) return;

  turn.turnId = snapshot.turnId;
  turn.status = snapshot.status;
  turn.attempt = snapshot.attempt;
  turn.lastAppliedSeq = snapshot.lastSeq;
  turn.partialContent =
    snapshot.assistantMessage?.content ?? snapshot.partialContent;
  turn.retryable = snapshot.error?.retryable ?? false;
  turn.errorCode = snapshot.error?.code;
  turn.errorMessage = snapshot.error?.message;

  const chat = findChat(state, snapshot.conversationId);
  if (!chat) {
    refreshIsTyping(state);
    return;
  }

  const userMessage = chat.messages.find(
    (message) =>
      message.role === "user" &&
      message.clientMessageId === snapshot.clientMessageId,
  );
  if (userMessage) {
    userMessage.turnId = snapshot.turnId;
    userMessage.attempt = snapshot.attempt;
    userMessage.deliveryStatus = "accepted";
  }

  const existingAssistant = chat.messages.find(
    (message) =>
      message.role === "assistant" &&
      (message.turnId === snapshot.turnId ||
        message.clientMessageId === snapshot.clientMessageId),
  );
  const completedMessage = snapshot.assistantMessage;
  const isCompleted = snapshot.status === "completed" && completedMessage;
  const isFailed = snapshot.status === "failed";
  const assistant: Message = {
    id: completedMessage?.id ?? existingAssistant?.id ?? `client-assistant:${snapshot.clientMessageId}`,
    role: "assistant",
    content: completedMessage?.content ?? snapshot.partialContent,
    modelId: completedMessage?.modelId ?? existingAssistant?.modelId ?? turn.modelId,
    tokens:
      snapshot.billing?.appTokensSpent ??
      completedMessage?.tokens ??
      existingAssistant?.tokens,
    updatedAt: completedMessage?.updatedAt ?? snapshot.updatedAt,
    streaming: !isCompleted && !isFailed,
    error: isFailed ? snapshot.error?.message : undefined,
    errorCode: isFailed ? snapshot.error?.code : undefined,
    retryable: isFailed ? snapshot.error?.retryable : false,
    clientMessageId: snapshot.clientMessageId,
    turnId: snapshot.turnId,
    attempt: snapshot.attempt,
  };
  chat.messages = upsertCorrelatedMessage(chat.messages, assistant);

  if (snapshot.status === "completed") {
    chat.lastMessageAt = completedMessage?.updatedAt ?? snapshot.updatedAt;
    delete state.pendingTurns[snapshot.clientMessageId];
  }
  refreshIsTyping(state);
};

const removeChatById = (state: ChatState, id: string) => {
  state.chatList = state.chatList.filter((chat) => chat.id !== id);
  for (const [clientMessageId, turn] of Object.entries(state.pendingTurns)) {
    if (turn.conversationId === id) delete state.pendingTurns[clientMessageId];
  }

  if (state.activeChatId === id) {
    if (state.chatList.length > 0) {
      state.activeChatId = state.chatList[state.chatList.length - 1].id;
    } else {
      const draft = makeDraftChat();
      state.chatList.push(draft);
      state.activeChatId = draft.id;
    }
    state.hasInput = false;
    state.inputSent = false;
  }
  refreshIsTyping(state);
};

const initialDraft = makeDraftChat();

const initialState: ChatState = {
  chatList: [initialDraft],
  activeChatId: initialDraft.id,
  pendingTurns: {},
  isTyping: false,
  inputSent: false,
  hasInput: false,
  templateTick: 0,
  status: "idle",
  error: null,
  pinMutations: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveChatId(state, { payload }: PayloadAction<string | null>) {
      state.activeChatId = payload;
    },

    handleNewChat(state) {
      const emptyDraft = state.chatList.find(
        (chat) => isDraftId(chat.id) && chat.messages.length === 0,
      );
      if (emptyDraft) {
        state.activeChatId = emptyDraft.id;
      } else {
        const draft = makeDraftChat();
        state.chatList.push(draft);
        state.activeChatId = draft.id;
      }
      state.hasInput = false;
      state.inputSent = false;
      refreshIsTyping(state);
    },

    addConversation(
      state,
      {
        payload,
      }: PayloadAction<{
        id: string;
        title: string | null;
        modelId?: string;
      }>,
    ) {
      const existing = state.chatList.find((chat) => chat.id === payload.id);
      if (!existing) {
        state.chatList.push({
          id: payload.id,
          title: payload.title,
          messages: [],
          messagesStatus: "loaded",
          modelId: payload.modelId,
          lastMessageAt: new Date().toISOString(),
          pinnedAt: null,
        });
      }
      state.activeChatId = payload.id;
    },

    promoteDraft(
      state,
      {
        payload,
      }: PayloadAction<{
        draftId: string;
        realId: string;
        title: string | null;
        modelId?: string;
      }>,
    ) {
      const chat = state.chatList.find((item) => item.id === payload.draftId);
      if (!chat) return;
      chat.id = payload.realId;
      if (payload.title) chat.title = payload.title;
      if (payload.modelId) chat.modelId = payload.modelId;
      chat.messagesStatus = "loaded";
      if (state.activeChatId === payload.draftId) {
        state.activeChatId = payload.realId;
      }
    },

    registerPendingTurn(
      state,
      {
        payload,
      }: PayloadAction<{ turn: PendingChatTurn; images?: string[] }>,
    ) {
      const { turn } = payload;
      state.pendingTurns[turn.clientMessageId] = turn;
      const chat = findChat(state, turn.conversationId);
      if (!chat) {
        refreshIsTyping(state);
        return;
      }
      if (chat.title === null) chat.title = turn.message || "Image";
      chat.messages = upsertCorrelatedMessage(chat.messages, {
        id: `client-user:${turn.clientMessageId}`,
        role: "user",
        content: turn.message,
        images: payload.images,
        clientMessageId: turn.clientMessageId,
        attempt: turn.attempt,
        deliveryStatus: "sending",
      });
      chat.messages = upsertCorrelatedMessage(chat.messages, {
        id: `client-assistant:${turn.clientMessageId}`,
        role: "assistant",
        content: "",
        modelId: turn.modelId,
        streaming: true,
        retryable: false,
        clientMessageId: turn.clientMessageId,
        attempt: turn.attempt,
      });
      chat.lastMessageAt = turn.createdAt;
      refreshIsTyping(state);
    },

    reconcilePendingTurn(
      state,
      { payload }: PayloadAction<ChatTurnSnapshot>,
    ) {
      reconcileSnapshot(state, payload);
    },

    appendPendingTurnChunk(
      state,
      { payload }: PayloadAction<ChatStreamEvent>,
    ) {
      const turn = state.pendingTurns[payload.clientMessageId];
      if (!turn || turn.conversationId !== payload.conversationId) return;
      if (turn.turnId && turn.turnId !== payload.turnId) return;
      if (turn.attempt !== payload.attempt) return;
      if (payload.payload.seq <= turn.lastAppliedSeq) return;
      if (payload.payload.seq !== turn.lastAppliedSeq + 1) {
        turn.status = "syncing";
        refreshIsTyping(state);
        return;
      }

      turn.turnId = payload.turnId;
      turn.status = "processing";
      turn.lastAppliedSeq = payload.payload.seq;
      turn.partialContent += payload.payload.chunk;
      const chat = findChat(state, payload.conversationId);
      if (!chat) return;
      const assistant = chat.messages.find(
        (message) =>
          message.role === "assistant" &&
          (message.turnId === payload.turnId ||
            message.clientMessageId === payload.clientMessageId),
      );
      if (!assistant) return;
      assistant.turnId = payload.turnId;
      assistant.attempt = payload.attempt;
      assistant.content += payload.payload.chunk;
      assistant.streaming = true;
      assistant.error = undefined;
      assistant.retryable = false;
      updateTurnMessages(state, payload.clientMessageId, (message) => {
        if (message.role === "user") {
          message.turnId = payload.turnId;
          message.deliveryStatus = "accepted";
        }
      });
      refreshIsTyping(state);
    },

    completePendingTurn(state, { payload }: PayloadAction<ChatEndEvent>) {
      const turn = state.pendingTurns[payload.clientMessageId];
      if (turn) {
        if (turn.conversationId !== payload.conversationId) return;
        if (turn.turnId && turn.turnId !== payload.turnId) return;
        if (turn.attempt !== payload.attempt) return;
      }
      const chat = findChat(state, payload.conversationId);
      if (chat) {
        const existingUser = chat.messages.find(
          (message) =>
            message.role === "user" &&
            message.clientMessageId === payload.clientMessageId,
        );
        if (existingUser) {
          existingUser.turnId = payload.turnId;
          existingUser.deliveryStatus = "accepted";
        }
        const dto = payload.payload.assistantMessage;
        chat.messages = upsertCorrelatedMessage(chat.messages, {
          id: dto.id,
          role: "assistant",
          content: dto.content,
          modelId: dto.modelId,
          tokens: payload.payload.billing.appTokensSpent,
          updatedAt: dto.updatedAt,
          streaming: false,
          retryable: false,
          clientMessageId: payload.clientMessageId,
          turnId: payload.turnId,
          attempt: payload.attempt,
        });
        chat.lastMessageAt = dto.updatedAt;
      }
      delete state.pendingTurns[payload.clientMessageId];
      refreshIsTyping(state);
    },

    failPendingTurn(state, { payload }: PayloadAction<ChatErrorEvent>) {
      const turn = state.pendingTurns[payload.clientMessageId];
      if (!turn || turn.conversationId !== payload.conversationId) return;
      if (turn.turnId && turn.turnId !== payload.turnId) return;
      if (turn.attempt !== payload.attempt) return;
      turn.turnId = payload.turnId;
      turn.status = "failed";
      turn.retryable = payload.payload.error.retryable;
      turn.errorCode = payload.payload.error.code;
      turn.errorMessage = payload.payload.error.message;
      updateTurnMessages(state, payload.clientMessageId, (message) => {
        message.turnId = payload.turnId;
        message.attempt = payload.attempt;
        if (message.role === "user") {
          message.deliveryStatus = "accepted";
        } else {
          message.streaming = false;
          message.error = payload.payload.error.message;
          message.errorCode = payload.payload.error.code;
          message.retryable = payload.payload.error.retryable;
        }
      });
      refreshIsTyping(state);
    },

    markPendingTurnDeliveryUnknown(
      state,
      {
        payload,
      }: PayloadAction<{ clientMessageId: string; message: string }>,
    ) {
      const turn = state.pendingTurns[payload.clientMessageId];
      if (!turn) return;
      turn.status = "delivery_unknown";
      turn.retryable = true;
      turn.errorCode = "DELIVERY_UNKNOWN";
      turn.errorMessage = payload.message;
      updateTurnMessages(state, payload.clientMessageId, (message) => {
        if (message.role === "user") {
          message.deliveryStatus = "failed";
        } else {
          message.streaming = false;
          message.error = payload.message;
          message.errorCode = "DELIVERY_UNKNOWN";
          message.retryable = true;
        }
      });
      refreshIsTyping(state);
    },

    restartPendingTurnDelivery(
      state,
      { payload }: PayloadAction<{ clientMessageId: string }>,
    ) {
      const turn = state.pendingTurns[payload.clientMessageId];
      if (!turn) return;
      turn.status = "awaiting_ack";
      turn.errorCode = undefined;
      turn.errorMessage = undefined;
      turn.retryable = false;
      turn.partialContent = "";
      updateTurnMessages(state, payload.clientMessageId, (message) => {
        message.attempt = turn.attempt;
        if (message.role === "user") {
          message.deliveryStatus = "sending";
        } else {
          message.content = "";
          message.streaming = true;
          message.error = undefined;
          message.errorCode = undefined;
          message.retryable = false;
        }
      });
      refreshIsTyping(state);
    },

    rejectPendingTurn(
      state,
      { payload }: PayloadAction<{ clientMessageId: string }>,
    ) {
      const turn = state.pendingTurns[payload.clientMessageId];
      if (!turn) return;
      const chat = findChat(state, turn.conversationId);
      if (chat) {
        chat.messages = removeCorrelatedTurnMessages(
          chat.messages,
          payload.clientMessageId,
        );
      }
      delete state.pendingTurns[payload.clientMessageId];
      refreshIsTyping(state);
    },

    markPendingTurnsSyncing(state) {
      for (const turn of Object.values(state.pendingTurns)) {
        if (ACTIVE_TURN_STATUSES.has(turn.status)) turn.status = "syncing";
      }
      refreshIsTyping(state);
    },

    deleteDraftChat(state, { payload }: PayloadAction<string>) {
      removeChatById(state, payload);
    },

    renameChat(
      state,
      { payload }: PayloadAction<{ chatId: string; newTitle: string }>,
    ) {
      const chat = state.chatList.find((item) => item.id === payload.chatId);
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
        state.status = "loaded";
        const drafts = state.chatList.filter((chat) => isDraftId(chat.id));
        const existingById = new Map(state.chatList.map((chat) => [chat.id, chat]));
        const serverChats = payload.map((conversation) => {
          const existing = existingById.get(conversation._id);
          if (existing) {
            if (conversation.lastMessageAt) {
              existing.lastMessageAt = conversation.lastMessageAt;
            }
            existing.project = toChatProject(conversation.project);
            existing.pinnedAt = conversation.pinnedAt ?? null;
            return existing;
          }
          return {
            id: conversation._id,
            title: conversation.title,
            messages: [],
            messagesStatus: "idle" as const,
            modelId: conversation.modelId,
            project: toChatProject(conversation.project),
            lastMessageAt: conversation.lastMessageAt,
            pinnedAt: conversation.pinnedAt ?? null,
          };
        });
        state.chatList = [...drafts, ...serverChats];
        if (!state.chatList.some((chat) => chat.id === state.activeChatId)) {
          state.activeChatId = state.chatList[0]?.id ?? null;
        }
      })
      .addCase(fetchConversations.rejected, (state, { payload }) => {
        state.status = "error";
        state.error = payload ?? "Failed to load conversations";
      })
      .addCase(fetchConversationMessages.pending, (state, { meta }) => {
        const chat = findChat(state, meta.arg);
        if (chat) chat.messagesStatus = "loading";
      })
      .addCase(fetchConversationMessages.fulfilled, (state, { payload }) => {
        const chat = findChat(state, payload.id);
        if (!chat) return;
        const serverMessages: Message[] = payload.messages.map((message) => ({
          id: message._id,
          role: message.role,
          content: message.content,
          tokens: message.tokens,
          modelId: message.modelId,
          updatedAt: message.updatedAt ?? message.createdAt,
          clientMessageId: message.clientMessageId ?? undefined,
          turnId: message.turnId ?? undefined,
          attempt: message.attempt ?? undefined,
          streaming: false,
          deliveryStatus:
            message.role === "user" && message.clientMessageId
              ? "accepted"
              : undefined,
        }));
        chat.messages = mergeServerMessages(chat.messages, serverMessages);
        for (const turn of Object.values(state.pendingTurns)) {
          if (turn.conversationId !== payload.id) continue;
          const existingUser = chat.messages.find(
            (message) =>
              message.role === "user" &&
              message.clientMessageId === turn.clientMessageId,
          );
          chat.messages = upsertCorrelatedMessage(chat.messages, {
            id: existingUser?.id ?? `client-user:${turn.clientMessageId}`,
            role: "user",
            content: turn.message,
            clientMessageId: turn.clientMessageId,
            turnId: turn.turnId ?? undefined,
            attempt: turn.attempt,
            deliveryStatus:
              turn.status === "delivery_unknown"
                ? "failed"
                : turn.status === "awaiting_ack"
                  ? "sending"
                  : "accepted",
          });
          const existingAssistant = chat.messages.find(
            (message) =>
              message.role === "assistant" &&
              (message.turnId === turn.turnId ||
                message.clientMessageId === turn.clientMessageId),
          );
          chat.messages = upsertCorrelatedMessage(chat.messages, {
            id:
              existingAssistant?.id ??
              `client-assistant:${turn.clientMessageId}`,
            role: "assistant",
            content: turn.partialContent,
            modelId: turn.modelId,
            clientMessageId: turn.clientMessageId,
            turnId: turn.turnId ?? undefined,
            attempt: turn.attempt,
            streaming: ACTIVE_TURN_STATUSES.has(turn.status),
            error: turn.errorMessage,
            errorCode: turn.errorCode,
            retryable: turn.retryable,
          });
        }
        chat.messagesStatus = "loaded";
        const lastModel = [...chat.messages]
          .reverse()
          .find((message) => message.modelId)?.modelId;
        if (lastModel) chat.modelId = lastModel;
      })
      .addCase(
        fetchConversationMessages.rejected,
        (state, { payload, meta }) => {
          const chat = findChat(state, meta.arg);
          if (chat) chat.messagesStatus = meta.aborted ? "idle" : "error";
          if (meta.aborted) return;
          state.error = payload ?? "Failed to load messages";
        },
      )
      .addCase(removeConversation.fulfilled, (state, { payload }) => {
        removeChatById(state, payload);
      })
      .addCase(removeConversation.rejected, (state, { payload }) => {
        state.error = payload ?? "Failed to delete conversation";
      })
      .addCase(updateConversationPin.pending, (state, { meta }) => {
        state.pinMutations[meta.arg.id] = meta.requestId;
      })
      .addCase(updateConversationPin.fulfilled, (state, { payload, meta }) => {
        if (state.pinMutations[meta.arg.id] !== meta.requestId) return;
        const chat = findChat(state, meta.arg.id);
        if (chat) chat.pinnedAt = payload.pinnedAt ?? null;
        delete state.pinMutations[meta.arg.id];
      })
      .addCase(updateConversationPin.rejected, (state, { meta }) => {
        if (state.pinMutations[meta.arg.id] !== meta.requestId) return;
        delete state.pinMutations[meta.arg.id];
      })
      .addMatcher(
        isAnyOf(logoutUser.fulfilled, refreshError, refreshUser.rejected),
        (state) => {
          const draft = makeDraftChat();
          state.chatList = [draft];
          state.activeChatId = draft.id;
          state.pendingTurns = {};
          state.isTyping = false;
          state.inputSent = false;
          state.hasInput = false;
          state.status = "idle";
          state.error = null;
          state.pinMutations = {};
        },
      ),
});

export const {
  setActiveChatId,
  handleNewChat,
  addConversation,
  promoteDraft,
  registerPendingTurn,
  reconcilePendingTurn,
  appendPendingTurnChunk,
  completePendingTurn,
  failPendingTurn,
  markPendingTurnDeliveryUnknown,
  restartPendingTurnDelivery,
  rejectPendingTurn,
  markPendingTurnsSyncing,
  deleteDraftChat,
  renameChat,
  setHasInput,
  setInputSent,
  setIsTyping,
  bumpTemplateTick,
} = chatSlice.actions;

export const chatReducer = chatSlice.reducer;
