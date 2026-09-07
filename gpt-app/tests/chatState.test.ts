import assert from "node:assert/strict";
import { test } from "node:test";

import {
  mergeServerMessages,
  removeCorrelatedTurnMessages,
  upsertCorrelatedMessage,
  type CorrelatedMessage,
} from "../lib/chat/chatState.js";

test("upserts a user message by clientMessageId", () => {
  const local: CorrelatedMessage = {
    id: "client-user",
    role: "user",
    content: "hello",
    clientMessageId: "client-1",
  };
  const result = upsertCorrelatedMessage([local], {
    id: "server-user",
    role: "user",
    content: "hello",
    clientMessageId: "client-1",
    turnId: "turn-1",
  });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, "server-user");
  assert.equal(result[0].turnId, "turn-1");
});

test("upserts an assistant by turnId instead of appending a replay", () => {
  const result = upsertCorrelatedMessage(
    [
      {
        id: "placeholder",
        role: "assistant",
        content: "partial",
        clientMessageId: "client-1",
        turnId: "turn-1",
      } satisfies CorrelatedMessage,
    ],
    {
      id: "server-assistant",
      role: "assistant",
      content: "authoritative full response",
      clientMessageId: "client-1",
      turnId: "turn-1",
    },
  );
  assert.equal(result.length, 1);
  assert.equal(result[0].id, "server-assistant");
  assert.equal(result[0].content, "authoritative full response");
});

test("merges ordered server history with unmatched pending local messages", () => {
  const local: CorrelatedMessage[] = [
    { id: "old", role: "user", content: "old" },
    {
      id: "pending",
      role: "user",
      content: "pending",
      clientMessageId: "client-2",
    },
  ];
  const server: CorrelatedMessage[] = [
    { id: "old", role: "user", content: "old from server" },
    { id: "answer", role: "assistant", content: "answer" },
  ];
  const result = mergeServerMessages(local, server);
  assert.deepEqual(
    result.map((message) => message.id),
    ["old", "answer", "pending"],
  );
  assert.equal(result[0].content, "old from server");
});

test("removes only one rejected logical turn", () => {
  const messages: CorrelatedMessage[] = [
    {
      role: "user",
      content: "one",
      clientMessageId: "client-1",
    },
    {
      role: "assistant",
      content: "",
      clientMessageId: "client-1",
    },
    {
      role: "user",
      content: "two",
      clientMessageId: "client-2",
    },
  ];
  const result = removeCorrelatedTurnMessages(messages, "client-1");
  assert.equal(result.length, 1);
  assert.equal(result[0].clientMessageId, "client-2");
});
