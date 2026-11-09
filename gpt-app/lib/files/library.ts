import { readFiles, type ManagedFile } from "./types";
import { validateServerFiles, type FileLimits } from "./limits";
import type { UploadedFile } from "../../types/api.types";

export const LIBRARY_ENABLED =
  process.env.NEXT_PUBLIC_FILE_LIBRARY_ENABLED === "true";
export type LibraryFile = ManagedFile & {
  createdAt?: string;
  expiresAt: string | null;
};
export type LibraryQuota = {
  bytes: number;
  count: number;
  maxBytes: number;
  maxCount: number;
};
export type LibraryPage = {
  files: LibraryFile[];
  quota: LibraryQuota;
  nextCursor: string | null;
};
export function readLibraryPage(value: unknown): LibraryPage {
  const v = value as Partial<LibraryPage> | null;
  if (!v || !Array.isArray(v.files) || !v.quota)
    throw new Error("Invalid library response.");
  const parsed = readFiles(v.files);
  if (parsed.length !== v.files.length)
    throw new Error("Invalid library file metadata.");
  const q = v.quota;
  if (
    ![q.bytes, q.count, q.maxBytes, q.maxCount].every(
      (n) => Number.isSafeInteger(n) && n >= 0,
    ) ||
    !q.maxBytes ||
    !q.maxCount
  )
    throw new Error("Invalid library quota.");
  if (
    v.nextCursor !== null &&
    (typeof v.nextCursor !== "string" || !/^[a-f\d]{24}$/i.test(v.nextCursor))
  )
    throw new Error("Invalid library cursor.");
  return {
    files: parsed.map((file, i) => {
      const raw = v.files![i];
      return {
        ...file,
        createdAt:
          typeof raw.createdAt === "string" &&
          Number.isFinite(Date.parse(raw.createdAt))
            ? raw.createdAt
            : undefined,
        expiresAt:
          typeof raw.expiresAt === "string" &&
          Number.isFinite(Date.parse(raw.expiresAt))
            ? raw.expiresAt
            : null,
      };
    }),
    quota: { ...q },
    nextCursor: v.nextCursor,
  };
}
export const libraryInput = (f: ManagedFile) => ({
  name: f.originalName,
  size: f.size,
});
export function attachmentReason(
  file: LibraryFile,
  limits: FileLimits | null,
  current: { name: string; size: number }[] = [],
): string | null {
  if (
    file.status !== "ready" ||
    (file.expiresAt && Date.parse(file.expiresAt) <= Date.now())
  )
    return "This file is deleted or expired.";
  return validateServerFiles([...current, libraryInput(file)], limits);
}
export function mergeLibraryFiles(
  current: LibraryFile[],
  incoming: LibraryFile[],
): LibraryFile[] {
  return [
    ...new Map([...current, ...incoming].map((f) => [f.fileId, f])).values(),
  ];
}
export function asUploadedFile(file: LibraryFile): UploadedFile {
  return {
    fileId: file.fileId,
    originalName: file.originalName,
    mimetype: file.mimetype,
    size: file.size,
    expiresAt: file.expiresAt,
    url: "",
  };
}
export function storageUploadError(
  file: { name: string; size: number },
  limits: FileLimits,
): string | null {
  const ext = file.name.split(".").pop()?.toLowerCase();
  const type = Object.values(limits.upload.types).find((t) =>
    t.extensions.includes(ext ?? ""),
  );
  if (!type) return `${file.name}: this format cannot be stored.`;
  if (!file.size || file.size > Math.min(type.maxBytes, limits.upload.maxBytes))
    return `${file.name}: exceeds the storage upload limit or is empty.`;
  return null;
}
export function libraryCategory(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase();
  if (["png", "jpg", "jpeg", "webp", "svg"].includes(ext ?? ""))
    return "Images";
  if (["pdf", "docx"].includes(ext ?? "")) return "Documents";
  if (["csv", "tsv", "xlsx"].includes(ext ?? "")) return "Spreadsheets";
  if (ext === "zip") return "Archives";
  if (ext === "pptx") return "Presentations";
  return "Text & code";
}
