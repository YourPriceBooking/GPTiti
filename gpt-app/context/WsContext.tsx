"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import type { Socket } from "socket.io-client";

import { useSocket } from "@/context/SocketContext";
import {
  WsEvent,
  type WsAiAckPayload,
  type WsAiStatusPayload,
  type WsCancelPayload,
  type WsMessage,
  type WsRetryPayload,
  type WsSendPayload,
} from "@/types/ws.types";
import { createRequestId, makeWsMessage, WS_SOCKET_EVENT } from "@/lib/wsProtocol";

type PendingRequest = {
  resolve: (msg: WsMessage) => void;
  reject: (err: Error) => void;
  timeoutId: number;
};

type Handler = (msg: WsMessage) => void;

type WsApi = {
  socket: Socket | null;
  status: "disabled" | "disconnected" | "connecting" | "connected" | "error";
  lastError: string | null;

  emit: <T>(msg: WsMessage<T>) => void;
  onMessage: (handler: Handler) => () => void;
  request: <TOut = WsMessage>(msg: WsMessage, opts?: { timeoutMs?: number }) => Promise<TOut>;

  chat: {
    send: (payload: WsSendPayload, opts?: { requestId?: string }) => Promise<WsMessage<WsAiAckPayload>>;
    cancel: (payload: WsCancelPayload, opts?: { requestId?: string }) => Promise<WsMessage<WsAiAckPayload>>;
    retry: (payload: WsRetryPayload, opts?: { requestId?: string }) => Promise<WsMessage<WsAiAckPayload>>;
  };

  ai: {
    onAck: (handler: (msg: WsMessage<WsAiAckPayload>) => void) => () => void;
    onStatus: (handler: (msg: WsMessage<WsAiStatusPayload>) => void) => () => void;
  };
};

const WsContext = createContext<WsApi | undefined>(undefined);

type ChatAction = "send" | "cancel" | "retry";
type ChatPayloadByAction = {
  send: WsSendPayload;
  cancel: WsCancelPayload;
  retry: WsRetryPayload;
};

export function WsProvider({ children }: { children: React.ReactNode }) {
  const { socket, status, lastError } = useSocket();

  const handlersRef = useRef<Set<Handler>>(new Set());
  const pendingRef = useRef<Map<string, PendingRequest>>(new Map());

  // Clear pending promises on disconnect
  useEffect(() => {
    if (!socket) return;

    const onDisconnect = () => {
      for (const [requestId, pending] of pendingRef.current.entries()) {
        clearTimeout(pending.timeoutId);
        pending.reject(new Error("Socket disconnected"));
        pendingRef.current.delete(requestId);
      }
    };

    socket.on("disconnect", onDisconnect);
    return () => {
      socket.off("disconnect", onDisconnect);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const onWsMessage = (msg: WsMessage) => {
      // resolve request/ack awaiting
      if (msg?.requestId) {
        const pending = pendingRef.current.get(msg.requestId);
        if (pending) {
          clearTimeout(pending.timeoutId);
          pending.resolve(msg);
          pendingRef.current.delete(msg.requestId);
        }
      }

      // fan-out to subscribers
      for (const handler of handlersRef.current.values()) {
        handler(msg);
      }
    };

    socket.on(WS_SOCKET_EVENT, onWsMessage);
    return () => {
      socket.off(WS_SOCKET_EVENT, onWsMessage);
    };
  }, [socket]);

  const emit: WsApi["emit"] = useCallback(
    (msg) => {
      if (!socket || !socket.connected) {
        throw new Error("Socket is not connected");
      }
      socket.emit(WS_SOCKET_EVENT, msg);
    },
    [socket]
  );

  const onMessage: WsApi["onMessage"] = useCallback((handler) => {
    handlersRef.current.add(handler);
    return () => {
      handlersRef.current.delete(handler);
    };
  }, []);

  const request: WsApi["request"] = useCallback(
    <TOut,>(msg: WsMessage, opts?: { timeoutMs?: number }): Promise<TOut> => {
      if (!socket || !socket.connected) {
        return Promise.reject(new Error("Socket is not connected"));
      }

      const requestId = msg.requestId ?? createRequestId("req");
      const timeoutMs = opts?.timeoutMs ?? 10_000;
      const msgWithId = { ...msg, requestId };

      return new Promise<TOut>((resolve, reject) => {
        const timeoutId = window.setTimeout(() => {
          pendingRef.current.delete(requestId);
          reject(new Error(`WS request timeout (${timeoutMs}ms): ${requestId}`));
        }, timeoutMs);

        pendingRef.current.set(requestId, {
          resolve: (incoming) => resolve(incoming as unknown as TOut),
          reject,
          timeoutId,
        });

        socket.emit(WS_SOCKET_EVENT, msgWithId);
      });
    },
    [socket]
  );

  const api = useMemo<WsApi>(() => {
    const sendChat = <TAction extends ChatAction>(type: TAction) =>
      (payload: ChatPayloadByAction[TAction], opts?: { requestId?: string }) => {
        const msg = makeWsMessage(WsEvent.CHAT, type, payload, opts?.requestId);
        return request<WsMessage<WsAiAckPayload>>(msg);
      };

    const onFiltered = <TPayload,>(
      event: WsEvent,
      type: string,
      handler: (msg: WsMessage<TPayload>) => void
    ) => {
      return onMessage((msg) => {
        if (msg.event === event && msg.type === type) {
          handler(msg as WsMessage<TPayload>);
        }
      });
    };

    return {
      socket,
      status,
      lastError,
      emit,
      onMessage,
      request,
      chat: {
        send: sendChat("send"),
        cancel: sendChat("cancel"),
        retry: sendChat("retry"),
      },
      ai: {
        onAck: (handler) => onFiltered(WsEvent.AI, "ack", handler),
        onStatus: (handler) => onFiltered(WsEvent.AI, "status", handler),
      },
    };
  }, [emit, lastError, onMessage, request, socket, status]);

  return <WsContext.Provider value={api}>{children}</WsContext.Provider>;
}

export function useWs() {
  const ctx = useContext(WsContext);
  if (!ctx) throw new Error("useWs must be used within WsProvider");
  return ctx;
}
