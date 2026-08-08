"use client";

import { useRouter } from "next/navigation";

import LeftSide from "@/components/HomePage/LeftSide/LeftSide";
import LeftSideDrawer from "@/components/HomePage/LeftSide/LeftSideDrawer/LeftSideDrawer";
import ProjectsOverview from "@/components/HomePage/RightSide/ProjectsOverview/ProjectsOverview";
import { getFlowThemeId } from "@/config/modelFlows.config";
import { handleNewChat } from "@/redux/chat/slice";
import { setSelectedModelGroup } from "@/redux/model/slice";
import { removeProject, updateProject } from "@/redux/projects/operations";
import { renameProject } from "@/redux/projects/slice";
import {
  setActiveProjectId,
  setAddChatsProjectId,
  setIsCreateProjectModalOpen,
  setIsModalOpen,
} from "@/redux/ui/slice";

import HomeModals from "../_home/HomeModals";
import { useHomeController } from "../_home/useHomeController";
import pageStyles from "../page.module.css";

export default function ProjectsPage() {
  const ctrl = useHomeController();
  const router = useRouter();
  const { dispatch, modelRef } = ctrl;

  const openHome = () => router.push("/");
  const startNewChat = () => {
    dispatch(setActiveProjectId(null));
    dispatch(handleNewChat());
    openHome();
  };
  const openProject = (projectId: string) => {
    dispatch(setActiveProjectId(projectId));
    openHome();
  };

  const leftSideProps = {
    onNewChat: startNewChat,
    onNewProject: () => dispatch(setIsCreateProjectModalOpen(true)),
    isModalOpen: ctrl.isModalOpen,
    setIsModalOpen: (open: boolean) => dispatch(setIsModalOpen(open)),
    modelMode: ctrl.modelMode,
    setModelMode: ctrl.setModelMode,
    chatList: ctrl.sortedChatList,
    setActiveChatId: (id: string) => {
      ctrl.handleSelectChat(id);
      openHome();
    },
    deleteChat: ctrl.handleDeleteChat,
    renameChat: ctrl.handleRenameChat,
    modelRef,
    selectedModel: ctrl.selectedModel,
    setSelectedModel: ctrl.handleSelectModel,
    selectedModelGroup: ctrl.selectedModelGroup,
    setSelectedModelGroup: (group: typeof ctrl.selectedModelGroup) =>
      dispatch(setSelectedModelGroup(group)),
    onSelectProject: openHome,
  };

  return (
    <>
      <HomeModals ctrl={ctrl} onProjectCreated={openHome} />
      <div
        className={pageStyles.appContainer}
        data-flow={getFlowThemeId(ctrl.selectedModel)}
      >
        <div className={pageStyles.leftSideContainer}>
          <LeftSide {...leftSideProps} />
        </div>
        <div className={pageStyles.rightSection}>
          <LeftSideDrawer
            {...leftSideProps}
            className={pageStyles.projectMenuTrigger}
          />
          <ProjectsOverview
            projects={ctrl.projectList}
            onCreateProject={() => dispatch(setIsCreateProjectModalOpen(true))}
            onOpenProject={openProject}
            onRenameProject={(projectId, title) => {
              dispatch(renameProject({ id: projectId, title }));
              dispatch(updateProject({ id: projectId, changes: { title } }));
            }}
            onDeleteProject={(projectId) => dispatch(removeProject(projectId))}
            onAddChats={(projectId) => dispatch(setAddChatsProjectId(projectId))}
          />
        </div>
      </div>
    </>
  );
}
