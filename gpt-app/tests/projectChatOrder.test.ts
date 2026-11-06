import test from "node:test";
import assert from "node:assert/strict";
import { newestRequestAt, sortChatsByActivity, sortProjectChats } from "../lib/projects/projectChatOrder";

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

test("latest unpinned request rises above pins without unpinning or promoting older requests", () => {
  const chats = [
    { id: "pinned", pinnedAt: "2026-11-04", projectPinnedAt: "2026-11-04" },
    { id: "old", lastRequestAt: "2026-11-05" },
    { id: "new", lastRequestAt: "2026-11-06" },
  ];
  for (const field of ["pinnedAt", "projectPinnedAt"] as const) {
    assert.deepEqual(sortChatsByActivity(chats, field).map((c) => c.id), ["new", "pinned", "old"]);
  }
  assert.equal(chats[0].pinnedAt, "2026-11-04");
});

test("latest pinned request leads its scope; global and project pins remain independent", () => {
  const chats = [
    { id: "new-pin", pinnedAt: "2026-11-05", projectPinnedAt: "2026-11-05" },
    { id: "global-pin", pinnedAt: "2026-11-01", lastRequestAt: "2026-11-06" },
    { id: "project-pin", projectPinnedAt: "2026-11-01", lastRequestAt: "2026-11-04" },
  ];
  assert.deepEqual(sortChatsByActivity(chats, "pinnedAt").map((c) => c.id), ["global-pin", "new-pin", "project-pin"]);
  assert.deepEqual(sortProjectChats(chats.slice(2).concat(chats[0])).map((c) => c.id), ["project-pin", "new-pin"]);
  assert.deepEqual(sortProjectChats(chats).map((c) => c.id), ["global-pin", "new-pin", "project-pin"]);
});

test("an older fetch or replay cannot replace a newer accepted request timestamp", () => {
  assert.equal(newestRequestAt("2026-11-06", "2026-11-05"), "2026-11-06");
  assert.equal(newestRequestAt("2026-11-05", "2026-11-06"), "2026-11-06");
  assert.equal(newestRequestAt(undefined, "bad"), undefined);
});
