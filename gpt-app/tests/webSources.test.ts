import assert from "node:assert/strict";
import { test } from "node:test";
import {
  readWebSources,
  readWebStatus,
  groupWebSources,
  withoutWebFooter,
} from "../lib/web/sources.js";
import {
  readChatEndEvent,
  readChatTurnSnapshot,
} from "../lib/chat/chatProtocol.js";
import { mergeServerMessages } from "../lib/chat/chatState.js";
const raw = {
  id: "web-1",
  status: "ready",
  requestedUrl: "https://example.com/",
  url: "https://example.com/article",
  title: "Article",
  truncated: true,
  text: "private text",
};
const sources = readWebSources([raw]);
test("web metadata admits safe links and excludes page text and malformed sources", () => {
  assert.equal(sources.length, 1);
  assert.equal("text" in sources[0], false);
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,x",
    "https://user:password@example.com/",
    "//example.com",
  ])
    assert.deepEqual(readWebSources([{ ...raw, url }]), []);
  assert.deepEqual(readWebSources(null), []);
});
test("only exact server footer is replaced; body references and legacy messages survive", () => {
  const body = "See [web-1](https://example.com/article).";
  const footer =
    "\n\n---\n[web-1](<https://example.com/article>) — partial page text";
  assert.equal(withoutWebFooter(body + footer, sources), body);
  assert.equal(withoutWebFooter(body + footer, []), body + footer);
  assert.equal(
    withoutWebFooter(body + footer + "\nUser text", sources),
    body + footer + "\nUser text",
  );
});
test("repeated observations group by exact URL while retaining partial disclosure", () => {
  const result = groupWebSources(
    readWebSources([
      raw,
      { ...raw, id: "web-2", truncated: false },
      { ...raw, id: "web-3", url: "https://example.com/other" },
    ]),
  );
  assert.equal(result.length, 2);
  assert.equal(result[0].visits, 2);
  assert.equal(result[0].partial, true);
});
test("progress validates stages and bounds", () => {
  assert.deepEqual(
    readWebStatus({ stage: "navigating", completed: 2, total: 5 }),
    { stage: "navigating", completed: 2, total: 5 },
  );
  assert.equal(readWebStatus({ stage: "done", completed: 5, total: 5 }), null);
  assert.equal(
    readWebStatus({ stage: "reading", completed: 6, total: 5 }),
    null,
  );
});
test("sources survive end, recovery and history merge", () => {
  const turnId = "ab279fa8-b4d7-48a0-9230-43b52cf3073a",
    clientMessageId = "6a09b9b6-3daf-4c9f-a272-6b8c6813fd0b";
  const assistant = {
    id: "message",
    role: "assistant",
    content: "Summary",
    modelId: "model",
    tokens: 42,
    turnId,
    createdAt: "today",
    updatedAt: "today",
    webSources: [raw],
  };
  const billing = { appTokensSpent: 42, totalTokens: 100, balance: 958 };
  const event = readChatEndEvent({
    protocolVersion: 2,
    event: "chat:end",
    type: "completed",
    turnId,
    clientMessageId,
    conversationId: "chat",
    attempt: 1,
    payload: { assistantMessage: assistant, billing },
  });
  assert.deepEqual(event?.payload.assistantMessage.webSources, sources);
  const snapshot = readChatTurnSnapshot({
    turnId,
    clientMessageId,
    conversationId: "chat",
    status: "processing",
    attempt: 1,
    lastSeq: 0,
    partialContent: "",
    assistantMessage: assistant,
    billing,
    error: null,
    createdAt: "today",
    updatedAt: "today",
    webStatus: { stage: "reading", completed: 1, total: 5 },
  });
  assert.deepEqual(snapshot?.assistantMessage?.webSources, sources);
  assert.equal(snapshot?.webStatus?.stage, "reading");
  const message = {
    id: "message",
    role: "assistant" as const,
    content: "Summary",
    turnId,
    webSources: sources,
  };
  assert.deepEqual(
    mergeServerMessages([{ ...message, webSources: [] }], [message])[0]
      .webSources,
    sources,
  );
});
