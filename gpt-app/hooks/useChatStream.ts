"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "@/context/SocketContext";
import { api } from "@/helpers/api";
import { clearAccessToken } from "@/lib/authTokenVault";
import {
  assertNever,
  CHAT_CONNECTION_LOST,
  CHAT_SEND_EVENT,
  ChatServerEvent,
  classifyChatError,
  makeChatSendEnvelope,
  readStreamChunk,
  readTurnCompletion,
  type ChatTurnEnd,
} from "@/lib/chat/chatProtocol";
import { refreshError } from "@/redux/auth/slice";
import {
  appendAssistantChunk,
  appendUserMessage,
  failAssistantMessage,
  finishAssistantMessage,
  retryAssistantMessage,
  setIsTyping,
  startAssistantMessage,
} from "@/redux/chat/slice";
import { useAppDispatch } from "@/redux/hooks";
import { setBalance } from "@/redux/tokens/slice";
import type { UploadedFile } from "@/types/api.types";
import { ensureSocketConnected } from "@/lib/socketClient";

const TURN_ALREADY_RUNNING = "Wait for the current response to finish.";

export type SendChatMessageArgs = {
  conversationId: string;
  modelId: string;
  text: string;
  imageUrls: string[];
  imageFiles: File[];
};

export type ChatStream = {
  ensureConnectionReady: () => Promise<boolean>;
  sendMessage: (args: SendChatMessageArgs) => Promise<boolean>;
  retryLastMessage: (chatId: string) => Promise<boolean>;
  streamError: string | null;
  clearStreamError: () => void;
};

