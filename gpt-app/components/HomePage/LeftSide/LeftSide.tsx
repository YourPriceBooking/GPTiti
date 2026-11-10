import NavigationRail from "./NavigationRail";
import styles from "./LeftSide.module.css";
import FooterLeftSide from "./FooterLeftSide/FooterLeftSide";
import { LeftSideProps } from "@/types/types";
import SectionGptUser from "./SectionGptUser/SectionGptUser";
import SectionGptChats from "./SectionGptChats/SectionGptChats";
import SectionGptTokens from "./SectionGptTokens/SectionGptTokens";
import { useState } from "react";
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
  onNavigate,
}: LeftSideProps & { onNavigate?: () => void }) {
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
      style={{ width: isOpen ? "386px" : "56px" }}
    >
      <NavigationRail
        expanded={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        onNavigate={onNavigate}
      />
      {isOpen && (
        <div className={styles.container}>
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
        </div>
      )}
    </div>
  );
}
