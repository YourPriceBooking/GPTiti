import styles from "./ChatsMenu.module.css";
import Image from "next/image";

type ItemMenuProps = {
  isPinned?: boolean;
  onPinToggle?: () => void;
  showPinToggle?: boolean;
  isProject?: boolean;
  showCreateProject?: boolean;
  onCreateProject?: () => void;
  onAddChats?: () => void;
  onRenameRequest: () => void;
  onDeleteRequest: () => void;
};

export default function ChatsMenu({
  isPinned,
  onPinToggle,
  showPinToggle = true,
  isProject = false,
  showCreateProject = false,
  onCreateProject,
  onAddChats,
  onRenameRequest,
  onDeleteRequest,
}: ItemMenuProps) {
  return (
    <div className={styles.container}>
      {showPinToggle && (
        <>
          <button className={styles.button} onClick={onPinToggle}>
            <span className={styles.iconWrap}>
              <Image
                src={isPinned ? "/icons/unpin.svg" : "/icons/pin.svg"}
                alt={isPinned ? "Unpin" : "Pin"}
                width={16}
                height={17}
              />
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
        </>
      )}

      {isProject ? (
        <>
          <button
            className={styles.button}
            onClick={onAddChats}
          >
            <span className={styles.iconWrap}>
              <Image
                src="/icons/add-chats.svg"
                alt="Add chats"
                width={20}
                height={13}
              />
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
              <Image
                src="/icons/create-project.svg"
                alt="Create project"
                width={16}
                height={16}
              />
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
