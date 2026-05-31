import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/helpers/api";
import type {
  Conversation,
  ConversationMessage,
  ChatHistoryResponse,
} from "@/types/api.types";

const errMessage = (e: unknown, fallback: string) => {
  const err = e as { response?: { data?: { message?: string } } };
  return err.response?.data?.message ?? fallback;
};

/** Load the user's conversation list for the sidebar. */
export const fetchConversations = createAsyncThunk<
  Conversation[],
  void,
  { rejectValue: string }
>("chat/fetchConversations", async (_, thunkApi) => {
  try {
    return await api.getConversations();
  } catch (e) {
    return thunkApi.rejectWithValue(errMessage(e, "Failed to load conversations"));
  }
});

/** Create a new conversation on the server (lazily, on first send). */
export const createConversation = createAsyncThunk<
  Conversation,
  { modelId: string; title?: string },
  { rejectValue: string }
>("chat/createConversation", async ({ modelId, title }, thunkApi) => {
  try {
    return await api.createConversation(modelId, title);
  } catch (e) {
    return thunkApi.rejectWithValue(errMessage(e, "Failed to create conversation"));
  }
});

/** Load all messages of a single conversation. */
export const fetchConversationMessages = createAsyncThunk<
  { id: string; messages: ConversationMessage[] },
  string,
  { rejectValue: string }
>("chat/fetchConversationMessages", async (id, thunkApi) => {
  try {
    const messages = await api.getConversationMessages(id);
    return { id, messages };
  } catch (e) {
    return thunkApi.rejectWithValue(errMessage(e, "Failed to load messages"));
  }
});

/** Delete a conversation on the server, then remove it locally. */
export const removeConversation = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("chat/removeConversation", async (id, thunkApi) => {
  try {
    await api.deleteConversation(id);
    return id;
  } catch (e) {
    return thunkApi.rejectWithValue(errMessage(e, "Failed to delete conversation"));
  }
});

/** Last 20 messages across all conversations (chatPreview.md). Available for a recent feed. */
export const fetchChatHistory = createAsyncThunk<
  ChatHistoryResponse,
  void,
  { rejectValue: string }
>("chat/fetchChatHistory", async (_, thunkApi) => {
  try {
    return await api.getChatHistory();
  } catch (e) {
    return thunkApi.rejectWithValue(errMessage(e, "Failed to load chat history"));
  }
});
