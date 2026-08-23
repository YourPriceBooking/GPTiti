"use client";

import { useRouter } from "next/navigation";

import LeftSide from "@/components/HomePage/LeftSide/LeftSide";
import LeftSideDrawer from "@/components/HomePage/LeftSide/LeftSideDrawer/LeftSideDrawer";
import ProjectsOverview from "@/components/HomePage/RightSide/ProjectsOverview/ProjectsOverview";
import { getFlowThemeId } from "@/config/modelFlows.config";
import { setSelectedModelGroup } from "@/redux/model/slice";
import {
  setActiveProjectId,
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
    ctrl.handleStartNewChat();
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
          <div className={pageStyles.projectsOverviewViewport}>
            <ProjectsOverview
              projects={ctrl.projectList}
              onCreateProject={() =>
                dispatch(setIsCreateProjectModalOpen(true))
              }
              onOpenProject={openProject}
              onRenameProject={ctrl.handleRenameProject}
              onDeleteProject={ctrl.handleDeleteProject}
              onAddChats={ctrl.handleAddChatsToProject}
            />
          </div>
        </div>
      </div>
    </>
  );
}
