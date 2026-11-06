type ChatActivity = {
  pinnedAt?: string | null;
  projectPinnedAt?: string | null;
  lastRequestAt?: string;
  lastMessageAt?: string;
};

const timestamp = (value?: string | null) => {
  const parsed = value ? Date.parse(value) : NaN;
  return Number.isFinite(parsed) ? parsed : 0;
};

export function newestRequestAt(a?: string, b?: string): string | undefined {
  if (timestamp(b) > timestamp(a)) return b;
  return timestamp(a) ? a : undefined;
}

export function sortChatsByActivity<T extends ChatActivity>(
  chats: readonly T[],
  pinField: "pinnedAt" | "projectPinnedAt",
): T[] {
  let latest: T | undefined;
  let latestTime = 0;
  for (const chat of chats) {
    const requestTime = timestamp(chat.lastRequestAt);
    if (requestTime > latestTime) {
      latest = chat;
      latestTime = requestTime;
    }
  }

  return [...chats].sort((a, b) => {
    if (a === b) return 0;
    // Only the latest request can jump ahead of the pinned group.
    if (a === latest) return -1;
    if (b === latest) return 1;
    const aPin = timestamp(a[pinField]);
    const bPin = timestamp(b[pinField]);
    if (Boolean(aPin) !== Boolean(bPin)) return aPin ? -1 : 1;
    if (aPin && bPin) {
      return Math.max(bPin, timestamp(b.lastRequestAt)) - Math.max(aPin, timestamp(a.lastRequestAt));
    }
    return timestamp(b.lastRequestAt ?? b.lastMessageAt) - timestamp(a.lastRequestAt ?? a.lastMessageAt);
  });
}

/** Project order must never depend on the chat's global pinnedAt. */
export function sortProjectChats<T extends Omit<ChatActivity, "pinnedAt">>(chats: readonly T[]): T[] {
  return sortChatsByActivity(chats, "projectPinnedAt");
}
