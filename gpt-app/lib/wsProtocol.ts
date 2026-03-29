import { WsEvent, type WsMessage } from "@/types/ws.types";

export const WS_SOCKET_EVENT = "ws:message" as const;

export function createRequestId(prefix: string = "req") {
  // predictable enough for client-side correlation; backend can replace with its own ids.
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function makeWsMessage<TPayload>(
  event: WsEvent,
  type: string,
  payload: TPayload,
  requestId?: string
): WsMessage<TPayload> {
  return { event, type, payload, requestId };
}
