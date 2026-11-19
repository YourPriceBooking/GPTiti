import { axiosInstance } from "../axiosInstance";
import { libraryCategory, readLibraryPage, type LibraryFile, type LibraryPage } from "./library";
import { readFileLimits } from "./limits";

export type LibraryQuery = { q: string; category: string; source: string; sort: string };

export type LegacyLibraryCache = { snapshot: LibraryPage | null };

export async function loadLibraryPage(filters: LibraryQuery, cursor: string | null, signal: AbortSignal, legacy: LegacyLibraryCache): Promise<LibraryPage> {
  if (legacy.snapshot && !cursor) return filterLegacyPage(legacy.snapshot, filters);
  const response = await axiosInstance.get("/files", {
    params: { view: "library", limit: 40, ...filters, ...(cursor ? { cursor } : {}) },
    signal, timeout: 15000,
  });
  let page = readLibraryPage(response.data);
  if (response.data.listVersion === 2) return page;
  if (cursor) throw new Error("Library changed. Refresh Files and try again.");

  // Rolling deployment: older servers ignore query parameters and still enforce
  // a file-count cap. Preserve complete search/sort there until the backend updates.
  const seen = new Set<string>();
  const files = new Map(page.files.map(f => [f.fileId, f]));
  while (page.nextCursor) {
    if (seen.has(page.nextCursor) || seen.size >= 101) throw new Error("Could not load the complete library. Please retry.");
    seen.add(page.nextCursor);
    const next = await axiosInstance.get("/files", {
      params: { limit: 100, before: page.nextCursor }, signal, timeout: 15000,
    });
    page = readLibraryPage(next.data);
    page.files.forEach(f => files.set(f.fileId, f));
  }
  signal.throwIfAborted();
  legacy.snapshot = { files: [...files.values()], nextCursor: null, quota: page.quota };
  return filterLegacyPage(legacy.snapshot, filters);
}

function filterLegacyPage(page: LibraryPage, filters: LibraryQuery): LibraryPage {
  const q = filters.q.toLocaleLowerCase();
  const rows = page.files.filter(f =>
    f.originalName.toLocaleLowerCase().includes(q) &&
    (filters.source === "all" || filters.source === f.source) &&
    (filters.category === "all" || libraryCategory(f.originalName) === filters.category)
  ).sort((a,b) => filters.sort === "size" ? b.size - a.size :
    filters.sort === "name" ? a.originalName.localeCompare(b.originalName) :
    filters.sort === "oldest" ? a.fileId.localeCompare(b.fileId) : b.fileId.localeCompare(a.fileId));
  return { files: rows, nextCursor: null, quota: page.quota };
}
export async function getLibraryFile(
  id: string,
  signal: AbortSignal,
): Promise<LibraryFile> {
  if (!/^[a-f\d]{24}$/i.test(id)) throw new Error("Invalid file ID.");
  const res = await axiosInstance.get(`/files/${id}`, {
    signal,
    timeout: 15000,
  });
  return readLibraryPage({
    files: [res.data.file],
    nextCursor: null,
    quota: { bytes: 0, count: 0, maxBytes: 1, maxCount: 1 },
  }).files[0];
}
export async function deleteLibraryFile(id: string) {
  if (!/^[a-f\d]{24}$/i.test(id)) throw new Error("Invalid file ID.");
  await axiosInstance.delete(`/files/${id}`, { timeout: 30000 });
}
export async function loadStorageLimits(signal: AbortSignal) {
  const res = await axiosInstance.get("/files/limits", {
    params: { libraryVersion: 2 }, signal,
    timeout: 15000,
  });
  return readFileLimits(res.data);
}
