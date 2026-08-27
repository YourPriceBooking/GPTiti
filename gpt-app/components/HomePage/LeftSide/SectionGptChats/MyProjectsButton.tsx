"use client";

import Image from "next/image";
import type { KeyboardEvent, MouseEvent } from "react";

import styles from "./SectionGptChats.module.css";

type MyProjectsButtonProps = {
  variant: "shortcut" | "expandable";
  projectsCount: number;
  expanded?: boolean;
  canExpand?: boolean;
  onOpen: () => void;
  onCreate?: () => void;
  onToggle?: () => void;
};

export default function MyProjectsButton({
  variant,
  projectsCount,
  expanded = false,
  canExpand = false,
  onOpen,
  onCreate,
  onToggle,
}: MyProjectsButtonProps) {
  const isShortcut = variant === "shortcut";
  const showOpenIcon = !isShortcut && canExpand && expanded;

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("button")) return;
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    onOpen();
  };

  const handleCreate = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onCreate?.();
    event.currentTarget.blur();
  };

  const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onToggle?.();
    event.currentTarget.blur();
  };

  return (
    <article
      className={`${styles.myProjectsButton} ${
        isShortcut ? styles.myProjectsButtonShortcut : ""
      }`}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <Image
        className={isShortcut ? styles.myProjectsShortcutIcon : undefined}
        width={36}
        height={36}
        src={
          showOpenIcon
            ? "/icons/my-projects-open.svg"
            : "/icons/my-projects-closed.svg"
        }
        alt=""
      />

      <div className={styles.projectsLabelWrapper}>
        <div className={styles.labelLeft}>
          <span className={styles.span}>My Projects</span>
          {projectsCount > 0 && (
            <span className={styles.badge}>{projectsCount}</span>
          )}
        </div>

        <button
          type="button"
          className={styles.addProjectBtn}
          aria-label="Start new project"
          onClick={handleCreate}
        >
          <Image
            width={12}
            height={12}
            src="/icons/plus-thin.svg"
            alt=""
          />
        </button>

        {!isShortcut && canExpand && (
          <button
            type="button"
            className={styles.projectsChevron}
            aria-label={expanded ? "Collapse projects" : "Expand projects"}
            aria-expanded={expanded}
            onClick={handleToggle}
          >
            <Image
              className={`${styles.chevronIcon} ${
                expanded ? styles.chevronIconOpen : ""
              }`}
              width={15}
              height={15}
              src="/icons/chevron-down.svg"
              alt=""
            />
          </button>
        )}
      </div>
    </article>
  );
}
