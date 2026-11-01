/** Project order must never depend on the chat's global pinnedAt. */
export function sortProjectChats<T extends { projectPinnedAt?: string | null }>(chats: readonly T[]): T[] {
  const timestamp = (chat: T) => {
    const value = chat.projectPinnedAt ? Date.parse(chat.projectPinnedAt) : NaN;
    return Number.isFinite(value) ? value : 0;
  };
  // Stable sort retains the server's normal order for unpinned chats and ties.
  return [...chats].sort((a, b) => timestamp(b) - timestamp(a));
}
