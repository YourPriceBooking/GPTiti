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

test("balance rejection supports old servers without inventing amounts", () => {
  const ack = readChatSendAck({ ok: false, protocolVersion: 2, error: {
    code: "INSUFFICIENT_BALANCE", message: "Insufficient balance", retryable: false,
  } });
  assert.ok(ack && !ack.ok);
  assert.equal(ack.error.details, undefined);
});

test("balance errors retain finite server amounts including negative balances and zero", () => {
  const error = { code: "BALANCE_LIMIT_EXCEEDED", message: "Top up", retryable: false,
    details: { balance: -1200, availableTokens: 0, estimatedTokens: 400 } };
  const ack = readChatSendAck({ ok: false, protocolVersion: 2, error });
  assert.ok(ack && !ack.ok);
  assert.deepEqual(ack.error.details, error.details);
  const event = readChatErrorEvent({ protocolVersion: 2, event: "chat:error", type: "failed",
    turnId, clientMessageId, conversationId, attempt: 1, payload: { error } });
  assert.deepEqual(event?.payload.error.details, error.details);
  const status = readChatStatusAck({ ok: true, protocolVersion: 2,
    turn: { ...snapshot, status: "failed", error } });
  assert.ok(status?.ok);
  assert.deepEqual(status.turn.error?.details, error.details);
});

test("malformed optional amounts cannot poison a valid balance rejection", () => {
  const ack = readChatSendAck({ ok: false, protocolVersion: 2, error: {
    code: "INSUFFICIENT_BALANCE", message: "Top up", retryable: false,
    details: { balance: Infinity, availableTokens: "250", estimatedTokens: -1 },
  } });
  assert.ok(ack && !ack.ok);
  assert.equal(ack.error.details, undefined);
});

test("attachment errors preserve server reasons in rejected ACKs and terminal events", () => {
  for (const code of ["OFFICE_INPUT_DISABLED", "OFFICE_ATTACHMENT_TOO_LARGE", "OFFICE_EXTRACTED_TEXT_TOO_LARGE", "OFFICE_DOCUMENT_LIMIT", "OFFICE_DOCUMENT_UNSUPPORTED", "INVALID_OFFICE_DOCUMENT", "OFFICE_DOCUMENT_EMPTY", "OFFICE_PROCESSING_TIMEOUT", "OFFICE_PROCESSING_BUSY", "TEXT_ATTACHMENT_TOO_LARGE", "TEXT_ATTACHMENTS_CONTEXT_TOO_LARGE", "TEXT_INPUT_DISABLED", "INVALID_UTF8", "INVALID_TEXT", "DOCUMENT_PROCESSING_NOT_ENABLED", "FILE_NOT_FOUND", "FILE_UNAVAILABLE", "INVALID_ATTACHMENTS", "ATTACHMENTS_TOO_LARGE", "FILE_ID_REQUIRED"]) {
    const error = { code, message: "Specific server explanation", retryable: code === "OFFICE_PROCESSING_BUSY" };
    const ack = readChatSendAck({ ok: false, protocolVersion: 2, error });
    assert.ok(ack && !ack.ok);
    if (ack && !ack.ok) assert.deepEqual(ack.error, error);
    const event = readChatErrorEvent({ protocolVersion: 2, event: "chat:error", type: "failed", turnId, clientMessageId, conversationId, attempt: 1, payload: { error } });
    assert.ok(event);
    assert.deepEqual(event.payload.error, error);
  }
});


test("PDF errors preserve server explanations and retry policy across ACK, event and recovery", () => {
  for (const code of ["PDF_INPUT_DISABLED", "PDF_ATTACHMENT_TOO_LARGE", "PDF_PAGE_LIMIT", "PDF_EXTRACTED_TEXT_TOO_LARGE", "PDF_OCR_REQUIRED", "PDF_PASSWORD_PROTECTED", "INVALID_PDF_DOCUMENT", "PDF_PROCESSING_TIMEOUT", "PDF_PROCESSING_BUSY"]) {
    const error = { code, message: "PDF explanation with next steps", retryable: code === "PDF_PROCESSING_BUSY" };
    const ack = readChatSendAck({ ok: false, protocolVersion: 2, error });
    assert.ok(ack && !ack.ok);
    assert.deepEqual(ack.error, error);
    const event = readChatErrorEvent({ protocolVersion: 2, event: "chat:error", type: "failed", turnId, clientMessageId, conversationId, attempt: 1, payload: { error } });
    assert.deepEqual(event?.payload.error, error);
    const status = readChatStatusAck({ ok: true, protocolVersion: 2, turn: { ...snapshot, status: "failed", error } });
    assert.ok(status?.ok);
    assert.deepEqual(status.turn.error, error);
  }
});
