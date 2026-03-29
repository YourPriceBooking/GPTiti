export enum WsEvent {
  CHAT = "chat",
  TESTFRONT= 'test-ws-front',
  TESTBACK= 'test-ws-back',
  AI = "ai",
  SYSTEM = "system",
  AUTH = "auth",
}

// This is intentionally flexible: backend can grow new types without breaking.
export type WsType = string;

export interface WsMessage<TPayload = unknown> {
  event: WsEvent;
  type: WsType;
  requestId?: string;
  payload: TPayload;
}

export type WsSendPayload = {
  chatId: string;
  message: string;
  model: string;
  temperature?: number;
};

export type WsCancelPayload = {
  chatId: string;
};

export type WsRetryPayload = {
  chatId: string;
};

export type WsAiAckPayload = {
  status: "accepted" | "rejected";
  reason?: string;
};

export type WsAiStatusPayload = {
  state: "thinking" | "streaming" | "done" | "cancelled" | "error";
  detail?: string;
};
