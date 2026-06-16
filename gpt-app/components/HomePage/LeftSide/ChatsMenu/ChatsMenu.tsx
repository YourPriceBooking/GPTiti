import styles from "./ChatsMenu.module.css";
import Image from "next/image";

type ItemMenuProps = {
  isPinned: boolean;
  onPinToggle: () => void;
  isProject?: boolean;
  showCreateProject?: boolean;
  onCreateProject?: () => void;
  onAddChats?: () => void;
  onRenameRequest: () => void;
  onDeleteRequest: () => void;
};

function PinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      {/* Head (disc) */}
      <circle cx="10.5" cy="4.5" r="3" stroke="#E5E7EB" strokeWidth="1.4" />
      {/* Cone body */}
      <path d="M8.3 6.7L5.5 9.5" stroke="#E5E7EB" strokeWidth="2.2" strokeLinecap="round" />
      {/* Pin shaft */}
      <path d="M5.5 9.5L2.5 12.5" stroke="#E5E7EB" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function UnpinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="10.5" cy="4.5" r="3" stroke="#E5E7EB" strokeWidth="1.4" />
      <path d="M8.3 6.7L5.5 9.5" stroke="#E5E7EB" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M5.5 9.5L2.5 12.5" stroke="#E5E7EB" strokeWidth="1.3" strokeLinecap="round" />
      {/* Slash */}
      <path d="M1.5 13.5L13.5 1.5" stroke="#E5E7EB" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function CreateProjectIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="1.5" y="1.5" width="12" height="12" rx="2.5" stroke="#E5E7EB" strokeWidth="1.4" />
      <path d="M7.5 4.5V10.5M4.5 7.5H10.5" stroke="#E5E7EB" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function AddChatsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      {/* Chat bubble */}
      <path
        d="M1.5 2.5H8C8.8 2.5 9.5 3.2 9.5 4V7.5C9.5 8.3 8.8 9 8 9H4.5L2.5 11V9H1.5C0.7 9 0 8.3 0 7.5V4C0 3.2 0.7 2.5 1.5 2.5Z"
        stroke="#E5E7EB"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      {/* External plus */}
      <path d="M12.5 5.5V10.5M10 8H15" stroke="#E5E7EB" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function ChatsMenu({
  isPinned,
  onPinToggle,
  isProject = false,
  showCreateProject = false,
  onCreateProject,
  onAddChats,
  onRenameRequest,
  onDeleteRequest,
}: ItemMenuProps) {
  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={onPinToggle}>
        <span className={styles.iconWrap}>
          {isPinned ? <UnpinIcon /> : <PinIcon />}
        </span>
        <div className={styles.itemContent}>
          <span className={styles.label}>
            {isPinned ? "Unpin" : "Pin to top"}
          </span>
          <span className={styles.subtitle}>
            {isPinned
              ? isProject
                ? "Return this project to the normal order"
                : "Return this chat to the normal order"
              : isProject
              ? "Keep this project first in Projects"
              : "Keep this chat above the list"}
          </span>
        </div>
      </button>

      <div className={styles.separator} />

      {isProject ? (
        <>
          <button className={styles.button} onClick={onAddChats}>
            <span className={styles.iconWrap}>
              <AddChatsIcon />
            </span>
            <div className={styles.itemContent}>
              <span className={styles.label}>Add chats</span>
              <span className={styles.subtitle}>
                Attach existing chats to this project
              </span>
            </div>
          </button>
          <div className={styles.separator} />
        </>
      ) : showCreateProject ? (
        <>
          <button className={styles.button} onClick={onCreateProject}>
            <span className={styles.iconWrap}>
              <CreateProjectIcon />
            </span>
            <div className={styles.itemContent}>
              <span className={styles.label}>Create project</span>
              <span className={styles.subtitle}>
                Turn this chat into a new project
              </span>
            </div>
          </button>
          <div className={styles.separator} />
        </>
      ) : null}

      <button className={styles.button} onClick={onRenameRequest}>
        <span className={styles.iconWrap}>
          <Image src="/icons/pencil.svg" alt="Rename" width={14} height={15} />
        </span>
        <span className={styles.label}>
          {isProject ? "Rename project" : "Rename chat"}
        </span>
      </button>

      <button className={styles.button} onClick={onDeleteRequest}>
        <span className={styles.iconWrap}>
          <Image src="/icons/trash.svg" alt="Delete" width={14} height={15} />
        </span>
        <span className={`${styles.label} ${styles.labelDelete}`}>
          {isProject ? "Delete project" : "Delete chat"}
        </span>
      </button>
    </div>
  );
}
