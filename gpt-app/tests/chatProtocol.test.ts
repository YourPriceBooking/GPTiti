import assert from "node:assert/strict";
import { test } from "node:test";

import {
  CHAT_PROTOCOL_VERSION,
  makeChatRetryEnvelope,
  makeChatSendEnvelope,
  makeChatStatusEnvelope,
  readChatEndEvent,
  readChatErrorEvent,
  readChatSendAck,
  readChatStatusAck,
  readChatStreamEvent,
} from "../lib/chat/chatProtocol.js";

const clientMessageId = "6a09b9b6-3daf-4c9f-a272-6b8c6813fd0b";
const turnId = "ab279fa8-b4d7-48a0-9230-43b52cf3073a";
const conversationId = "66d19f77ed08f975db013421";

const snapshot = {
  turnId,
  clientMessageId,
  conversationId,
  status: "processing",
  attempt: 1,
  lastSeq: 2,
  partialContent: "Hello ",
  assistantMessage: null,
  billing: null,
  error: null,
  createdAt: "2026-09-04T12:00:00.000Z",
  updatedAt: "2026-09-04T12:00:01.000Z",
};

test("builds exact protocol v2 client envelopes", () => {
  const send = makeChatSendEnvelope({
    clientMessageId,
    conversationId,
    modelId: "gpt-5.1",
    message: "Hello",
  });
  assert.equal(send.protocolVersion, CHAT_PROTOCOL_VERSION);
  assert.equal(send.event, "chat:send");
  assert.equal(send.type, "request");
  assert.equal(send.payload.clientMessageId, clientMessageId);
  assert.deepEqual(makeChatStatusEnvelope(turnId).payload, { turnId });
  assert.deepEqual(makeChatRetryEnvelope(turnId).payload, { turnId });
});

test("accepts a valid accepted or duplicate send ACK", () => {
  const accepted = readChatSendAck({
    ok: true,
    protocolVersion: 2,
    disposition: "accepted",
    turn: snapshot,
  });
  assert.equal(accepted?.ok, true);
  if (accepted?.ok) assert.equal(accepted.turn.turnId, turnId);

  const duplicate = readChatSendAck({
    ok: true,
    protocolVersion: 2,
    disposition: "duplicate",
    turn: snapshot,
  });
  assert.equal(duplicate?.ok, true);
});

test("rejects legacy, malformed and unknown-code ACKs", () => {
  assert.equal(readChatSendAck({ ok: true, turn: snapshot }), null);
  assert.equal(
    readChatSendAck({
      ok: true,
      protocolVersion: 2,
      disposition: "accepted",
      turn: { ...snapshot, turnId: "not-a-uuid" },
    }),
    null,
  );
  assert.equal(
    readChatSendAck({
      ok: false,
      protocolVersion: 2,
      error: { code: "RAW_PROVIDER_ERROR", message: "secret", retryable: true },
    }),
    null,
  );
});

test("parses strict correlated stream events and keeps whitespace chunks", () => {
  const event = readChatStreamEvent({
    protocolVersion: 2,
    event: "chat:stream",
    type: "delta",
    turnId,
    clientMessageId,
    conversationId,
    attempt: 1,
    payload: { seq: 3, chunk: " " },
  });
  assert.equal(event?.payload.chunk, " ");
  assert.equal(event?.payload.seq, 3);
  assert.equal(
    readChatStreamEvent({ ...event, payload: { seq: 0, chunk: "bad" } }),
    null,
  );
});

test("parses authoritative end and rejects mismatched assistant turn", () => {
  const raw = {
    protocolVersion: 2,
    event: "chat:end",
    type: "completed",
    turnId,
    clientMessageId,
    conversationId,
    attempt: 1,
    payload: {
      assistantMessage: {
        id: "server-message-1",
        role: "assistant",
        content: "Complete response",
        modelId: "gpt-5.1",
        tokens: 12,
        turnId,
        createdAt: "2026-09-04T12:00:02.000Z",
        updatedAt: "2026-09-04T12:00:02.000Z",
      },
      billing: { appTokensSpent: 20, totalTokens: 40, balance: 9980 },
    },
  };
  assert.equal(readChatEndEvent(raw)?.payload.assistantMessage.content, "Complete response");
  assert.equal(
    readChatEndEvent({
      ...raw,
      payload: {
        ...raw.payload,
        assistantMessage: {
          ...raw.payload.assistantMessage,
          turnId: "ca329fa8-b4d7-48a0-9230-43b52cf3073a",
        },
      },
    }),
    null,
  );
});

test("parses safe terminal errors and status snapshots", () => {
  const error = readChatErrorEvent({
    protocolVersion: 2,
    event: "chat:error",
    type: "failed",
    turnId,
    clientMessageId,
    conversationId,
    attempt: 1,
    payload: {
      error: {
        code: "PROVIDER_UNAVAILABLE",
        message: "Please retry.",
        retryable: true,
      },
    },
  });
  assert.equal(error?.payload.error.retryable, true);

  const status = readChatStatusAck({
    ok: true,
    protocolVersion: 2,
    turn: snapshot,
  });
  assert.equal(status?.ok, true);
});
