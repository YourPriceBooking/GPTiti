"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "@/context/SocketContext";
import { api } from "@/helpers/api";
import { clearAccessToken } from "@/lib/authTokenVault";
import {
  CHAT_ACK_TIMEOUT_MS,
  CHAT_CONNECTION_LOST,
  CHAT_DELIVERY_UNKNOWN,
  CHAT_RETRY_EVENT,
  CHAT_SEND_EVENT,
  CHAT_STATUS_EVENT,
  ChatServerEvent,
  classifyChatError,
  createClientMessageId,
  makeChatRetryEnvelope,
  makeChatSendEnvelope,
  makeChatStatusEnvelope,
  readChatEndEvent,
  readChatErrorEvent,
  readChatRetryAck,
  readChatSendAck,
  readChatStatusAck,
  readChatStreamEvent,
  type ChatEndEvent,
  type ChatErrorEvent,
  type ChatProtocolError,
  type ChatSendAck,
  type ChatStreamEvent,
  type ChatTurnSnapshot,
} from "@/lib/chat/chatProtocol";
import {
  classifyStreamSequence,
  emitWithAck,
  fingerprintLocalFiles,
  isSamePendingRequest,
  runTransportRetries,
  type AckSocket,
} from "@/lib/chat/chatDelivery";
import { refreshError } from "@/redux/auth/slice";
import { selectPendingTurns } from "@/redux/chat/selectors";
import {
  appendPendingTurnChunk,
  completePendingTurn,
  failPendingTurn,
  markPendingTurnDeliveryUnknown,
  markPendingTurnsSyncing,
  reconcilePendingTurn,
  registerPendingTurn,
  rejectPendingTurn,
  restartPendingTurnDelivery,
} from "@/redux/chat/slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setBalance } from "@/redux/tokens/slice";
import type { PendingChatTurn } from "@/types/types";
import { ensureSocketConnected } from "@/lib/socketClient";

const TURN_ALREADY_RUNNING = "Wait for the current response to finish.";
const INVALID_SERVER_RESPONSE = "Chat server returned an invalid response.";

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
  cancelLastPendingMessage: (chatId: string) => void;
  streamError: string | null;
  clearStreamError: () => void;
};

type AcceptanceWaiter = () => void;
type SequenceState = { attempt: number; lastSeq: number };

const isBlockingTurn = (turn: PendingChatTurn) =>
  turn.status === "awaiting_ack" ||
  turn.status === "queued" ||
  turn.status === "processing" ||
  turn.status === "syncing" ||
  turn.status === "delivery_unknown";

