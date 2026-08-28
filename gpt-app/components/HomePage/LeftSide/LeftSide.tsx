import styles from "./LeftSide.module.css";
import FooterLeftSide from "./FooterLeftSide/FooterLeftSide";
import { LeftSideProps } from "@/types/types";
import SectionGptUser from "./SectionGptUser/SectionGptUser";
import SectionGptChats from "./SectionGptChats/SectionGptChats";
import SectionGptTokens from "./SectionGptTokens/SectionGptTokens";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectProjectList } from "@/redux/projects/selectors";
import { renameProject } from "@/redux/projects/slice";
import { removeProject, updateProject } from "@/redux/projects/operations";
import { selectActiveProjectId } from "@/redux/ui/selectors";
import { setActiveProjectId, setAddChatsProjectId } from "@/redux/ui/slice";

export default function LeftSide({
  onNewChat,
  onNewProject,
  chatList,
  setActiveChatId,
  deleteChat,
  renameChat,
  modelRef,
  modelMode,
  setModelMode,
  selectedModel,
  setSelectedModel,
  selectedModelGroup,
  setSelectedModelGroup,
  isModalOpen,
  setIsModalOpen,
  onSelectProject,
}: LeftSideProps) {
  const [isOpen, setIsOpen] = useState(true);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const projectList = useAppSelector(selectProjectList);
  const activeProjectId = useAppSelector(selectActiveProjectId);

  const handleSelectProject = (id: string) => {
    dispatch(setActiveProjectId(id));
    router.push(`/projects/${id}`);
    onSelectProject?.();
  };

  const handleDeleteProject = (id: string) => {
    dispatch(removeProject(id));
    if (id === activeProjectId) {
      dispatch(setActiveProjectId(null));
      router.push("/projects");
    }
  };

  const handleRenameProject = (id: string, title: string) => {
    dispatch(renameProject({ id, title })); // optimistic local update
    dispatch(updateProject({ id, changes: { title } }));
  };

  const handleAddChatsToProject = (id: string) =>
    dispatch(setAddChatsProjectId(id));

  return (
    <div
      className={styles.chatsScrollArea}
      style={{
        width: isOpen ? "330px" : "64px",
        transition: "width 0.3s ease-in-out",
      }}
    >
      <div className={styles.container}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={styles.toggleButton}
          aria-label={isOpen ? "Hide panel" : "Show panel"}
        >
          <Image
            src="/chevron-left.svg"
            alt=""
            width={24}
            height={24}
            className={styles.chevron}
            style={{
              transform: !isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          />
        </button>
        {isOpen ? (
          <div
            className={`${styles.panelContent} ${
              isOpen ? styles.panelContentShow : styles.panelContentHide
            }`}
          >
            <SectionGptTokens
              modelRef={modelRef}
              modelMode={modelMode}
              setModelMode={setModelMode}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              selectedModelGroup={selectedModelGroup}
              setSelectedModelGroup={setSelectedModelGroup}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
            />

            <SectionGptChats
              onNewChat={onNewChat}
              onNewProject={onNewProject}
              projectList={projectList}
              setActiveProject={handleSelectProject}
              deleteProject={handleDeleteProject}
              renameProject={handleRenameProject}
              addChatsToProject={handleAddChatsToProject}
              chatList={chatList}
              setActiveChatId={setActiveChatId}
              deleteChat={deleteChat}
              renameChat={renameChat}
            />

            <SectionGptUser />

            <FooterLeftSide />
          </div>
        ) : (
          <div
            className={`${styles.collapsedContent} ${
              isOpen ? styles.collapsedHide : styles.collapsedShow
            }`}
          >
            <button
              onClick={() => setIsModalOpen(true)}
              className={styles.iconButton}
              aria-label="Select a model"
              title="Select a model"
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                />
              </svg>
            </button>

            <button
              onClick={onNewChat}
              className={styles.iconButton}
              aria-label="New chat"
              title="New chat"
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>

            <div className={styles.userIconBottom}>
              <div
                className={styles.userIconAvatar}
                title="henrinkwinta@gmail.com"
              >
                <Image
                  width={20}
                  height={26}
                  src="/icons/ghost-user.svg"
                  alt="user"
                  className={styles.userAvatarImage}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
