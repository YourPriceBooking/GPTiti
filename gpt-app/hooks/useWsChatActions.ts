"use client";

import { useCallback } from "react";

import { useWs } from "@/context/WsContext";
import type { WsCancelPayload, WsRetryPayload, WsSendPayload } from "@/types/ws.types";

export function useWsChatActions() {
  const { status, lastError, chat } = useWs();

  const sendMessage = useCallback(
    (payload: WsSendPayload, opts?: { requestId?: string }) => chat.send(payload, opts),
    [chat]
  );

  const cancelMessage = useCallback(
    (payload: WsCancelPayload, opts?: { requestId?: string }) => chat.cancel(payload, opts),
    [chat]
  );

  const retryMessage = useCallback(
    (payload: WsRetryPayload, opts?: { requestId?: string }) => chat.retry(payload, opts),
    [chat]
  );

  return {
    status,
    lastError,
    sendMessage,
    cancelMessage,
    retryMessage,
  };
}
