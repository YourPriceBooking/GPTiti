"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { selectIsLoggedIn, selectUser } from "@/redux/auth/selectors";
import { captureTokenHistoryDraft } from "@/lib/tokenHistoryDraft";
import { setLibraryTarget } from "@/lib/files/libraryDraft";
import { LIBRARY_ENABLED } from "@/lib/files/library";
import AccountAvatar from "./SectionGptUser/AccountAvatar";
import styles from "./NavigationRail.module.css";

export default function NavigationRail({
  expanded,
  onToggle,
  onNavigate,
}: {
  expanded: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}) {
  const path = usePathname();
  const owner = useAppSelector(selectUser)?.id;
  const signedIn = useAppSelector(selectIsLoggedIn);
  const navigate = () => {
    captureTokenHistoryDraft();
    onNavigate?.();
  };
  return (
    <nav className={styles.rail} aria-label="Main navigation">
      <div className={styles.links}>
        <Link
          href="/"
          className={styles.item}
          aria-label="Home"
          aria-current={path === "/" ? "page" : undefined}
          onClick={navigate}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z" />
          </svg>
          <span className={styles.tooltip}>Home</span>
        </Link>
        {LIBRARY_ENABLED && (
          <Link
            href="/files"
            className={styles.item}
            aria-label="Files"
            aria-current={path === "/files" ? "page" : undefined}
            onClick={() => {
              if (path !== "/files") setLibraryTarget(owner, path);
              navigate();
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 7V5a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
            </svg>
            <span className={styles.tooltip}>Files</span>
          </Link>
        )}
        <button
          type="button"
          className={`${styles.item} ${styles.toggle}`}
          aria-label={expanded ? "Hide sidebar" : "Show sidebar"}
          aria-expanded={expanded}
          onClick={onToggle}
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
            <rect x="3" y="4" width="18" height="16" rx="3" />
            <path d="M9 4v16" />
          </svg>
          <span className={styles.tooltip}>
            {expanded ? "Hide sidebar" : "Show sidebar"}
          </span>
        </button>
      </div>
      {signedIn && (
        <div className={styles.account}>
          <AccountAvatar />
        </div>
      )}
    </nav>
  );
}