export function useChatStream(): ChatStream {
  const dispatch = useAppDispatch();
  const { socket } = useSocket();

  const streamingConversationIdRef = useRef<string | null>(null);
  const retryInFlightRef = useRef(false);
  const assistantStartedRef = useRef(false);
  const lastAcceptedTurnRef = useRef<{
    conversationId: string;
    modelId: string;
    text: string;
    files: UploadedFile[];
  } | null>(null);
  const chunkBufferRef = useRef("");
  const chunkBufferChatIdRef = useRef<string | null>(null);
  const chunkFrameRef = useRef<number | null>(null);

  const [streamError, setStreamError] = useState<string | null>(null);

  const clearStreamError = useCallback(() => setStreamError(null), []);

  const ensureConnectionReady = useCallback(async () => {
    if (!socket) {
      setStreamError(CHAT_CONNECTION_LOST);
      return false;
    }

    try {
      await ensureSocketConnected(socket);
      setStreamError(null);
      return true;
    } catch {
      setStreamError(CHAT_CONNECTION_LOST);
      return false;
    }
  }, [socket]);

  const flushAssistantChunks = useCallback(() => {
    if (chunkFrameRef.current !== null) {
      cancelAnimationFrame(chunkFrameRef.current);
      chunkFrameRef.current = null;
    }

    const chatId = chunkBufferChatIdRef.current;
    const chunk = chunkBufferRef.current;
    chunkBufferChatIdRef.current = null;
    chunkBufferRef.current = "";

    if (chatId && chunk) {
      dispatch(appendAssistantChunk({ chatId, chunk }));
    }
  }, [dispatch]);

  const queueAssistantChunk = useCallback(
    (chatId: string, chunk: string) => {
      if (
        chunkBufferChatIdRef.current &&
        chunkBufferChatIdRef.current !== chatId
      ) {
        flushAssistantChunks();
      }

      chunkBufferChatIdRef.current = chatId;
      chunkBufferRef.current += chunk;
      if (chunkFrameRef.current === null) {
        chunkFrameRef.current = requestAnimationFrame(flushAssistantChunks);
      }
    },
    [flushAssistantChunks],
  );

  const endTurn = useCallback(
    (outcome: ChatTurnEnd) => {
      flushAssistantChunks();
      const chatId = streamingConversationIdRef.current;
      const assistantStarted = assistantStartedRef.current;
      streamingConversationIdRef.current = null;
      assistantStartedRef.current = false;
      dispatch(setIsTyping(false));

      switch (outcome.reason) {
        case "completed":
          if (chatId && assistantStarted) {
            dispatch(
              finishAssistantMessage({
                chatId,
                tokens: outcome.tokensSpent ?? undefined,
              }),
            );
          }
          if (outcome.balance !== null) dispatch(setBalance(outcome.balance));
          return;
        case "auth-expired":
          clearAccessToken();
          dispatch(refreshError());
          return;
        case "failed":
          if (chatId && assistantStarted) {
            dispatch(failAssistantMessage({ chatId, error: outcome.message }));
          } else {
            setStreamError(outcome.message);
          }
          return;
        case "disconnected":
          if (chatId && assistantStarted) {
            dispatch(
              failAssistantMessage({
                chatId,
                error: CHAT_CONNECTION_LOST,
              }),
            );
          } else {
            setStreamError(CHAT_CONNECTION_LOST);
          }
          return;
        default:
          assertNever(outcome);
      }
    },
    [dispatch, flushAssistantChunks],
  );

  useEffect(() => {
    if (!socket) return;

    const onStream = (raw: unknown) => {
      const chatId = streamingConversationIdRef.current;
      if (!chatId) return;
      const chunk = readStreamChunk(raw);
      if (chunk === null) return;
      queueAssistantChunk(chatId, chunk);
    };

    const onEnd = (raw: unknown) =>
      endTurn({ reason: "completed", ...readTurnCompletion(raw) });

    const onError = (raw: unknown) => endTurn(classifyChatError(raw));

    const onDisconnect = () => {
      if (!streamingConversationIdRef.current) return;
      endTurn({ reason: "disconnected" });
    };

    socket.on(ChatServerEvent.Stream, onStream);
    socket.on(ChatServerEvent.End, onEnd);
    socket.on(ChatServerEvent.Error, onError);
    socket.on("disconnect", onDisconnect);

    return () => {
      flushAssistantChunks();
      socket.off(ChatServerEvent.Stream, onStream);
      socket.off(ChatServerEvent.End, onEnd);
      socket.off(ChatServerEvent.Error, onError);
      socket.off("disconnect", onDisconnect);
    };
  }, [socket, endTurn, flushAssistantChunks, queueAssistantChunk]);

  const sendMessage = useCallback(
    async ({
      conversationId,
      modelId,
      text,
      imageUrls,
      imageFiles,
    }: SendChatMessageArgs) => {
      if (streamingConversationIdRef.current || retryInFlightRef.current) {
        setStreamError(TURN_ALREADY_RUNNING);
        return false;
      }

      setStreamError(null);
      streamingConversationIdRef.current = conversationId;

      try {
        const files = await Promise.all(
          imageFiles.map((file) => api.uploadImage(file).then((r) => r.file)),
        );

        if (!(await ensureConnectionReady()) || !socket) {
          endTurn({ reason: "disconnected" });
          return false;
        }

        dispatch(
          appendUserMessage({
            chatId: conversationId,
            content: text,
            images: imageUrls,
          }),
        );
        dispatch(startAssistantMessage({ chatId: conversationId, modelId }));
        dispatch(setIsTyping(true));
        assistantStartedRef.current = true;
        lastAcceptedTurnRef.current = {
          conversationId,
          modelId,
          text,
          files,
        };

        socket.emit(
          CHAT_SEND_EVENT,
          makeChatSendEnvelope({
            message: text,
            conversationId,
            modelId,
            ...(files.length > 0 && { files }),
          }),
        );
        return true;
      } catch (err) {
        endTurn(classifyChatError(err));
        return false;
      }
    },
    [dispatch, endTurn, ensureConnectionReady, socket],
  );

  const retryLastMessage = useCallback(
    async (chatId: string) => {
      const turn = lastAcceptedTurnRef.current;
      if (
        !turn ||
        turn.conversationId !== chatId ||
        streamingConversationIdRef.current ||
        retryInFlightRef.current
      ) {
        return false;
      }

      if (!socket) {
        setStreamError(CHAT_CONNECTION_LOST);
        return false;
      }

      setStreamError(null);
      retryInFlightRef.current = true;
      dispatch(setIsTyping(true));

      try {
        if (!(await ensureConnectionReady())) {
          dispatch(setIsTyping(false));
          dispatch(
            failAssistantMessage({
              chatId: turn.conversationId,
              error: CHAT_CONNECTION_LOST,
            }),
          );
          return false;
        }

        streamingConversationIdRef.current = turn.conversationId;
        assistantStartedRef.current = true;
        dispatch(
          retryAssistantMessage({
            chatId: turn.conversationId,
            modelId: turn.modelId,
          }),
        );

        socket.emit(
          CHAT_SEND_EVENT,
          makeChatSendEnvelope({
            message: turn.text,
            conversationId: turn.conversationId,
            modelId: turn.modelId,
            ...(turn.files.length > 0 && { files: turn.files }),
          }),
        );
        return true;
      } catch (err) {
        endTurn(classifyChatError(err));
        return false;
      } finally {
        retryInFlightRef.current = false;
      }
    },
    [dispatch, endTurn, ensureConnectionReady, socket],
  );

  return {
    ensureConnectionReady,
    sendMessage,
    retryLastMessage,
    streamError,
    clearStreamError,
  };
}
