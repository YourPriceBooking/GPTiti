"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { Project } from "@/types/types";
import ChatsMenu from "@/components/HomePage/LeftSide/ChatsMenu/ChatsMenu";
import DeleteModalWindow from "@/components/HomePage/LeftSide/DeleteModalWindow/DeleteModalWindow";

import styles from "./ProjectsOverview.module.css";

const PINNED_PROJECTS_KEY = "pinnedProjectIds";
const MENU_GAP = 6;
const MENU_HEIGHT = 240;

const shouldOpenUpwards = (trigger: HTMLElement) =>
  trigger.getBoundingClientRect().bottom + MENU_GAP + MENU_HEIGHT >
  window.innerHeight;

type ProjectsOverviewProps = {
  projects: Project[];
  onCreateProject: () => void;
  onOpenProject: (projectId: string) => void;
  onRenameProject: (projectId: string, title: string) => void;
  onDeleteProject: (projectId: string) => void;
  onAddChats: (projectId: string) => void;
};

const formatDate = (value?: string) => {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const formatActivity = (value?: string) => {
  if (!value) return "Updated recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Updated recently";

  const elapsed = Math.max(0, Date.now() - date.getTime());
  const hours = Math.floor(elapsed / 3_600_000);
  const days = Math.floor(elapsed / 86_400_000);

  if (hours < 1) return "Updated just now";
  if (hours < 24) return `Updated ${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  if (days < 7) return `Updated ${days} ${days === 1 ? "day" : "days"} ago`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `Updated ${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  }
  const months = Math.floor(days / 30);
  return `Updated ${months} ${months === 1 ? "month" : "months"} ago`;
};

function FolderIcon() {
  return (
    <span className={styles.projectIcon} aria-hidden="true">
      <Image
        src="/icons/create-modal-project.svg"
        alt=""
        width={38}
        height={31}
      />
    </span>
  );
}

function ProjectRow({
  project,
  isPinned,
  menuOpen,
  menuUp,
  renaming,
  deleting,
  onOpen,
  onMenuToggle,
  onPinToggle,
  onRenameRequest,
  onRename,
  onDeleteRequest,
  onDeleteCancel,
  onDeleteConfirm,
  onAddChats,
}: {
  project: Project;
  isPinned: boolean;
  menuOpen: boolean;
  menuUp: boolean;
  renaming: boolean;
  deleting: boolean;
  onOpen: () => void;
  onMenuToggle: (trigger: HTMLButtonElement) => void;
  onPinToggle: () => void;
  onRenameRequest: () => void;
  onRename: (title: string) => void;
  onDeleteRequest: () => void;
  onDeleteCancel: () => void;
  onDeleteConfirm: () => void;
  onAddChats: () => void;
}) {
  const [draftTitle, setDraftTitle] = useState(project.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (renaming) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [renaming]);

  const commitRename = () => {
    const nextTitle = draftTitle.trim();
    if (nextTitle && nextTitle !== project.title) onRename(nextTitle);
    else onRename(project.title);
  };

  return (
    <li
      className={`${styles.projectRow} ${menuOpen ? styles.projectRowMenuOpen : ""}`}
      tabIndex={renaming ? -1 : 0}
      onClick={renaming ? undefined : onOpen}
      onKeyDown={(event) => {
        if (!renaming && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onOpen();
        }
      }}
    >
      <FolderIcon />
      <div className={styles.nameCell}>
        {renaming ? (
          <input
            ref={inputRef}
            className={styles.renameInput}
            value={draftTitle}
            maxLength={60}
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => setDraftTitle(event.target.value)}
            onBlur={commitRename}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.currentTarget.blur();
              if (event.key === "Escape") {
                setDraftTitle(project.title);
                event.currentTarget.blur();
              }
            }}
          />
        ) : (
          <span className={styles.projectName}>{project.title}</span>
        )}
        <span className={styles.createdMobile}>
          Created · {formatDate(project.createdAt)}
        </span>
        <span className={styles.activityMobile}>
          {formatActivity(project.lastActivityAt)}
        </span>
      </div>
      <span className={styles.createdDesktop}>
        Created · {formatDate(project.createdAt)}
      </span>
      <span className={styles.activity}>{formatActivity(project.lastActivityAt)}</span>
      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.menuButton} ${menuOpen ? styles.menuButtonOpen : ""}`}
          aria-label={`Actions for ${project.title}`}
          aria-expanded={menuOpen}
          onClick={(event) => {
            event.stopPropagation();
            onMenuToggle(event.currentTarget);
          }}
        >
          <Image src="/icons/three-points.svg" alt="" width={18} height={12} />
        </button>
        {menuOpen && (
          <div
            className={`${styles.menu} ${menuUp ? styles.menuUp : ""}`}
            onClick={(event) => event.stopPropagation()}
          >
            <ChatsMenu
              isProject
              isPinned={isPinned}
              onPinToggle={onPinToggle}
              onAddChats={onAddChats}
              onRenameRequest={onRenameRequest}
              onDeleteRequest={onDeleteRequest}
            />
          </div>
        )}
        {deleting && (
          <div
            className={`${styles.menu} ${styles.deleteMenu} ${menuUp ? styles.menuUp : ""}`}
            onClick={(event) => event.stopPropagation()}
          >
            <DeleteModalWindow
              type="project"
              onCancel={onDeleteCancel}
              onConfirm={onDeleteConfirm}
            />
          </div>
        )}
      </div>
    </li>
  );
}

export default function ProjectsOverview({
  projects,
  onCreateProject,
  onOpenProject,
  onRenameProject,
  onDeleteProject,
  onAddChats,
}: ProjectsOverviewProps) {
  const [pinnedProjectIds, setPinnedProjectIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = JSON.parse(localStorage.getItem(PINNED_PROJECTS_KEY) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuUp, setMenuUp] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(PINNED_PROJECTS_KEY, JSON.stringify(pinnedProjectIds));
  }, [pinnedProjectIds]);

  useEffect(() => {
    if (!openMenuId && !deletingId) return;
    const close = () => {
      setOpenMenuId(null);
      setDeletingId(null);
    };
    window.addEventListener("resize", close);
    document.addEventListener("click", close);
    return () => {
      window.removeEventListener("resize", close);
      document.removeEventListener("click", close);
    };
  }, [openMenuId, deletingId]);

  const validPinnedIds = pinnedProjectIds.filter((id) =>
    projects.some((project) => project.id === id),
  );
  const pinnedProjects = validPinnedIds
    .map((id) => projects.find((project) => project.id === id))
    .filter((project): project is Project => Boolean(project));
  const otherProjects = projects.filter(
    (project) => !validPinnedIds.includes(project.id),
  );

  const togglePin = (projectId: string) => {
    setPinnedProjectIds((current) =>
      current.includes(projectId)
        ? current.filter((id) => id !== projectId)
        : [...current, projectId],
    );
    setOpenMenuId(null);
  };

  const renderRow = (project: Project) => (
    <ProjectRow
      key={project.id}
      project={project}
      isPinned={validPinnedIds.includes(project.id)}
      menuOpen={openMenuId === project.id}
      menuUp={openMenuId === project.id && menuUp}
      renaming={renamingId === project.id}
      deleting={deletingId === project.id}
      onOpen={() => onOpenProject(project.id)}
      onMenuToggle={(trigger) => {
        setMenuUp(shouldOpenUpwards(trigger));
        setOpenMenuId((current) => (current === project.id ? null : project.id));
      }}
      onPinToggle={() => togglePin(project.id)}
      onAddChats={() => {
        setOpenMenuId(null);
        onAddChats(project.id);
      }}
      onRenameRequest={() => {
        setOpenMenuId(null);
        setRenamingId(project.id);
      }}
      onRename={(title) => {
        setRenamingId(null);
        if (title !== project.title) onRenameProject(project.id, title);
      }}
      onDeleteRequest={() => {
        setOpenMenuId(null);
        setDeletingId(project.id);
      }}
      onDeleteCancel={() => setDeletingId(null)}
      onDeleteConfirm={() => {
        onDeleteProject(project.id);
        setPinnedProjectIds((current) =>
          current.filter((id) => id !== project.id),
        );
        setDeletingId(null);
      }}
    />
  );

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Projects</h1>
          <p className={styles.subtitle}>
            Organize chats, links, images, edited images and uploaded files in one place.
          </p>
        </div>
        <button type="button" className={styles.createButton} onClick={onCreateProject}>
          <span className={styles.plus} aria-hidden="true" />
          Create project
        </button>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <Image src="/icons/pin.svg" alt="" width={14} height={15} />
          <h2>Pinned projects</h2>
          <span className={styles.count}>{pinnedProjects.length}</span>
        </div>
        {pinnedProjects.length > 0 ? (
          <ul className={`${styles.list} ${styles.pinnedList}`}>
            {pinnedProjects.map(renderRow)}
          </ul>
        ) : (
          <p className={styles.noPinned}>
            No pinned projects yet. Pin important projects from the three-dot menu.
          </p>
        )}
      </section>

      <section className={`${styles.section} ${styles.allSection}`}>
        {projects.length > 0 ? (
          <>
            <div className={styles.sectionHeading}>
              <span className={styles.headingFolder} aria-hidden="true" />
              <h2>All projects</h2>
              <span className={styles.count}>{projects.length}</span>
            </div>
            <div className={styles.tableHeader} aria-hidden="true">
              <span>Project name</span>
              <span>Created</span>
              <span>Last activity</span>
            </div>
            <ul className={styles.list}>{otherProjects.map(renderRow)}</ul>
            {otherProjects.length === 0 && (
              <p className={styles.noPinned}>All projects are pinned above.</p>
            )}
          </>
        ) : (
          <div className={styles.emptyPanel}>
            <div className={`${styles.sectionHeading} ${styles.emptyPanelHeading}`}>
              <h2>All projects</h2>
              <span className={styles.count}>{projects.length}</span>
            </div>
            <div className={styles.emptyDivider} />
            <div className={styles.emptyState}>
              <h3>No projects yet</h3>
              <Image
                className={styles.emptyIllustration}
                src="/icons/projects-empty-illustration.svg"
                alt=""
                width={319}
                height={290}
                priority
              />
              <p>
                Create your first project to group chats, links, images and uploaded files.
                <br />
                Pinned projects will appear at the top automatically after you pin them.
              </p>
              <button type="button" className={styles.firstProjectButton} onClick={onCreateProject}>
                <span className={styles.plus} aria-hidden="true" />
                Create your first project
              </button>
              <div className={styles.benefits} aria-label="Project benefits">
                <span>Organize related chats</span>
                <span>Keep files together</span>
                <span>Pin important projects</span>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
