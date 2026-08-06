"use client";

import { useState, useRef, useEffect, type CSSProperties } from "react";
import styles from "./SectionGptChats.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SectionGptChatsProps, Chat, Project } from "@/types/types";
import ChatsMenu from "../ChatsMenu/ChatsMenu";
import DeleteModalWindow from "../DeleteModalWindow/DeleteModalWindow";
import { useAppSelector } from "@/redux/hooks";
import { selectActiveChatId } from "@/redux/chat/selectors";
import { selectActiveProjectId } from "@/redux/ui/selectors";

const PINNED_CHATS_KEY = "pinnedChatIds";
const PINNED_PROJECTS_KEY = "pinnedProjectIds";
const NARROW_VIEWPORT = 640;
const VIEWPORT_EDGE_GAP = 8;
const DELETE_MODAL_SHIFT = 28;
const MENU_GAP = 6;

const MENU_HEIGHT = 240;

type MenuPosition = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

const menuPositionBelow = (trigger: HTMLElement): MenuPosition => {
  const rect = trigger.getBoundingClientRect();
  const isNarrow = window.innerWidth <= NARROW_VIEWPORT;
  const below = rect.bottom + MENU_GAP;
  const fitsBelow = below + MENU_HEIGHT <= window.innerHeight;
  const horizontal = isNarrow
    ? { right: VIEWPORT_EDGE_GAP }
    : { left: rect.left };

  if (fitsBelow) return { top: below, ...horizontal };

  return {
    bottom: window.innerHeight - rect.top + MENU_GAP,
    ...horizontal,
  };
};

