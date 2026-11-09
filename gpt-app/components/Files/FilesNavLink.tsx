"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/auth/selectors";
import { captureTokenHistoryDraft } from "@/lib/tokenHistoryDraft";
import { setLibraryTarget } from "@/lib/files/libraryDraft";
import { LIBRARY_ENABLED } from "@/lib/files/library";
import styles from "./Library.module.css";
export default function FilesNavLink({
  compact = false,
}: {
  compact?: boolean;
}) {
  const path = usePathname();
  const owner = useAppSelector(selectUser)?.id;
  if (!LIBRARY_ENABLED) return null;
  return (
    <Link
      className={`${styles.navLink} ${compact ? styles.compact : ""}`}
      href="/files"
      aria-label="Files"
      aria-current={path === "/files" ? "page" : undefined}
      title={compact ? "Files" : undefined}
      onClick={() => {
        captureTokenHistoryDraft();
        setLibraryTarget(owner, path);
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden="true"
      >
        <path d="M3 7V5a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
      </svg>
      {!compact && <span>Files</span>}
    </Link>
  );
}
