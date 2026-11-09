import {
  mergeLibraryFiles,
  readLibraryPage,
  type LibraryFile,
} from "./library";
export type LocalAttachments = {
  images: { id: string; url: string; file: File }[];
  files: { id: string; file: File }[];
};
export type LibraryDraft = {
  text: string;
  files: LibraryFile[];
  local: LocalAttachments;
  lostLocal?: boolean;
};
const empty: LibraryDraft = {
  text: "",
  files: [],
  local: { images: [], files: [] },
};
const drafts = new Map<string, LibraryDraft>();
const listeners = new Set<() => void>();
let owner: string | undefined;
let target = "/";
const PREFIX = "gptiti:library-drafts:v1:";
export const safeDraftPath = (p: string) =>
  p === "/" || /^\/(chats|projects)\/[a-zA-Z0-9_-]+$/.test(p);
export function setLibraryOwner(next: string | undefined) {
  if (owner === next) return;
  drafts.forEach((d) =>
    d.local.images.forEach((f) => URL.revokeObjectURL(f.url)),
  );
  drafts.clear();
  try {
    if (typeof sessionStorage !== "undefined" && owner)
      sessionStorage.removeItem(PREFIX + owner);
  } catch {
    /* Storage can be disabled. */
  }
  owner = next;
  target = "/";
  if (next && typeof sessionStorage !== "undefined") {
    try {
      const raw = JSON.parse(sessionStorage.getItem(PREFIX + next) || "{}");
      if (raw.owner === next && Date.now() - raw.savedAt < 86400000) {
        if (safeDraftPath(raw.target)) target = raw.target;
        for (const [path, item] of Object.entries(raw.drafts ?? {})) {
          const d = item as LibraryDraft;
          if (
            !safeDraftPath(path) ||
            typeof d.text !== "string" ||
            d.text.length > 100000
          )
            continue;
          const files = readLibraryPage({
            files: d.files,
            quota: { bytes: 0, count: 0, maxBytes: 1, maxCount: 1 },
            nextCursor: null,
          }).files;
          if (files.length <= 10)
            drafts.set(path, {
              text: d.text,
              files,
              local: empty.local,
              lostLocal: !!d.lostLocal,
            });
        }
      }
    } catch {
      /* Corrupt/unavailable browser storage must not block the composer. */
    }
  }
  listeners.forEach((fn) => fn());
}
function persist() {
  try {
    if (owner)
      sessionStorage.setItem(
        PREFIX + owner,
        JSON.stringify({
          owner,
          target,
          savedAt: Date.now(),
          drafts: Object.fromEntries(
            [...drafts].map(([path, d]) => [
              path,
              {
                text: d.text,
                files: d.files,
                lostLocal:
                  d.local.files.length + d.local.images.length > 0 ||
                  d.lostLocal,
              },
            ]),
          ),
        }),
      );
  } catch {
    /* In-memory drafts still survive navigation when storage is unavailable. */
  }
}
export function readLibraryDraft(
  user: string | undefined,
  path: string,
): LibraryDraft {
  return user && user === owner ? (drafts.get(path) ?? empty) : empty;
}
export function writeLibraryDraft(
  user: string | undefined,
  path: string,
  patch: Partial<LibraryDraft>,
) {
  if (!user || user !== owner || !safeDraftPath(path)) return;
  drafts.set(path, { ...readLibraryDraft(user, path), ...patch });
  persist();
  listeners.forEach((fn) => fn());
}
export function attachLibraryFiles(
  user: string,
  path: string,
  files: LibraryFile[],
) {
  writeLibraryDraft(user, path, {
    files: mergeLibraryFiles(readLibraryDraft(user, path).files, files),
  });
}
export function clearLibraryDraft(user: string | undefined, path: string) {
  if (user !== owner) return;
  drafts.delete(path);
  persist();
  listeners.forEach((fn) => fn());
}
export function forgetLibraryFile(user: string, id: string) {
  if (user !== owner) return;
  drafts.forEach((d, p) =>
    drafts.set(p, { ...d, files: d.files.filter((f) => f.fileId !== id) }),
  );
  persist();
  listeners.forEach((fn) => fn());
}
export function setLibraryTarget(user: string | undefined, path: string) {
  if (user === owner && safeDraftPath(path)) {
    target = path;
    persist();
  }
}
export function getLibraryTarget(user: string | undefined) {
  return user === owner ? target : "/";
}
export const subscribeLibraryDraft = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};
export const emptyLibraryDraft = () => empty;