export function useChatStream(): ChatStream {
  const dispatch = useAppDispatch();
  const pendingTurns = useAppSelector(selectPendingTurns);
  const { socket } = useSocket();

  const pendingTurnsRef = useRef(pendingTurns);
  const acceptanceWaitersRef = useRef(
    new Map<string, Set<AcceptanceWaiter>>(),
  );
  const sequenceRef = useRef(new Map<string, SequenceState>());
  const recoveryInFlightRef = useRef(new Set<string>());
  const deliveryPromisesRef = useRef(new Map<string, Promise<boolean>>());
  const statusPromisesRef = useRef(new Map<string, Promise<boolean>>());
  const generationRetryInFlightRef = useRef(new Set<string>());
  const chunkQueueRef = useRef<ChatStreamEvent[]>([]);
  const chunkFrameRef = useRef<number | null>(null);

  const [streamError, setStreamError] = useState<string | null>(null);

  useEffect(() => {
    pendingTurnsRef.current = pendingTurns;
  }, [pendingTurns]);

  const clearStreamError = useCallback(() => setStreamError(null), []);

  const handleLocalError = useCallback(
    (error: unknown) => {
      const outcome = classifyChatError(error);
      if (outcome.reason === "auth-expired") {
        clearAccessToken();
        dispatch(refreshError());
        return;
      }
      setStreamError(outcome.message);
    },
    [dispatch],
  );

  const ensureConnectionReady = useCallback(async () => {
    if (!socket) {
      setStreamError(CHAT_CONNECTION_LOST);
      return false;
    }
    try {
      await ensureSocketConnected(socket);
      setStreamError(null);
      return true;
    } catch (error) {
      handleLocalError(error);
      return false;
    }
  }, [handleLocalError, socket]);

  const signalAccepted = useCallback((clientMessageId: string) => {
    const waiters = acceptanceWaitersRef.current.get(clientMessageId);
    if (!waiters) return;
    for (const waiter of waiters) waiter();
    acceptanceWaitersRef.current.delete(clientMessageId);
  }, []);

  const createAcceptanceWaiter = useCallback((clientMessageId: string) => {
    let resolvePromise: AcceptanceWaiter = () => undefined;
    const promise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });
    const waiters =
      acceptanceWaitersRef.current.get(clientMessageId) ??
      new Set<AcceptanceWaiter>();
    waiters.add(resolvePromise);
    acceptanceWaitersRef.current.set(clientMessageId, waiters);
    return {
      promise,
      cleanup: () => {
        const current = acceptanceWaitersRef.current.get(clientMessageId);
        current?.delete(resolvePromise);
        if (current?.size === 0) {
          acceptanceWaitersRef.current.delete(clientMessageId);
        }
      },
    };
  }, []);

  const rememberSnapshot = useCallback((snapshot: ChatTurnSnapshot) => {
    const existing = pendingTurnsRef.current[snapshot.clientMessageId];
    if (existing) {
      if (snapshot.status === "completed") {
        const next = { ...pendingTurnsRef.current };
        delete next[snapshot.clientMessageId];
        pendingTurnsRef.current = next;
      } else {
        pendingTurnsRef.current = {
          ...pendingTurnsRef.current,
          [snapshot.clientMessageId]: {
            ...existing,
            turnId: snapshot.turnId,
            status: snapshot.status,
            attempt: snapshot.attempt,
            lastAppliedSeq: snapshot.lastSeq,
            partialContent:
              snapshot.assistantMessage?.content ?? snapshot.partialContent,
            retryable: snapshot.error?.retryable ?? false,
            errorCode: snapshot.error?.code,
            errorMessage: snapshot.error?.message,
          },
        };
      }
    }
    sequenceRef.current.set(snapshot.clientMessageId, {
      attempt: snapshot.attempt,
      lastSeq: snapshot.lastSeq,
    });
  }, []);

  const applySnapshot = useCallback(
    (snapshot: ChatTurnSnapshot) => {
      signalAccepted(snapshot.clientMessageId);
      rememberSnapshot(snapshot);
      dispatch(reconcilePendingTurn(snapshot));
      if (snapshot.billing) dispatch(setBalance(snapshot.billing.balance));
    },
    [dispatch, rememberSnapshot, signalAccepted],
  );

  const showProtocolError = useCallback((error: ChatProtocolError) => {
    setStreamError(error.message);
  }, []);

  const flushChunks = useCallback(() => {
    if (chunkFrameRef.current !== null) {
      cancelAnimationFrame(chunkFrameRef.current);
      chunkFrameRef.current = null;
    }
    const queued = chunkQueueRef.current;
    chunkQueueRef.current = [];
    for (const event of queued) dispatch(appendPendingTurnChunk(event));
  }, [dispatch]);

  const queueChunk = useCallback(
    (event: ChatStreamEvent) => {
      chunkQueueRef.current.push(event);
      if (chunkFrameRef.current === null) {
        chunkFrameRef.current = requestAnimationFrame(flushChunks);
      }
    },
    [flushChunks],
  );

  const markStatusUnknown = useCallback(
    (turnId: string, message: string) => {
      const turn = Object.values(pendingTurnsRef.current).find(
        (candidate) => candidate.turnId === turnId,
      );
      if (!turn) return;
      dispatch(
        markPendingTurnDeliveryUnknown({
          clientMessageId: turn.clientMessageId,
          message,
        }),
      );
      pendingTurnsRef.current = {
        ...pendingTurnsRef.current,
        [turn.clientMessageId]: {
          ...turn,
          status: "delivery_unknown",
          retryable: true,
          errorCode: "DELIVERY_UNKNOWN",
          errorMessage: message,
        },
      };
    },
    [dispatch],
  );

  const requestTurnStatus = useCallback(
    (turnId: string): Promise<boolean> => {
      const inFlight = statusPromisesRef.current.get(turnId);
      if (inFlight) return inFlight;
      if (!socket) return Promise.resolve(false);

      const request = (async () => {
        try {
          await ensureSocketConnected(socket);
          const raw = await emitWithAck<unknown>(
            socket as unknown as AckSocket,
            CHAT_STATUS_EVENT,
            makeChatStatusEnvelope(turnId),
            CHAT_ACK_TIMEOUT_MS,
          );
          const ack = readChatStatusAck(raw);
          if (!ack) throw new Error(INVALID_SERVER_RESPONSE);
          if (!ack.ok) {
            showProtocolError(ack.error);
            markStatusUnknown(turnId, ack.error.message);
            return false;
          }
          applySnapshot(ack.turn);
          return true;
        } catch (error) {
          handleLocalError(error);
          markStatusUnknown(turnId, CHAT_DELIVERY_UNKNOWN);
          return false;
        }
      })();
      statusPromisesRef.current.set(turnId, request);
      void request.finally(() => {
        if (statusPromisesRef.current.get(turnId) === request) {
          statusPromisesRef.current.delete(turnId);
        }
      });
      return request;
    },
    [
      applySnapshot,
      handleLocalError,
      markStatusUnknown,
      showProtocolError,
      socket,
    ],
  );

  const emitSendAttempt = useCallback(
    async (turn: PendingChatTurn) => {
      if (!socket) throw new Error(CHAT_CONNECTION_LOST);
      await ensureSocketConnected(socket);
      const waiter = createAcceptanceWaiter(turn.clientMessageId);
      try {
        const result = await Promise.race([
          emitWithAck<unknown>(
            socket as unknown as AckSocket,
            CHAT_SEND_EVENT,
            makeChatSendEnvelope({
              clientMessageId: turn.clientMessageId,
              conversationId: turn.conversationId,
              modelId: turn.modelId,
              message: turn.message,
              ...(turn.files.length > 0 && { files: turn.files }),
            }),
            CHAT_ACK_TIMEOUT_MS,
          ).then((raw) => ({ kind: "ack" as const, raw })),
          waiter.promise.then(() => ({ kind: "event" as const })),
        ]);
        if (result.kind === "event") return null;
        const ack = readChatSendAck(result.raw);
        if (!ack) throw new Error(INVALID_SERVER_RESPONSE);
        return ack;
      } finally {
        waiter.cleanup();
      }
    },
    [createAcceptanceWaiter, socket],
  );

  const deliverPendingTurn = useCallback(
    (turn: PendingChatTurn): Promise<boolean> => {
      const inFlight = deliveryPromisesRef.current.get(turn.clientMessageId);
      if (inFlight) return inFlight;

      const delivery = (async () => {
        try {
          const ack = await runTransportRetries<ChatSendAck | null>({
            attempt: () => emitSendAttempt(turn),
          });
          if (ack === null) {
            setStreamError(null);
            return true;
          }
          if (!ack.ok) {
            dispatch(
              rejectPendingTurn({ clientMessageId: turn.clientMessageId }),
            );
            const next = { ...pendingTurnsRef.current };
            delete next[turn.clientMessageId];
            pendingTurnsRef.current = next;
            showProtocolError(ack.error);
            return false;
          }
          applySnapshot(ack.turn);
          setStreamError(null);
          return true;
        } catch {
          dispatch(
            markPendingTurnDeliveryUnknown({
              clientMessageId: turn.clientMessageId,
              message: CHAT_DELIVERY_UNKNOWN,
            }),
          );
          const current = pendingTurnsRef.current[turn.clientMessageId] ?? turn;
          pendingTurnsRef.current = {
            ...pendingTurnsRef.current,
            [turn.clientMessageId]: {
              ...current,
              status: "delivery_unknown",
              retryable: true,
              errorCode: "DELIVERY_UNKNOWN",
              errorMessage: CHAT_DELIVERY_UNKNOWN,
            },
          };
          setStreamError(CHAT_DELIVERY_UNKNOWN);
          return false;
        }
      })();
      deliveryPromisesRef.current.set(turn.clientMessageId, delivery);
      void delivery.finally(() => {
        if (deliveryPromisesRef.current.get(turn.clientMessageId) === delivery) {
          deliveryPromisesRef.current.delete(turn.clientMessageId);
        }
      });
      return delivery;
    },
    [applySnapshot, dispatch, emitSendAttempt, showProtocolError],
  );

  const recoverPendingTurns = useCallback(async () => {
    const turns = Object.values(pendingTurnsRef.current);
    for (const turn of turns) {
      if (turn.status === "completed" || turn.status === "failed") continue;
      if (recoveryInFlightRef.current.has(turn.clientMessageId)) continue;
      recoveryInFlightRef.current.add(turn.clientMessageId);
      try {
        if (turn.turnId) {
          await requestTurnStatus(turn.turnId);
        } else {
          dispatch(
            restartPendingTurnDelivery({
              clientMessageId: turn.clientMessageId,
            }),
          );
          await deliverPendingTurn(turn);
        }
      } finally {
        recoveryInFlightRef.current.delete(turn.clientMessageId);
      }
    }
  }, [deliverPendingTurn, dispatch, requestTurnStatus]);

  useEffect(() => {
    if (!socket) return;

    const onStream = (raw: unknown) => {
      const event = readChatStreamEvent(raw);
      if (!event) return;
      const turn = pendingTurnsRef.current[event.clientMessageId];
      if (!turn || turn.conversationId !== event.conversationId) return;
      if (turn.turnId && turn.turnId !== event.turnId) return;

      signalAccepted(event.clientMessageId);
      const currentSequence = sequenceRef.current.get(event.clientMessageId) ?? {
        attempt: turn.attempt,
        lastSeq: turn.lastAppliedSeq,
      };
      const sequenceDecision = classifyStreamSequence(currentSequence, {
        attempt: event.attempt,
        seq: event.payload.seq,
      });
      if (sequenceDecision === "stale" || sequenceDecision === "duplicate") {
        return;
      }
      if (sequenceDecision === "gap") {
        void requestTurnStatus(event.turnId);
        return;
      }
      sequenceRef.current.set(event.clientMessageId, {
        attempt: event.attempt,
        lastSeq: event.payload.seq,
      });
      pendingTurnsRef.current = {
        ...pendingTurnsRef.current,
        [event.clientMessageId]: {
          ...turn,
          turnId: event.turnId,
          status: "processing",
          lastAppliedSeq: event.payload.seq,
          partialContent: turn.partialContent + event.payload.chunk,
        },
      };
      queueChunk(event);
    };

    const onEnd = (raw: unknown) => {
      const event: ChatEndEvent | null = readChatEndEvent(raw);
      if (!event) return;
      const turn = pendingTurnsRef.current[event.clientMessageId];
      if (!turn || turn.conversationId !== event.conversationId) return;
      if (turn.turnId && turn.turnId !== event.turnId) return;
      if (turn.attempt !== event.attempt) return;
      signalAccepted(event.clientMessageId);
      flushChunks();
      dispatch(completePendingTurn(event));
      dispatch(setBalance(event.payload.billing.balance));
      const next = { ...pendingTurnsRef.current };
      delete next[event.clientMessageId];
      pendingTurnsRef.current = next;
      sequenceRef.current.delete(event.clientMessageId);
      setStreamError(null);
    };

    const onError = (raw: unknown) => {
      const event: ChatErrorEvent | null = readChatErrorEvent(raw);
      if (!event) return;
      const turn = pendingTurnsRef.current[event.clientMessageId];
      if (!turn || turn.attempt !== event.attempt) return;
      signalAccepted(event.clientMessageId);
      flushChunks();
      dispatch(failPendingTurn(event));
      pendingTurnsRef.current = {
        ...pendingTurnsRef.current,
        [event.clientMessageId]: {
          ...turn,
          turnId: event.turnId,
          status: "failed",
          retryable: event.payload.error.retryable,
          errorCode: event.payload.error.code,
          errorMessage: event.payload.error.message,
        },
      };
    };

    const onDisconnect = () => {
      dispatch(markPendingTurnsSyncing());
      const next = { ...pendingTurnsRef.current };
      for (const [clientMessageId, turn] of Object.entries(next)) {
        if (isBlockingTurn(turn)) {
          next[clientMessageId] = { ...turn, status: "syncing" };
        }
      }
      pendingTurnsRef.current = next;
    };

    const onConnect = () => {
      void recoverPendingTurns();
    };

    socket.on(ChatServerEvent.Stream, onStream);
    socket.on(ChatServerEvent.End, onEnd);
    socket.on(ChatServerEvent.Error, onError);
    socket.on("disconnect", onDisconnect);
    socket.on("connect", onConnect);

    if (socket.connected) void recoverPendingTurns();

    return () => {
      flushChunks();
      socket.off(ChatServerEvent.Stream, onStream);
      socket.off(ChatServerEvent.End, onEnd);
      socket.off(ChatServerEvent.Error, onError);
      socket.off("disconnect", onDisconnect);
      socket.off("connect", onConnect);
    };
  }, [
    dispatch,
    flushChunks,
    queueChunk,
    recoverPendingTurns,
    requestTurnStatus,
    signalAccepted,
    socket,
  ]);

  const sendMessage = useCallback(
    async ({
      conversationId,
      modelId,
      text,
      imageUrls,
      imageFiles,
    }: SendChatMessageArgs) => {
      const localFileFingerprints = fingerprintLocalFiles(imageFiles);
      const existingDelivery = Object.values(pendingTurnsRef.current).find(
        (turn) =>
          turn.status === "delivery_unknown" &&
          isSamePendingRequest(turn, {
            conversationId,
            modelId,
            message: text,
            localFileFingerprints,
          }),
      );
      if (existingDelivery) {
        dispatch(
          restartPendingTurnDelivery({
            clientMessageId: existingDelivery.clientMessageId,
          }),
        );
        pendingTurnsRef.current = {
          ...pendingTurnsRef.current,
          [existingDelivery.clientMessageId]: {
            ...existingDelivery,
            status: "awaiting_ack",
            errorCode: undefined,
            errorMessage: undefined,
            retryable: false,
          },
        };
        return deliverPendingTurn(existingDelivery);
      }

      if (Object.values(pendingTurnsRef.current).some(isBlockingTurn)) {
        setStreamError(TURN_ALREADY_RUNNING);
        return false;
      }

      setStreamError(null);
      try {
        const files = await Promise.all(
          imageFiles.map((file) => api.uploadImage(file).then((response) => response.file)),
        );
        const clientMessageId = createClientMessageId();
        const turn: PendingChatTurn = {
          clientMessageId,
          turnId: null,
          conversationId,
          modelId,
          message: text,
          files,
          localFileFingerprints,
          status: "awaiting_ack",
          attempt: 1,
          lastAppliedSeq: 0,
          partialContent: "",
          retryable: false,
          createdAt: new Date().toISOString(),
        };
        pendingTurnsRef.current = {
          ...pendingTurnsRef.current,
          [clientMessageId]: turn,
        };
        sequenceRef.current.set(clientMessageId, { attempt: 1, lastSeq: 0 });
        dispatch(registerPendingTurn({ turn, images: imageUrls }));
        return await deliverPendingTurn(turn);
      } catch (error) {
        handleLocalError(error);
        return false;
      }
    },
    [deliverPendingTurn, dispatch, handleLocalError],
  );

  const retryLastMessage = useCallback(
    async (chatId: string) => {
      const turn = [...Object.values(pendingTurnsRef.current)]
        .reverse()
        .find(
          (candidate) =>
            candidate.conversationId === chatId &&
            (candidate.status === "failed" ||
              candidate.status === "delivery_unknown"),
        );
      if (!turn) return false;

      if (turn.status === "delivery_unknown" || !turn.turnId) {
        dispatch(
          restartPendingTurnDelivery({ clientMessageId: turn.clientMessageId }),
        );
        return deliverPendingTurn(turn);
      }
      if (!turn.retryable) return false;
      if (generationRetryInFlightRef.current.has(turn.clientMessageId)) {
        return false;
      }
      if (!socket) {
        setStreamError(CHAT_CONNECTION_LOST);
        return false;
      }

      try {
        generationRetryInFlightRef.current.add(turn.clientMessageId);
        await ensureSocketConnected(socket);
        const raw = await emitWithAck<unknown>(
          socket as unknown as AckSocket,
          CHAT_RETRY_EVENT,
          makeChatRetryEnvelope(turn.turnId),
          CHAT_ACK_TIMEOUT_MS,
        );
        const ack = readChatRetryAck(raw);
        if (!ack) throw new Error(INVALID_SERVER_RESPONSE);
        if (!ack.ok) {
          showProtocolError(ack.error);
          return false;
        }
        applySnapshot(ack.turn);
        setStreamError(null);
        return true;
      } catch (error) {
        handleLocalError(error);
        return false;
      } finally {
        generationRetryInFlightRef.current.delete(turn.clientMessageId);
      }
    },
    [
      applySnapshot,
      deliverPendingTurn,
      dispatch,
      handleLocalError,
      showProtocolError,
      socket,
    ],
  );

  const cancelLastPendingMessage = useCallback(
    (chatId: string) => {
      const turn = [...Object.values(pendingTurnsRef.current)]
        .reverse()
        .find(
          (candidate) =>
            candidate.conversationId === chatId &&
            candidate.status === "delivery_unknown",
        );
      if (!turn) return;
      dispatch(rejectPendingTurn({ clientMessageId: turn.clientMessageId }));
      const next = { ...pendingTurnsRef.current };
      delete next[turn.clientMessageId];
      pendingTurnsRef.current = next;
      sequenceRef.current.delete(turn.clientMessageId);
      setStreamError(null);
    },
    [dispatch],
  );

  return {
    ensureConnectionReady,
    sendMessage,
    retryLastMessage,
    cancelLastPendingMessage,
    streamError,
    clearStreamError,
  };
}
