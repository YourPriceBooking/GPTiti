import { axiosInstance } from "../axiosInstance";
import { readLibraryPage, type LibraryFile, type LibraryPage } from "./library";
import { readFileLimits } from "./limits";

export async function loadLibrary(signal: AbortSignal): Promise<LibraryPage> {
  let before: string | null = null;
  const seen = new Set<string>();
  const files = new Map<string, LibraryFile>();
  let page: LibraryPage;
  do {
    const response = await axiosInstance.get("/files", {
      params: { limit: 100, ...(before ? { before } : {}) },
      signal,
      timeout: 15000,
    });
    page = readLibraryPage(response.data);
    page.files.forEach((f) => files.set(f.fileId, f));
    before = page.nextCursor;
    if (before && (seen.has(before) || seen.size >= 101))
      throw new Error("Could not load the complete library. Please retry.");
    if (before) seen.add(before);
  } while (before);
  return { files: [...files.values()], quota: page.quota, nextCursor: null };
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
    signal,
    timeout: 15000,
  });
  return readFileLimits(res.data);
}
