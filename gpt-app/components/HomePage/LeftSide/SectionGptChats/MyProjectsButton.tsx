"use client";

import Image from "next/image";
import ActionTooltip from "@/components/common/ActionTooltip/ActionTooltip";
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
  const expandable = variant === "expandable";
  return (
    <article className={styles.myProjectsButton}>
      <button
        type="button"
        className={styles.projectsMainButton}
        onClick={expandable ? onToggle : onOpen}
        aria-label={expandable ? (expanded ? "Collapse projects" : "Expand projects") : "My Projects"}
        aria-expanded={expandable ? expanded : undefined}
        disabled={expandable && !canExpand}
      >
        <Image width={36} height={36} src={expanded ? "/icons/my-projects-open.svg" : "/icons/my-projects-closed.svg"} alt="" />
        <span className={styles.labelLeft}>
          <span className={styles.span}>My Projects</span>
          {projectsCount > 0 && <span className={styles.badge}>{projectsCount}</span>}
        </span>
        {expandable && canExpand && (
          <Image className={`${styles.chevronIcon} ${expanded ? styles.chevronIconOpen : ""}`} width={12} height={12} src="/icons/chevron-down.svg" alt="" />
        )}
      </button>
      <button type="button" className={`${styles.addProjectBtn} ${styles.projectsHeaderAdd}`} aria-label="Start new project" onClick={onCreate}>
        <Image width={12} height={12} src="/icons/plus-thin.svg" alt="" />
      </button>
      <button type="button" className={styles.projectOpenButton} aria-label="Open projects page" onClick={onOpen}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14 4h6v6M20 4 10 14M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
        </svg>
        <ActionTooltip label="Open projects" />
      </button>
    </article>
  );
}
