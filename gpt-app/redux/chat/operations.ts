import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/helpers/api";
import type { Conversation, ConversationMessage } from "@/types/api.types";

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
    return thunkApi.rejectWithValue(
      errMessage(e, "Failed to load conversations"),
    );
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
    return thunkApi.rejectWithValue(
      errMessage(e, "Failed to create conversation"),
    );
  }
});

/** Load all messages of a single conversation. */
export const fetchConversationMessages = createAsyncThunk<
  { id: string; messages: ConversationMessage[] },
  string,
  { rejectValue: string }
>("chat/fetchConversationMessages", async (id, thunkApi) => {
  try {
    const messages = await api.getConversationMessages(id, thunkApi.signal);
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
    return thunkApi.rejectWithValue(
      errMessage(e, "Failed to delete conversation"),
    );
  }
});

export const renameConversation = createAsyncThunk<
  { id: string; title: string },
  { id: string; title: string },
  { rejectValue: string }
>("chat/renameConversation", async ({ id, title }, thunkApi) => {
  try {
    await api.renameConversation(id, title);
    return { id, title };
  } catch (e) {
    return thunkApi.rejectWithValue(
      errMessage(e, "Failed to rename conversation"),
    );
  }
});
