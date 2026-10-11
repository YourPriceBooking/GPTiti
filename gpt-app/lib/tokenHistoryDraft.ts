type Draft = {
  ownerId: string;
  pathname: string;
  text: string;
  selectionStart: number;
  selectionEnd: number;
};

let capture: (() => Draft | null) | null = null;
let saved: Draft | null = null;

// Keep a single text draft in memory only while visiting token history.
// No chat text is written to persistent browser storage.
export function registerTokenHistoryDraft(read: () => Draft | null) {
  capture = read;
  return () => {
    if (capture === read) capture = null;
  };
}

export function captureTokenHistoryDraft() {
  if (capture) saved = capture();
}

export function takeTokenHistoryDraft(ownerId: string, pathname: string) {
  if (!saved) return null;
  if (saved.ownerId !== ownerId) {
    saved = null;
    return null;
  }
  if (saved.pathname !== pathname) return null;
  const draft = saved;
  saved = null;
  return draft;
}

export function clearTokenHistoryDraft() {
  saved = null;
}
