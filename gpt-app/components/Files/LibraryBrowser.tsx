"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFileLimits } from "@/hooks/useFileLimits";
import { api } from "@/helpers/api";
import { downloadFile } from "@/lib/files/api";
import { preparationErrorMessage } from "@/lib/files/preparation";
import {
  loadLibrary,
  deleteLibraryFile,
  getLibraryFile,
  loadStorageLimits,
} from "@/lib/files/libraryApi";
import {
  attachmentReason,
  libraryCategory,
  libraryInput,
  storageUploadError,
  type LibraryFile,
  type LibraryPage,
} from "@/lib/files/library";
import { forgetLibraryFile } from "@/lib/files/libraryDraft";
import { fileSize, extension } from "@/lib/files/types";
import { PreviewPanel } from "./FileWorkspace";
import AppModal from "@/components/HomePage/common/AppModal/AppModal";
import styles from "./Library.module.css";

export default function LibraryBrowser({
  owner,
  modelId,
  picker = false,
  current = [],
  currentIds = [],
  onAdd,
  addLabel = "Add to current chat",
}: {
  owner: string;
  modelId: string;
  picker?: boolean;
  current?: { name: string; size: number }[];
  currentIds?: string[];
  onAdd: (files: LibraryFile[]) => void;
  addLabel?: string;
}) {
  const [data, setData] = useState<LibraryPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [source, setSource] = useState("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [selected, setSelected] = useState<string[]>([]);
  const [preview, setPreview] = useState<LibraryFile | null>(null);
  const [deleting, setDeleting] = useState<LibraryFile[]>([]);
  const [busy, setBusy] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const lifetime = useRef<AbortController | null>(null);
  const operation = useRef(false);
  const limits = useFileLimits(modelId, owner);
  useEffect(() => {
    const controller = new AbortController();
    lifetime.current = controller;
    return () => controller.abort();
  }, [owner]);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    loadLibrary(controller.signal)
      .then((value) => {
        if (!controller.signal.aborted) {
          setData(value);
          setSelected((ids) =>
            ids.filter((id) => value.files.some((f) => f.fileId === id)),
          );
        }
      })
      .catch((e) => {
        if (!controller.signal.aborted) setError(preparationErrorMessage(e));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [owner, refresh]);
  useEffect(() => {
    const reload = () => {
      if (!operation.current) setRefresh((n) => n + 1);
    };
    window.addEventListener("focus", reload);
    return () => window.removeEventListener("focus", reload);
  }, []);
  const files = useMemo(() => data?.files ?? [], [data]);
  const chosen = files.filter((f) => selected.includes(f.fileId));
  const toAttach = chosen.filter((f) => !currentIds.includes(f.fileId));
  const rows = useMemo(
    () =>
      files
        .filter(
          (f) =>
            f.originalName
              .toLocaleLowerCase()
              .includes(query.toLocaleLowerCase()) &&
            (source === "all" || f.source === source) &&
            (category === "all" ||
              libraryCategory(f.originalName) === category),
        )
        .sort((a, b) =>
          sort === "name"
            ? a.originalName.localeCompare(b.originalName)
            : sort === "size"
              ? b.size - a.size
              : sort === "oldest"
                ? a.fileId.localeCompare(b.fileId)
                : b.fileId.localeCompare(a.fileId),
        ),
    [files, query, source, category, sort],
  );
  const reason = (file: LibraryFile) =>
    attachmentReason(file, limits.limits, current);
  const add = async () => {
    if (operation.current || !toAttach.length) return;
    operation.current = true;
    setBusy(true);
    setError("");
    try {
      const signal = lifetime.current!.signal;
      const fresh: LibraryFile[] = [];
      for (const file of toAttach) {
        const latest = await getLibraryFile(file.fileId, signal);
        const invalid = attachmentReason(latest, limits.limits, [
          ...current,
          ...fresh.map(libraryInput),
        ]);
        if (invalid) throw new Error(invalid);
        fresh.push(latest);
      }
      signal.throwIfAborted();
      onAdd(fresh);
      setSelected([]);
    } catch (e) {
      if (!lifetime.current?.signal.aborted)
        setError(preparationErrorMessage(e));
    } finally {
      operation.current = false;
      if (!lifetime.current?.signal.aborted) setBusy(false);
    }
  };
  const upload = async (incoming: File[]) => {
    if (operation.current || !incoming.length) return;
    operation.current = true;
    setBusy(true);
    setError("");
    setNotice("");
    let completed = 0;
    try {
      const signal = lifetime.current!.signal;
      const storage = await loadStorageLimits(signal);
      for (const file of incoming) {
        const invalid = storageUploadError(file, storage);
        if (invalid) throw new Error(invalid);
      }
      for (const file of incoming) {
        setNotice(`Uploading ${file.name}…`);
        await api.uploadFile(file, signal);
        completed++;
      }
      if (!signal.aborted)
        setNotice(`${completed} file${completed === 1 ? "" : "s"} uploaded.`);
    } catch (e) {
      if (!lifetime.current?.signal.aborted) {
        setError(preparationErrorMessage(e));
        setNotice(
          `${completed} uploaded. Refresh Files before retrying an interrupted upload to avoid duplicates.`,
        );
      }
    } finally {
      operation.current = false;
      if (!lifetime.current?.signal.aborted) {
        setBusy(false);
        setRefresh((n) => n + 1);
      }
    }
  };
  const remove = async () => {
    if (operation.current) return;
    operation.current = true;
    setBusy(true);
    setError("");
    try {
      for (const file of deleting) {
        lifetime.current!.signal.throwIfAborted();
        await deleteLibraryFile(file.fileId);
        forgetLibraryFile(owner, file.fileId);
        if (preview?.fileId === file.fileId) setPreview(null);
      }
      setNotice("Files deleted. Message history is kept.");
      setSelected([]);
    } catch (e) {
      if (!lifetime.current?.signal.aborted)
        setError(preparationErrorMessage(e));
    } finally {
      operation.current = false;
      if (!lifetime.current?.signal.aborted) {
        setBusy(false);
        setDeleting([]);
        setRefresh((n) => n + 1);
      }
    }
  };
  return (
    <div className={`${styles.workspace} ${picker ? styles.picker : ""}`}>
      <section
        className={styles.library}
        aria-label={picker ? "Choose saved files" : "Files"}
        onDragOver={(e) => {
          if (!picker && e.dataTransfer.types.includes("Files"))
            e.preventDefault();
        }}
        onDrop={(e) => {
          if (picker) return;
          e.preventDefault();
          void upload(Array.from(e.dataTransfer.files));
        }}
      >
        <header className={styles.header}>
          <div>
            <h1>{picker ? "Add from library" : "Files"}</h1>
            <p>
              {picker
                ? "Choose files for this message."
                : "Your uploads and files created in chat."}
            </p>
          </div>
          {!picker && (
            <button
              className={styles.primary}
              disabled={busy}
              onClick={() => input.current?.click()}
            >
              + Upload files
            </button>
          )}
        </header>
        <input
          ref={input}
          type="file"
          multiple
          hidden
          onChange={(e) => {
            const next = Array.from(e.target.files ?? []);
            e.target.value = "";
            void upload(next);
          }}
        />
        {data && !picker && (
          <div className={styles.quota}>
            <span>
              {data.quota.count} / {data.quota.maxCount} files
            </span>
            <span>
              {(data.quota.bytes / 1e6).toLocaleString("en-US", {
                maximumFractionDigits: 1,
              })}{" "}
              MB of{" "}
              {(data.quota.maxBytes / 1e9).toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })}{" "}
              GB used
            </span>
            <progress
              value={Math.min(data.quota.bytes, data.quota.maxBytes)}
              max={data.quota.maxBytes}
              aria-label="Storage used"
            />
          </div>
        )}
        <div className={styles.search}>
          <svg
            viewBox="0 0 24 24"
            width="19"
            height="19"
            fill="none"
            stroke="currentColor"
            aria-hidden="true"
          >
            <circle cx="10" cy="10" r="6" />
            <path d="m15 15 6 6" />
          </svg>
          <input
            aria-label="Search files"
            placeholder="Search files…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className={styles.filters}>
          <select
            aria-label="File type"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All types</option>
            {[
              "Documents",
              "Spreadsheets",
              "Images",
              "Text & code",
              "Archives",
              "Presentations",
            ].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <select
            aria-label="File source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          >
            <option value="all">All sources</option>
            <option value="upload">Uploaded</option>
            <option value="generated">Generated</option>
          </select>
          <select
            aria-label="Sort files"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="name">Name</option>
            <option value="size">Largest first</option>
          </select>
          <button
            disabled={loading || busy}
            onClick={() => {
              setError("");
              setRefresh((n) => n + 1);
            }}
            aria-label="Refresh files"
          >
            ↻
          </button>
        </div>
        {error && (
          <div className={styles.error} role="alert">
            {error}
            <button
              onClick={() => {
                setError("");
                setRefresh((n) => n + 1);
              }}
              disabled={busy}
            >
              Retry
            </button>
          </div>
        )}
        {notice && (
          <p className={styles.notice} role="status">
            {notice}
          </p>
        )}
        {limits.status === "error" && (
          <p className={styles.notice}>
            Could not confirm attachment limits.{" "}
            <button onClick={limits.retry}>Retry limits</button>
          </p>
        )}
        {loading ? (
          <div className={styles.empty} role="status">
            Loading your files…
          </div>
        ) : !rows.length ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>▤</span>
            <h2>
              {files.length
                ? "No matching files"
                : "Your files, ready when you need them"}
            </h2>
            <p>
              {files.length
                ? "Try another name or filter."
                : "Upload a file here or save one through chat. Only files you choose are attached."}
            </p>
          </div>
        ) : (
          <div className={styles.list}>
            <div className={styles.columns}>
              <span>Name</span>
              <span>Source</span>
              <span>Size</span>
              <span>Actions</span>
            </div>
            {rows.map((file) => {
              const attached = currentIds.includes(file.fileId);
              const blocked = picker ? reason(file) : null;
              const checked = selected.includes(file.fileId);
              return (
                <div
                  className={`${styles.row} ${checked ? styles.selected : ""}`}
                  key={file.fileId}
                >
                  <div className={styles.identity}>
                    <input
                      type="checkbox"
                      aria-label={`Select ${file.originalName}`}
                      checked={checked}
                      disabled={busy || (picker && attached) || !!blocked}
                      onChange={() => {
                        setError("");
                        setSelected((ids) =>
                          checked
                            ? ids.filter((id) => id !== file.fileId)
                            : [...ids, file.fileId],
                        );
                      }}
                    />
                    <span className={styles.fileIcon}>
                      {extension(file.originalName).slice(0, 4).toUpperCase()}
                    </span>
                    <div>
                      <button
                        className={styles.fileName}
                        onClick={() => setPreview(file)}
                      >
                        {file.originalName}
                      </button>
                      <small>
                        {attached
                          ? "Already attached"
                          : blocked ||
                            (file.status !== "ready"
                              ? "File unavailable"
                              : file.expiresAt
                                ? "Temporary upload · attach before expiry"
                                : file.createdAt
                                  ? new Date(
                                      file.createdAt,
                                    ).toLocaleDateString()
                                  : libraryCategory(file.originalName))}
                      </small>
                    </div>
                  </div>
                  <span className={styles.source}>
                    {file.source === "generated" ? "Generated" : "Uploaded"}
                  </span>
                  <span className={styles.size}>{fileSize(file.size)}</span>
                  <div className={styles.actions}>
                    <button
                      aria-label={`Download ${file.originalName}`}
                      disabled={busy || file.status !== "ready"}
                      onClick={() =>
                        void downloadFile(file).catch((e) =>
                          setError(preparationErrorMessage(e)),
                        )
                      }
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        aria-hidden="true"
                      >
                        <path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" />
                      </svg>
                    </button>
                    {!picker && (
                      <button
                        aria-label={`Delete ${file.originalName}`}
                        disabled={busy}
                        onClick={() => setDeleting([file])}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          aria-hidden="true"
                        >
                          <path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <footer className={styles.selection}>
          <span aria-live="polite">{selected.length} selected</span>
          <div>
            {!picker && selected.length > 0 && (
              <button disabled={busy} onClick={() => setDeleting(chosen)}>
                Delete
              </button>
            )}
            <button
              className={styles.primary}
              disabled={
                busy || loading || !!error || !toAttach.length || !limits.limits
              }
              onClick={() => void add()}
            >
              {busy
                ? "Please wait…"
                : picker
                  ? `Add ${chosen.length || ""} file${chosen.length === 1 ? "" : "s"}`
                  : addLabel}
            </button>
          </div>
          {picker && <small>Your message will not be sent.</small>}
        </footer>
      </section>
      {preview && (
        <PreviewPanel file={preview} close={() => setPreview(null)} />
      )}
      <AppModal
        open={deleting.length > 0}
        onClose={() => {
          if (!busy) setDeleting([]);
        }}
        title={`Delete ${deleting.length === 1 ? "file" : "files"}?`}
        paperClassName={styles.confirm}
      >
        <p>{deleting.map((f) => f.originalName).join(", ")}</p>
        <p>
          These files will become unavailable in every chat where they were
          used. Messages and responses will stay. This cannot be undone.
        </p>
        <div className={styles.confirmActions}>
          <button disabled={busy} onClick={() => setDeleting([])}>
            Cancel
          </button>
          <button
            className={styles.danger}
            disabled={busy}
            onClick={() => void remove()}
          >
            {busy ? "Deleting…" : "Delete permanently"}
          </button>
        </div>
      </AppModal>
    </div>
  );
}
