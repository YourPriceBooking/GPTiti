import test from "node:test";
import assert from "node:assert/strict";
import { sortProjectChats } from "../lib/projects/projectChatOrder";

test("project order ignores global pins and puts newest project pin first", () => {
  const chats = [
    { id: "global", pinnedAt: "2026-11-01", projectPinnedAt: null },
    { id: "old-project", pinnedAt: null, projectPinnedAt: "2026-10-01" },
    { id: "new-project", pinnedAt: null, projectPinnedAt: "2026-11-01" },
  ];
  assert.deepEqual(sortProjectChats(chats).map((chat) => chat.id), ["new-project", "old-project", "global"]);
  assert.equal(chats[0].id, "global");
});

test("missing legacy project pins, invalid values and unpinned chats preserve normal order", () => {
  const chats = [{ id: "first" }, { id: "second", projectPinnedAt: "bad" }, { id: "third", projectPinnedAt: null }];
  assert.deepEqual(sortProjectChats(chats), chats);
});

test("unpin restores normal order and equal project timestamps stay stable", () => {
  const chats = [
    { id: "first", projectPinnedAt: "2026-11-01" },
    { id: "second", projectPinnedAt: "2026-11-01" },
    { id: "third", projectPinnedAt: null },
  ];
  assert.deepEqual(sortProjectChats(chats).map((chat) => chat.id), ["first", "second", "third"]);
  assert.deepEqual(sortProjectChats(chats.map((chat) => ({ ...chat, projectPinnedAt: null }))).map((chat) => chat.id), ["first", "second", "third"]);
});
