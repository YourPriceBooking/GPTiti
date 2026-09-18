"use client";

import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  type CSSProperties,
} from "react";
import styles from "./SectionGptChats.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SectionGptChatsProps } from "@/types/types";
import ChatsMenu from "../ChatsMenu/ChatsMenu";
import DeleteModalWindow from "../DeleteModalWindow/DeleteModalWindow";
import ChatActionModal, {
  type ChatAction,
  type PendingChatAction,
} from "../ConfirmModalWindow/ChatActionModal";
import ProjectPickerModal from "../ProjectPickerModal/ProjectPickerModal";
import { useChatProjectMove } from "@/hooks/useChatProjectMove";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectActiveChatId } from "@/redux/chat/selectors";
import { updateConversationPin } from "@/redux/chat/operations";
import { updateProjectPin } from "@/redux/projects/operations";
import { selectActiveProjectId } from "@/redux/ui/selectors";
import MyProjectsButton from "./MyProjectsButton";

const NARROW_VIEWPORT = 640;
const VIEWPORT_EDGE_GAP = 8;
const DELETE_MODAL_SHIFT = 28;
const MENU_GAP = 6;

const MENU_HEIGHT = 300;

type MenuPosition = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

const menuPositionBelow = (
  trigger: HTMLElement,
  height = MENU_HEIGHT,
): MenuPosition => {
  const rect = trigger.getBoundingClientRect();
  const isNarrow = window.innerWidth <= NARROW_VIEWPORT;
  const below = rect.bottom + MENU_GAP;
  const above = rect.top - MENU_GAP - height;
  const maxTop = window.innerHeight - VIEWPORT_EDGE_GAP - height;
  const horizontal = isNarrow
    ? { right: VIEWPORT_EDGE_GAP }
    : { left: rect.left };

  if (below <= maxTop) return { top: below, ...horizontal };
  if (above >= VIEWPORT_EDGE_GAP) return { top: above, ...horizontal };

  return { top: Math.max(VIEWPORT_EDGE_GAP, maxTop), ...horizontal };
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
  const dispatch = useAppDispatch();
  const [showAllProjects, setShowAllProjects] = useState(false);
  const projectsCount = projectList.length;
  const hasProjects = projectsCount > 0;
  const MAX_VISIBLE_PROJECTS = 3;
  const hasMoreProjects = projectsCount > MAX_VISIBLE_PROJECTS;
  const hiddenProjectsCount = projectsCount - MAX_VISIBLE_PROJECTS;
  const isProjectsInteractive = hasMoreProjects;

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
  const [chatAction, setChatAction] = useState<PendingChatAction | null>(
    null,
  );
  const [movingChatId, setMovingChatId] = useState<string | null>(null);
  const [showAllChats, setShowAllChats] = useState(false);
  const { moveToProject, removeFromProject } = useChatProjectMove();
  const activeChatId = useAppSelector(selectActiveChatId);
  const activeProjectId = useAppSelector(selectActiveProjectId);

  const MAX_VISIBLE_CHATS = 5;
  const titledChats = chatList.filter((chat) => chat.title !== null);
  const pinnedChats = titledChats.filter((chat) => chat.pinnedAt);
  const unpinnedChats = titledChats.filter((chat) => !chat.pinnedAt);
  const sortedChats = [...pinnedChats, ...unpinnedChats];
  const pinnedProjects = projectList.filter((project) => project.pinnedAt);
  const unpinnedProjects = projectList.filter((project) => !project.pinnedAt);
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
  const handleOpenProjects = () => router.push("/projects");
  const handleCreateProject = () => onNewProject?.();
  const handleToggleProjects = () => {
    setShowAllProjects((prev) => !prev);
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
    const chat = chatList.find((item) => item.id === id);
    if (chat) {
      void dispatch(
        updateConversationPin({ id, pinned: !Boolean(chat.pinnedAt) }),
      );
    }
  };
  const togglePinProject = (id: string) => {
    const project = projectList.find((item) => item.id === id);
    if (project) {
      void dispatch(
        updateProjectPin({ id, pinned: !Boolean(project.pinnedAt) }),
      );
    }
  };

  const deleteModalStyle = (pos: MenuPosition): CSSProperties => ({
    top: pos.top,
    bottom: pos.bottom,
    left: pos.left != null ? pos.left + DELETE_MODAL_SHIFT : undefined,
    right:
      pos.right != null
        ? Math.max(VIEWPORT_EDGE_GAP, pos.right - DELETE_MODAL_SHIFT)
        : undefined,
  });

  const closeMenus = () => {
    setOpenMenuChatId(null);
    setOpenMenuProjectId(null);
    setDeletingChatId(null);
    setDeletingProjectId(null);
    setChatAction(null);
  };

  const getChatProject = (chatId: string | null) => {
    const chatProject = chatList.find((chat) => chat.id === chatId)?.project;
    if (!chatProject) return undefined;
    return projectList.find((p) => p.id === chatProject.id) ?? chatProject;
  };

  const openChatAction = (action: ChatAction) => {
    if (openMenuChatId) setChatAction({ action, chatId: openMenuChatId });
    setOpenMenuChatId(null);
  };

  const confirmChatAction = () => {
    if (!chatAction) return;
    const { action, chatId } = chatAction;
    const chatProject = getChatProject(chatId);

    if (action === "move") setMovingChatId(chatId);
    if (action === "remove" && chatProject) {
      void removeFromProject(chatId, chatProject.id);
    }
    setChatAction(null);
  };

  const movingFromProject = getChatProject(movingChatId);

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

  const chatMenuOpen =
    openMenuChatId !== null || deletingChatId !== null || chatAction !== null;
  const projectMenuOpen =
    openMenuProjectId !== null || deletingProjectId !== null;

  useLayoutEffect(() => {
    if (!chatMenuOpen && !projectMenuOpen) return;

    const reanchor = () => {
      if (chatMenuOpen && chatTriggerRef.current) {
        setMenuPosition(
          menuPositionBelow(
            chatTriggerRef.current,
            menuRef.current?.offsetHeight,
          ),
        );
      }
      if (projectMenuOpen && projectTriggerRef.current) {
        setProjectMenuPosition(
          menuPositionBelow(
            projectTriggerRef.current,
            projectMenuRef.current?.offsetHeight,
          ),
        );
      }
    };

    reanchor();

    window.addEventListener("scroll", reanchor, true);
    window.addEventListener("resize", reanchor);
    return () => {
      window.removeEventListener("scroll", reanchor, true);
      window.removeEventListener("resize", reanchor);
    };
  }, [
    chatMenuOpen,
    projectMenuOpen,
    openMenuChatId,
    deletingChatId,
    chatAction,
    openMenuProjectId,
    deletingProjectId,
  ]);

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

      <MyProjectsButton
        variant="shortcut"
        projectsCount={projectsCount}
        onOpen={handleOpenProjects}
        onCreate={handleCreateProject}
      />

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
              const isPinned = Boolean(chat.pinnedAt);
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
                    <button
                      type="button"
                      className={styles.quickPinButton}
                      aria-label={isPinned ? "Unpin chat" : "Pin chat to top"}
                      title={isPinned ? "Unpin chat" : "Pin chat to top"}
                      onClick={(e) => {
                        e.stopPropagation();
                        closeMenus();
                        togglePinChat(chat.id);
                      }}
                    >
                      <Image
                        src={isPinned ? "/icons/unpin.svg" : "/icons/pin.svg"}
                        alt=""
                        width={14}
                        height={15}
                      />
                    </button>
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

      <MyProjectsButton
        variant="expandable"
        projectsCount={projectsCount}
        expanded={showAllProjects}
        canExpand={isProjectsInteractive}
        onOpen={handleOpenProjects}
        onCreate={handleCreateProject}
        onToggle={handleToggleProjects}
      />

      {hasProjects && (
        <div
          className={`${styles.projectsScrollArea} ${
            showAllProjects && hasMoreProjects
              ? styles.projectsScrollAreaScroll
              : ""
          }`}
        >
          <ul className={styles.chatsList}>
            {sortedProjects.map((project) => {
              const isPinned = Boolean(project.pinnedAt);

              return (
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
                      height={23}
                      src="/icons/create-modal-project.svg"
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
                    <button
                      type="button"
                      className={styles.quickPinButton}
                      aria-label={
                        isPinned ? "Unpin project" : "Pin project to top"
                      }
                      title={
                        isPinned ? "Unpin project" : "Pin project to top"
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        closeMenus();
                        togglePinProject(project.id);
                      }}
                    >
                      <Image
                        src={isPinned ? "/icons/unpin.svg" : "/icons/pin.svg"}
                        alt=""
                        width={14}
                        height={15}
                      />
                    </button>
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
              );
            })}
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
            onClose={() => setOpenMenuChatId(null)}
            isPinned={Boolean(chatList.find((chat) => chat.id === openMenuChatId)?.pinnedAt)}
            onPinToggle={() => {
              togglePinChat(openMenuChatId);
              setOpenMenuChatId(null);
            }}
            showCreateProject={true}
            onCreateProject={() => setOpenMenuChatId(null)}
            projectTitle={getChatProject(openMenuChatId)?.title}
            onMoveToProject={() => openChatAction("move")}
            onArchive={() => openChatAction("archive")}
            onRemoveFromProject={() => openChatAction("remove")}
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
            onClose={() => setOpenMenuProjectId(null)}
            isProject={true}
            isPinned={Boolean(projectList.find((project) => project.id === openMenuProjectId)?.pinnedAt)}
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

      {chatAction && menuPosition && (
        <div
          ref={menuRef}
          className={styles.menuContainer}
          style={deleteModalStyle(menuPosition)}
        >
          <ChatActionModal
            action={chatAction.action}
            onCancel={() => setChatAction(null)}
            onConfirm={confirmChatAction}
          />
        </div>
      )}

      {movingChatId && (
        <ProjectPickerModal
          projects={sortedProjects.filter(
            (project) => project.id !== movingFromProject?.id,
          )}
          onClose={() => setMovingChatId(null)}
          onConfirm={(projectId) => {
            void moveToProject(movingChatId, projectId, movingFromProject?.id);
            setMovingChatId(null);
          }}
        />
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
