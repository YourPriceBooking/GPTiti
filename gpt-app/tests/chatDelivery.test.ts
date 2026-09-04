import assert from "node:assert/strict";
import { test } from "node:test";

import {
  classifyStreamSequence,
  emitWithAck,
  fingerprintLocalFiles,
  isSamePendingRequest,
  runTransportRetries,
  type AckSocket,
} from "../lib/chat/chatDelivery.js";
import type { PendingChatTurn } from "../types/types.js";

test("emitWithAck resolves the native Socket.IO acknowledgement", async () => {
  const socket: AckSocket = {
    timeout: () => ({
      emit: (_event, _payload, callback) => callback(null, { ok: true }),
    }),
  };
  assert.deepEqual(await emitWithAck(socket, "chat:send", {}, 100), {
    ok: true,
  });
});

test("emitWithAck rejects a Socket.IO timeout", async () => {
  const socket: AckSocket = {
    timeout: () => ({
      emit: (_event, _payload, callback) => callback(new Error("timeout")),
    }),
  };
  await assert.rejects(() => emitWithAck(socket, "chat:send", {}, 100), /timeout/);
});

test("transport retry keeps one logical attempt payload", async () => {
  const payload = { clientMessageId: "stable-id" };
  const seen: unknown[] = [];
  const waits: number[] = [];
  const result = await runTransportRetries({
    delaysMs: [0, 2, 5],
    wait: async (delay) => {
      waits.push(delay);
    },
    attempt: async (attemptNumber) => {
      seen.push(payload);
      if (attemptNumber < 3) throw new Error("timeout");
      return "accepted";
    },
  });
  assert.equal(result, "accepted");
  assert.deepEqual(waits, [2, 5]);
  assert.equal(seen.length, 3);
  assert.ok(seen.every((value) => value === payload));
});

test("transport retry surfaces the last failure", async () => {
  await assert.rejects(
    () =>
      runTransportRetries({
        delaysMs: [0, 0],
        attempt: async (attemptNumber) => {
          throw new Error(`failure-${attemptNumber}`);
        },
      }),
    /failure-2/,
  );
});

test("file fingerprints distinguish attachment changes", () => {
  const first = fingerprintLocalFiles([
    { name: "image.png", size: 10, type: "image/png", lastModified: 5 },
  ]);
  const second = fingerprintLocalFiles([
    { name: "image.png", size: 11, type: "image/png", lastModified: 5 },
  ]);
  assert.notDeepEqual(first, second);
});

test("delivery-unknown resend matches the immutable original request", () => {
  const turn: PendingChatTurn = {
    clientMessageId: "stable-id",
    turnId: null,
    conversationId: "conversation",
    modelId: "model",
    message: "hello",
    files: [],
    localFileFingerprints: ["file"],
    status: "delivery_unknown",
    attempt: 1,
    lastAppliedSeq: 0,
    partialContent: "",
    retryable: true,
    createdAt: "now",
  };
  assert.equal(
    isSamePendingRequest(turn, {
      conversationId: "conversation",
      modelId: "model",
      message: "hello",
      localFileFingerprints: ["file"],
    }),
    true,
  );
  assert.equal(
    isSamePendingRequest(turn, {
      conversationId: "conversation",
      modelId: "model",
      message: "changed",
      localFileFingerprints: ["file"],
    }),
    false,
  );
});

test("stream sequence rejects duplicates and stale attempts and detects gaps", () => {
  const current = { attempt: 2, lastSeq: 4 };
  assert.equal(classifyStreamSequence(current, { attempt: 1, seq: 5 }), "stale");
  assert.equal(
    classifyStreamSequence(current, { attempt: 2, seq: 4 }),
    "duplicate",
  );
  assert.equal(classifyStreamSequence(current, { attempt: 2, seq: 6 }), "gap");
  assert.equal(classifyStreamSequence(current, { attempt: 2, seq: 5 }), "next");
});
