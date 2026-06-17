import { useState, useRef, useEffect } from "react";
import styles from "./SectionGptChats.module.css";
import Image from "next/image";
import { SectionGptChatsProps, Chat } from "@/types/types";
import ChatsMenu from "../ChatsMenu/ChatsMenu";
import DeleteModalWindow from "../DeleteModalWindow/DeleteModalWindow";
import { useAppSelector } from "@/redux/hooks";
import { selectActiveChatId } from "@/redux/chat/selectors";

export default function SectionGptChats({
  onNewChat,
  onNewProject,
  projectList = [],
  chatList,
  setActiveChatId,
  deleteChat,
  renameChat,
}: SectionGptChatsProps) {
  const [showAllProjects, setShowAllProjects] = useState(false);
  const projectsCount = projectList.length;
  const hasProjects = projectsCount > 0;
  const MAX_VISIBLE_PROJECTS = 3;
  const hasMoreProjects = projectsCount > MAX_VISIBLE_PROJECTS;
  const hiddenProjectsCount = projectsCount - MAX_VISIBLE_PROJECTS;
  const isProjectsInteractive = hasMoreProjects;
  const showProjectsOpen = hasMoreProjects && showAllProjects;

  const [pinnedChatIds, setPinnedChatIds] = useState<string[]>([]);
  const [pinnedProjectIds, setPinnedProjectIds] = useState<string[]>([]);

  const [openMenuChatId, setOpenMenuChatId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [openMenuProjectId, setOpenMenuProjectId] = useState<string | null>(null);
  const [projectMenuPosition, setProjectMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [renamingChatId, setRenamingChatId] = useState<string | null>(null);
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [showAllChats, setShowAllChats] = useState(false);
  const activeChatId = useAppSelector(selectActiveChatId);

  const MAX_VISIBLE_CHATS = 5;
  const titledChats = chatList.filter((chat) => chat.title !== null);
  const pinnedChats = [...pinnedChatIds]
    .reverse()
    .map((id) => titledChats.find((c) => c.id === id))
    .filter((c): c is Chat => c !== undefined);
  const unpinnedChats = titledChats.filter(
    (c) => !pinnedChatIds.includes(c.id)
  );
  const sortedChats = [...pinnedChats, ...unpinnedChats];
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

  const togglePinChat = (id: string) => {
    setPinnedChatIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const togglePinProject = (id: string) => {
    setPinnedProjectIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const insideAnyMenu =
        menuRef.current?.contains(target) ||
        projectMenuRef.current?.contains(target);

      if (!insideAnyMenu) {
        setOpenMenuChatId(null);
        setDeletingChatId(null);
        setOpenMenuProjectId(null);
        setDeletingProjectId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
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
            <div className={`${styles.chatsChevron} ${headerExpanded ? styles.chatsChevronOpen : ""}`}>
              <Image width={15} height={15} src="/icons/chevron-down.svg" alt="chevron-down" />
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
            {visibleChats.map((chat) => (
              <li
                key={chat.id}
                className={`${styles.chatsListItem} ${
                  chat.id === activeChatId ? styles.chatsListItemActive : ""
                }`}
                tabIndex={0}
                onClick={() => setActiveChatId(chat.id)}
              >
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

                <div className={styles.chatRight}>
                  {chat.id === activeChatId && (
                    <span className={styles.activeIndicator} />
                  )}
                  <div className={styles.chatAction}>
                  {pinnedChatIds.includes(chat.id) && (
                    <span className={styles.pinSmall}>
                      <Image src="/icons/pin.svg" alt="pinned" width={14} height={15} />
                    </span>
                  )}
                  <span
                    className={styles.dotsIcon}
                    onClick={(e) => {
                      e.stopPropagation();
                      const rect = (
                        e.currentTarget as HTMLElement
                      ).getBoundingClientRect();
                      const centerY = rect.top + rect.height / 2;
                      const offsetX = rect.right + 8;
                      setMenuPosition({ top: centerY, left: offsetX });
                      setOpenMenuChatId(chat.id);
                    }}
                  />
                </div>
                </div>
              </li>
            ))}
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
        onClick={isProjectsInteractive ? () => setShowAllProjects((prev) => !prev) : undefined}
        role={isProjectsInteractive ? "button" : undefined}
        tabIndex={isProjectsInteractive ? 0 : undefined}
      >
        <Image
          width={36}
          height={36}
          src={showProjectsOpen ? "/icons/my-projects-open.svg" : "/icons/my-projects-closed.svg"}
          alt="my-projects"
        />
        <div className={styles.projectsLabelWrapper}>
          <div className={styles.labelLeft}>
            <span className={styles.span}>My Projects</span>
            {hasProjects && <span className={styles.badge}>{projectsCount}</span>}
          </div>
          {isProjectsInteractive && (
            <div className={`${styles.projectsChevron} ${showAllProjects ? styles.projectsChevronOpen : ""}`}>
              <Image width={15} height={15} src="/icons/chevron-down.svg" alt="chevron-down" />
            </div>
          )}
        </div>
      </article>

      {hasProjects && (
        <div className={`${styles.projectsScrollArea} ${
          showAllProjects && hasMoreProjects ? styles.projectsScrollAreaScroll : ""
        }`}>
          <ul className={styles.chatsList}>
            {projectList.map((project) => (
              <li key={project.id} className={styles.chatsListItem} tabIndex={0}>
                <div className={styles.projectItemContent}>
                  <Image width={28} height={28} src="/icons/project-item.svg" alt="project" />
                  <span className={styles.chatTitle}>
                    {project.title.length > 12
                      ? project.title.slice(0, 12) + "..."
                      : project.title}
                  </span>
                </div>
                <span
                  className={styles.dotsIcon}
                  onClick={(e) => {
                    e.stopPropagation();
                    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                    setProjectMenuPosition({ top: rect.top + rect.height / 2, left: rect.right + 8 });
                    setOpenMenuProjectId(project.id);
                  }}
                />
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
          aria-label={showAllProjects ? "Show fewer projects" : "Show more projects"}
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
          style={{ top: menuPosition.top, left: menuPosition.left }}
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
          style={{ top: projectMenuPosition.top, left: projectMenuPosition.left }}
        >
          <ChatsMenu
            isProject={true}
            isPinned={pinnedProjectIds.includes(openMenuProjectId)}
            onPinToggle={() => {
              togglePinProject(openMenuProjectId);
              setOpenMenuProjectId(null);
            }}
            onAddChats={() => setOpenMenuProjectId(null)}
            onRenameRequest={() => setOpenMenuProjectId(null)}
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
          style={{ top: menuPosition.top, left: menuPosition.left }}
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
          style={{ top: projectMenuPosition.top, left: projectMenuPosition.left }}
        >
          <DeleteModalWindow
            type="project"
            onCancel={() => setDeletingProjectId(null)}
            onConfirm={() => setDeletingProjectId(null)}
          />
        </div>
      )}
    </section>
  );
}
