import type { Chat } from '../../types/types';

// Promoting a local draft creates a server ID before OCR. Keep its editor mounted
// until admission; a different conversation still gets its own editor.
export function composerIdentity(chat: Pick<Chat, 'id' | 'composerKey'> | null | undefined): string {
  return chat?.composerKey ?? chat?.id ?? 'new';
}

export function isUnsentPromotedDraft(chat: Pick<Chat, 'composerKey' | 'messages'> | null | undefined): boolean {
  return Boolean(chat?.composerKey && chat.messages.length === 0);
}