export default function SectionGptChats({
  onNewChat,
  onNewProject,
  projectList = [],
  setActiveProject,
  deleteProject,
  renameProject,
  addChatsToProject,
  chatList,
  setActiveChatId,
  deleteChat,
  renameChat,
}: SectionGptChatsProps) {
  const router = useRouter();
  const [showAllProjects, setShowAllProjects] = useState(false);
  const projectsCount = projectList.length;
  const hasProjects = projectsCount > 0;
  const MAX_VISIBLE_PROJECTS = 3;
  const hasMoreProjects = projectsCount > MAX_VISIBLE_PROJECTS;
  const hiddenProjectsCount = projectsCount - MAX_VISIBLE_PROJECTS;
  const isProjectsInteractive = hasMoreProjects;
  const showProjectsOpen = hasMoreProjects && showAllProjects;

  const [pinnedChatIds, setPinnedChatIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem(PINNED_CHATS_KEY) || "[]");
  });
  const [pinnedProjectIds, setPinnedProjectIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem(PINNED_PROJECTS_KEY) || "[]");
  });

  useEffect(() => {
    localStorage.setItem(PINNED_CHATS_KEY, JSON.stringify(pinnedChatIds));
  }, [pinnedChatIds]);

  useEffect(() => {
    localStorage.setItem(PINNED_PROJECTS_KEY, JSON.stringify(pinnedProjectIds));
  }, [pinnedProjectIds]);

  const [openMenuChatId, setOpenMenuChatId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const [openMenuProjectId, setOpenMenuProjectId] = useState<string | null>(
    null,
  );
  const [projectMenuPosition, setProjectMenuPosition] =
    useState<MenuPosition | null>(null);
  const [renamingChatId, setRenamingChatId] = useState<string | null>(null);
  const [renamingProjectId, setRenamingProjectId] = useState<string | null>(
    null,
  );
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(
    null,
  );
  const [showAllChats, setShowAllChats] = useState(false);
  const activeChatId = useAppSelector(selectActiveChatId);
  const activeProjectId = useAppSelector(selectActiveProjectId);

  const MAX_VISIBLE_CHATS = 5;
  const titledChats = chatList.filter((chat) => chat.title !== null);
  const pinnedChats = [...pinnedChatIds]
    .reverse()
    .map((id) => titledChats.find((c) => c.id === id))
    .filter((c): c is Chat => c !== undefined);
  const unpinnedChats = titledChats.filter(
    (c) => !pinnedChatIds.includes(c.id),
  );
  const sortedChats = [...pinnedChats, ...unpinnedChats];
  const pinnedProjects = [...pinnedProjectIds]
    .reverse()
    .map((id) => projectList.find((p) => p.id === id))
    .filter((p): p is Project => p !== undefined);
  const unpinnedProjects = projectList.filter(
    (p) => !pinnedProjectIds.includes(p.id),
  );
  const sortedProjects = [...pinnedProjects, ...unpinnedProjects];
  const chatsCount = sortedChats.length;
  const hasChats = chatsCount > 0;
  const hasMoreChats = chatsCount > MAX_VISIBLE_CHATS;
  const listVisible = hasChats;
  const visibleChats = sortedChats;
  const hiddenChatsCount = chatsCount - MAX_VISIBLE_CHATS;
  const showFolderIcon = hasMoreChats && showAllChats;
  const isHeaderInteractive = hasMoreChats;
  const headerExpanded = showAllChats;
  const handleYourChatsClick = () => {
    if (hasMoreChats) setShowAllChats((prev) => !prev);
  };
  const menuRef = useRef<HTMLDivElement | null>(null);
  const projectMenuRef = useRef<HTMLDivElement | null>(null);
  const titleRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const projectTitleRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  // The dots buttons the open menus were launched from, so the menus can
  // follow them while the chats/projects list scrolls.
  const chatTriggerRef = useRef<HTMLElement | null>(null);
  const projectTriggerRef = useRef<HTMLElement | null>(null);

  const togglePinChat = (id: string) => {
    setPinnedChatIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };
  const togglePinProject = (id: string) => {
    setPinnedProjectIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const deleteModalStyle = (pos: MenuPosition): CSSProperties => ({
    top: pos.top,
    bottom: pos.bottom,
    left: pos.left != null ? pos.left + DELETE_MODAL_SHIFT : undefined,
    right:
      pos.right != null
        ? Math.max(0, pos.right - DELETE_MODAL_SHIFT)
        : undefined,
  });

  const closeMenus = () => {
    setOpenMenuChatId(null);
    setOpenMenuProjectId(null);
    setDeletingChatId(null);
    setDeletingProjectId(null);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // The dots button toggles its own menu on click; closing it here on
      // mousedown would make that click reopen it instead of closing.
      if (target.closest("[data-menu-trigger]")) return;

      const insideAnyMenu =
        menuRef.current?.contains(target) ||
        projectMenuRef.current?.contains(target);

      if (!insideAnyMenu) closeMenus();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const chatMenuOpen = openMenuChatId !== null || deletingChatId !== null;
  const projectMenuOpen =
    openMenuProjectId !== null || deletingProjectId !== null;

  useEffect(() => {
    if (!chatMenuOpen && !projectMenuOpen) return;

    const reanchor = () => {
      if (chatMenuOpen && chatTriggerRef.current) {
        setMenuPosition(menuPositionBelow(chatTriggerRef.current));
      }
      if (projectMenuOpen && projectTriggerRef.current) {
        setProjectMenuPosition(menuPositionBelow(projectTriggerRef.current));
      }
    };

    window.addEventListener("scroll", reanchor, true);
    window.addEventListener("resize", reanchor);
    return () => {
      window.removeEventListener("scroll", reanchor, true);
      window.removeEventListener("resize", reanchor);
    };
  }, [chatMenuOpen, projectMenuOpen]);

  useEffect(() => {
    if (!renamingChatId) return;

    const el = titleRefs.current[renamingChatId];
    if (!el) return;

    el.focus();

    const range = document.createRange();
    const selection = window.getSelection();

    range.selectNodeContents(el);
    range.collapse(false);

    selection?.removeAllRanges();
    selection?.addRange(range);
  }, [renamingChatId]);

  useEffect(() => {
    if (!renamingProjectId) return;

    const el = projectTitleRefs.current[renamingProjectId];
    if (!el) return;

    el.focus();

    const range = document.createRange();
    const selection = window.getSelection();

    range.selectNodeContents(el);
    range.collapse(false);

    selection?.removeAllRanges();
    selection?.addRange(range);
  }, [renamingProjectId]);

  return (
    <section className={styles.gptChats}>
      <article className={styles.gptNewChat} tabIndex={0}>
        <Image
          width={36}
          height={36}
          src="/icons/new-chat.svg"
          alt="new-chat"
        />
        <button className={styles.chatsSpan} onClick={onNewChat}>
          Start New Chat
        </button>
      </article>

      <article
        className={styles.gptNewProject}
        tabIndex={0}
        onClick={onNewProject}
      >
        <Image
          width={36}
          height={36}
          src="/icons/new-project.svg"
          alt="new-project"
        />
        <div className={styles.newProjectLabel}>
          <span className={styles.newProjectTitle}>Start New Project</span>
          <span className={styles.newProjectSubtitle}>
            Group chats by task, client, or idea
          </span>
        </div>
      </article>

      <article
        className={styles.yourChats}
        onClick={isHeaderInteractive ? handleYourChatsClick : undefined}
        role={isHeaderInteractive ? "button" : undefined}
        tabIndex={isHeaderInteractive ? 0 : undefined}
      >
        <Image
          width={36}
          height={36}
          src={
            showFolderIcon ? "/icons/folder-icon.svg" : "/icons/chat-bubble.svg"
          }
          alt="your-chats"
        />
        <div className={styles.labelWrapper}>
          <div className={styles.labelLeft}>
            <button className={styles.span}>My Chats</button>
            {hasChats && <span className={styles.badge}>{chatsCount}</span>}
          </div>
          {isHeaderInteractive && (
            <div className={styles.chatsChevron}>
              <Image
                className={`${styles.chevronIcon} ${headerExpanded ? styles.chevronIconOpen : ""}`}
                width={15}
                height={15}
                src="/icons/chevron-down.svg"
                alt="chevron-down"
              />
            </div>
          )}
        </div>
      </article>

      {listVisible && (
        <div
          className={`${styles.chatsScrollArea} ${
            showAllChats && hasMoreChats ? styles.chatsScrollAreaScroll : ""
          }`}
        >
          <ul className={styles.chatsList}>
            {visibleChats.map((chat) => {
              const chatProject = chat.project;
              const project = chatProject
                ? (projectList.find((p) => p.id === chatProject.id) ??
                  chatProject)
                : undefined;
              return (
                <li
                  key={chat.id}
                  className={`${styles.chatsListItem} ${
                    chat.id === activeChatId && !activeProjectId
                      ? styles.chatsListItemActive
                      : ""
                  }`}
                  tabIndex={0}
                  onClick={() => setActiveChatId(chat.id)}
                >
                  <div className={styles.chatMain}>
                    <span
                      ref={(el) => {
                        if (el) titleRefs.current[chat.id] = el;
                      }}
                      contentEditable={renamingChatId === chat.id}
                      suppressContentEditableWarning
                      className={styles.chatTitle}
                      onBlur={(e) => {
                        const newTitle = e.currentTarget.textContent?.trim();
                        if (newTitle && newTitle !== chat.title) {
                          renameChat(chat.id, newTitle);
                        }
                        setRenamingChatId(null);
                        setOpenMenuChatId(null);
                      }}
                    >
                      {chat.title && chat.title.length > 18
                        ? chat.title.slice(0, 18) + "..."
                        : chat.title}
                    </span>

                    {project && (
                      <button
                        type="button"
                        className={styles.chatProjectRow}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveProject?.(project.id);
                        }}
                      >
                        <svg
                          className={styles.chatProjectIcon}
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M7 17 17 7" />
                          <path d="M8 7h9v9" />
                        </svg>
                        <span className={styles.chatProjectName}>
                          {project.title}
                        </span>
                      </button>
                    )}
                  </div>

                  <div className={styles.chatRight}>
                    {pinnedChatIds.includes(chat.id) && (
                      <span className={styles.pinSmall}>
                        <Image
                          src="/icons/pin.svg"
                          alt="pinned"
                          width={14}
                          height={15}
                        />
                      </span>
                    )}
                    <div className={styles.chatAction}>
                      <span
                        className={styles.dotsIcon}
                        data-menu-trigger
                        onClick={(e) => {
                          e.stopPropagation();
                          const wasOpen = openMenuChatId === chat.id;
                          closeMenus();
                          if (wasOpen) return;

                          const trigger = e.currentTarget as HTMLElement;
                          chatTriggerRef.current = trigger;
                          setMenuPosition(menuPositionBelow(trigger));
                          setOpenMenuChatId(chat.id);
                        }}
                      />
                    </div>
                    {chat.id === activeChatId && !activeProjectId && (
                      <span className={styles.activeIndicator} />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {hasMoreChats && (
        <button
          type="button"
          className={styles.showMoreBtn}
          onClick={() => setShowAllChats((prev) => !prev)}
          aria-label={showAllChats ? "Show fewer chats" : "Show more chats"}
        >
          {!showAllChats && (
            <span className={styles.showMoreDots}>
              {Array.from({ length: hiddenChatsCount }).map((_, i) => (
                <span key={i} className={styles.showMoreDot} />
              ))}
            </span>
          )}
          <Image
            className={`${styles.showMoreChevron} ${
              showAllChats ? styles.showMoreChevronUp : ""
            }`}
            width={15}
            height={15}
            src="/icons/chevron-down.svg"
            alt="toggle chats"
          />
        </button>
      )}

      <article
        className={styles.yourChats}
        role="button"
        tabIndex={0}
        onClick={() => router.push("/projects")}
        onKeyDown={(event) => {
          if ((event.target as HTMLElement).closest("button")) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            router.push("/projects");
          }
        }}
      >
        <Image
          width={36}
          height={36}
          src={
            showProjectsOpen
              ? "/icons/my-projects-open.svg"
              : "/icons/my-projects-closed.svg"
          }
          alt="my-projects"
        />
        <div className={styles.projectsLabelWrapper}>
          <div className={styles.labelLeft}>
            <span className={styles.span}>My Projects</span>
            {hasProjects && (
              <span className={styles.badge}>{projectsCount}</span>
            )}
          </div>
          <button
            type="button"
            className={styles.addProjectBtn}
            aria-label="Start new project"
            onClick={(e) => {
              e.stopPropagation();
              onNewProject?.();
              e.currentTarget.blur();
            }}
          >
            <svg
              width={12}
              height={12}
              viewBox="0 0 10 10"
              fill="none"
              aria-hidden="true"
            >
              <use href="/icons/input-sprite.svg#ib-plus-thin" />
            </svg>
          </button>
          {isProjectsInteractive && (
              <button
                type="button"
                className={styles.projectsChevron}
                aria-label={showAllProjects ? "Collapse projects" : "Expand projects"}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAllProjects((prev) => !prev);
                  e.currentTarget.blur();
                }}
              >
                <Image
                  className={`${styles.chevronIcon} ${showAllProjects ? styles.chevronIconOpen : ""}`}
                  width={15}
                  height={15}
                  src="/icons/chevron-down.svg"
                  alt="chevron-down"
                />
              </button>
          )}
        </div>
      </article>

      {hasProjects && (
        <div
          className={`${styles.projectsScrollArea} ${
            showAllProjects && hasMoreProjects
              ? styles.projectsScrollAreaScroll
              : ""
          }`}
        >
          <ul className={styles.chatsList}>
            {sortedProjects.map((project) => (
              <li
                key={project.id}
                className={`${styles.chatsListItem} ${
                  project.id === activeProjectId
                    ? styles.chatsListItemActive
                    : ""
                }`}
                tabIndex={0}
                onClick={() => setActiveProject?.(project.id)}
              >
                <div className={styles.projectItemContent}>
                  <Image
                    width={28}
                    height={28}
                    src="/icons/project-item.svg"
                    alt="project"
                  />
                  <span
                    ref={(el) => {
                      if (el) projectTitleRefs.current[project.id] = el;
                    }}
                    contentEditable={renamingProjectId === project.id}
                    suppressContentEditableWarning
                    className={styles.chatTitle}
                    onClick={
                      renamingProjectId === project.id
                        ? (e) => e.stopPropagation()
                        : undefined
                    }
                    onBlur={(e) => {
                      const newTitle = e.currentTarget.textContent?.trim();
                      if (newTitle && newTitle !== project.title) {
                        renameProject?.(project.id, newTitle);
                      }
                      setRenamingProjectId(null);
                      setOpenMenuProjectId(null);
                    }}
                  >
                    {renamingProjectId === project.id
                      ? project.title
                      : project.title.length > 12
                        ? project.title.slice(0, 12) + "..."
                        : project.title}
                  </span>
                </div>
                <div className={styles.chatRight}>
                  {pinnedProjectIds.includes(project.id) && (
                    <span className={styles.pinSmall}>
                      <Image
                        src="/icons/pin.svg"
                        alt="pinned"
                        width={14}
                        height={15}
                      />
                    </span>
                  )}
                  <span
                    className={styles.dotsIcon}
                    data-menu-trigger
                    onClick={(e) => {
                      e.stopPropagation();
                      const wasOpen = openMenuProjectId === project.id;
                      closeMenus();
                      if (wasOpen) return;

                      const trigger = e.currentTarget as HTMLElement;
                      projectTriggerRef.current = trigger;
                      setProjectMenuPosition(menuPositionBelow(trigger));
                      setOpenMenuProjectId(project.id);
                    }}
                  />
                  {project.id === activeProjectId && (
                    <span className={styles.activeIndicator} />
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasMoreProjects && (
        <button
          type="button"
          className={styles.showMoreBtn}
          onClick={() => setShowAllProjects((prev) => !prev)}
          aria-label={
            showAllProjects ? "Show fewer projects" : "Show more projects"
          }
        >
          {!showAllProjects && (
            <span className={styles.showMoreDots}>
              {Array.from({ length: hiddenProjectsCount }).map((_, i) => (
                <span key={i} className={styles.showMoreDot} />
              ))}
            </span>
          )}
          <Image
            className={`${styles.showMoreChevron} ${showAllProjects ? styles.showMoreChevronUp : ""}`}
            width={15}
            height={15}
            src="/icons/chevron-down.svg"
            alt="toggle projects"
          />
        </button>
      )}

      {openMenuChatId && menuPosition && (
        <div
          ref={menuRef}
          className={styles.menuContainer}
          style={{
            top: menuPosition.top,
            bottom: menuPosition.bottom,
            left: menuPosition.left,
            right: menuPosition.right,
          }}
        >
          <ChatsMenu
            isPinned={pinnedChatIds.includes(openMenuChatId)}
            onPinToggle={() => {
              togglePinChat(openMenuChatId);
              setOpenMenuChatId(null);
            }}
            showCreateProject={true}
            onCreateProject={() => setOpenMenuChatId(null)}
            onRenameRequest={() => {
              setRenamingChatId(openMenuChatId);
              setOpenMenuChatId(null);
            }}
            onDeleteRequest={() => {
              setDeletingChatId(openMenuChatId);
              setOpenMenuChatId(null);
            }}
          />
        </div>
      )}

      {openMenuProjectId && projectMenuPosition && (
        <div
          ref={projectMenuRef}
          className={styles.menuContainer}
          style={{
            top: projectMenuPosition.top,
            bottom: projectMenuPosition.bottom,
            left: projectMenuPosition.left,
            right: projectMenuPosition.right,
          }}
        >
          <ChatsMenu
            isProject={true}
            isPinned={pinnedProjectIds.includes(openMenuProjectId)}
            onPinToggle={() => {
              togglePinProject(openMenuProjectId);
              setOpenMenuProjectId(null);
            }}
            onAddChats={() => {
              addChatsToProject?.(openMenuProjectId);
              setOpenMenuProjectId(null);
            }}
            onRenameRequest={() => {
              setRenamingProjectId(openMenuProjectId);
              setOpenMenuProjectId(null);
            }}
            onDeleteRequest={() => {
              setDeletingProjectId(openMenuProjectId);
              setOpenMenuProjectId(null);
            }}
          />
        </div>
      )}

      {deletingChatId && menuPosition && (
        <div
          ref={menuRef}
          className={styles.menuContainer}
          style={deleteModalStyle(menuPosition)}
        >
          <DeleteModalWindow
            onCancel={() => setDeletingChatId(null)}
            onConfirm={() => {
              deleteChat(deletingChatId);
              setDeletingChatId(null);
            }}
          />
        </div>
      )}

      {deletingProjectId && projectMenuPosition && (
        <div
          ref={projectMenuRef}
          className={styles.menuContainer}
          style={deleteModalStyle(projectMenuPosition)}
        >
          <DeleteModalWindow
            type="project"
            onCancel={() => setDeletingProjectId(null)}
            onConfirm={() => {
              deleteProject?.(deletingProjectId);
              setDeletingProjectId(null);
            }}
          />
        </div>
      )}
    </section>
  );
}
