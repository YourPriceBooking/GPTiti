import { useEffect, useState } from "react";
import styles from "./ChatsMenu.module.css";
import Image from "next/image";
import MenuItem from "../MenuItem/MenuItem";

const CLOSE_DELAY_MS = 1500;

type ItemMenuProps = {
  onClose?: () => void;
  isPinned?: boolean;
  onPinToggle?: () => void;
  showPinToggle?: boolean;
  isProject?: boolean;
  showCreateProject?: boolean;
  onCreateProject?: () => void;
  onAddChats?: () => void;
  onRenameRequest: () => void;
  onDeleteRequest: () => void;
  projectTitle?: string;
  onMoveToProject?: () => void;
  onArchive?: () => void;
  onRemoveFromProject?: () => void;
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
  projectTitle,
  onMoveToProject,
  onArchive,
  onRemoveFromProject,
  onClose,
}: ItemMenuProps) {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (hovered || !onClose || !matchMedia("(hover: hover)").matches) return;
    const timer = setTimeout(onClose, CLOSE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [hovered, onClose]);

  const entity = isProject ? "project" : "chat";
  const inProject = !isProject && Boolean(projectTitle);

  const moveItem = onMoveToProject && (
    <MenuItem
      icon="/icons/move-to-project.svg"
      iconWidth={16}
      iconHeight={14}
      label="Move to project"
      onClick={onMoveToProject}
    />
  );

  return (
    <div
      className={styles.container}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {showPinToggle && (
        <>
          <MenuItem
            icon={isPinned ? "/icons/unpin.svg" : "/icons/pin.svg"}
            iconWidth={16}
            iconHeight={17}
            label={isPinned ? "Unpin" : "Pin to top"}
            subtitle={
              isPinned
                ? `Return this ${entity} to the normal order`
                : isProject
                  ? "Keep this project first in Projects"
                  : "Keep this chat above the list"
            }
            onClick={onPinToggle}
          />
          <div className={styles.separator} />
        </>
      )}

      {isProject ? (
        <>
          <MenuItem
            icon="/icons/add-chats.svg"
            iconWidth={20}
            iconHeight={13}
            label="Add chats"
            subtitle="Attach existing chats to this project"
            onClick={onAddChats}
          />
          <div className={styles.separator} />
        </>
      ) : showCreateProject ? (
        <>
          <MenuItem
            icon="/icons/create-project.svg"
            iconWidth={16}
            iconHeight={16}
            label="Create project"
            subtitle="Turn this chat into a new project"
            onClick={onCreateProject}
          />
          <div className={styles.separator} />
        </>
      ) : null}

      <MenuItem
        icon="/icons/pencil.svg"
        iconWidth={14}
        iconHeight={15}
        label={`Rename ${entity}`}
        onClick={onRenameRequest}
      />

      {!inProject && moveItem}

      {onArchive && (
        <MenuItem
          icon="/icons/archive.svg"
          iconWidth={16}
          iconHeight={15}
          label="Archive chat"
          onClick={onArchive}
        />
      )}

      <MenuItem
        icon="/icons/trash.svg"
        iconWidth={14}
        iconHeight={15}
        label={`Delete ${entity}`}
        danger
        onClick={onDeleteRequest}
      />

      {inProject && (
        <>
          <div className={styles.separator} />
          <div className={styles.projectLabel}>
            <Image
              src="/icons/project-folder.svg"
              alt=""
              width={14}
              height={12}
            />
            <span className={styles.projectLabelText}>
              Project: {projectTitle}
            </span>
          </div>
          {moveItem}
          {onRemoveFromProject && (
            <MenuItem
              icon="/icons/remove-from-project.svg"
              iconWidth={16}
              iconHeight={15}
              label="Remove from project"
              onClick={onRemoveFromProject}
            />
          )}
        </>
      )}
    </div>
  );
}
