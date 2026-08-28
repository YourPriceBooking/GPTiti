"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import LeftSide from "@/components/HomePage/LeftSide/LeftSide";
import LeftSideDrawer from "@/components/HomePage/LeftSide/LeftSideDrawer/LeftSideDrawer";
import LoginModal from "@/components/HomePage/common/LoginModal/LoginModal";
import { getFlowThemeId } from "@/config/modelFlows.config";
import { selectIsLoggedIn, selectSessionExpired } from "@/redux/auth/selectors";
import { setActiveChatId } from "@/redux/chat/slice";
import { useAppSelector } from "@/redux/hooks";
import { setSelectedModelGroup } from "@/redux/model/slice";
import {
  setActiveProjectId,
  setIsCreateProjectModalOpen,
  setIsModalOpen,
  showErrorToast,
} from "@/redux/ui/slice";

import HomeModals from "./HomeModals";
import { useHomeController, type HomeController } from "./useHomeController";
import styles from "../page.module.css";

type AppShellProps = {
  chatId?: string;
  projectId?: string;
  chatLayout?: boolean;
  requireAuth?: boolean;
  children: (ctrl: HomeController) => ReactNode;
};

export default function AppShell({
  chatId,
  projectId,
  chatLayout = false,
  requireAuth = false,
  children,
}: AppShellProps) {
  const ctrl = useHomeController();
  const router = useRouter();
  const { dispatch } = ctrl;

  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const sessionExpired = useAppSelector(selectSessionExpired);
  const [loginDismissed, setLoginDismissed] = useState(false);

  useEffect(() => {
    dispatch(setActiveProjectId(projectId ?? null));
    if (chatId) dispatch(setActiveChatId(chatId));
  }, [chatId, projectId, dispatch]);

  const missingChat =
    Boolean(chatId) &&
    ctrl.chatsLoaded &&
    !ctrl.sortedChatList.some((chat) => chat.id === chatId);
  const missingProject =
    Boolean(projectId) &&
    ctrl.projectsLoaded &&
    !ctrl.projectList.some((project) => project.id === projectId);

  useEffect(() => {
    if (!missingChat && !missingProject) return;
    dispatch(
      showErrorToast(missingChat ? "Chat not found" : "Project not found"),
    );
    router.replace("/");
  }, [missingChat, missingProject, dispatch, router]);

  const leftSideProps = {
    onNewChat: ctrl.handleStartNewChat,
    onNewProject: () => dispatch(setIsCreateProjectModalOpen(true)),
    isModalOpen: ctrl.isModalOpen,
    setIsModalOpen: (open: boolean) => dispatch(setIsModalOpen(open)),
    modelMode: ctrl.modelMode,
    setModelMode: ctrl.setModelMode,
    chatList: ctrl.sortedChatList,
    setActiveChatId: ctrl.handleSelectChat,
    deleteChat: ctrl.handleDeleteChat,
    renameChat: ctrl.handleRenameChat,
    modelRef: ctrl.modelRef,
    selectedModel: ctrl.selectedModel,
    setSelectedModel: ctrl.handleSelectModel,
    selectedModelGroup: ctrl.selectedModelGroup,
    setSelectedModelGroup: (group: typeof ctrl.selectedModelGroup) =>
      dispatch(setSelectedModelGroup(group)),
  };

  return (
    <>
      <HomeModals
        ctrl={ctrl}
        onProjectCreated={(createdId) => router.push(`/projects/${createdId}`)}
      />

      <LoginModal
        open={requireAuth && !isLoggedIn && !sessionExpired && !loginDismissed}
        onClose={() => setLoginDismissed(true)}
      />

      <div
        className={styles.appContainer}
        data-flow={getFlowThemeId(ctrl.selectedModel)}
      >
        <div className={styles.leftSideContainer}>
          <LeftSide {...leftSideProps} />
        </div>

        <div
          className={`${styles.rightSection} ${
            chatLayout ? styles.rightSectionChat : ""
          }`}
        >
          <LeftSideDrawer
            {...leftSideProps}
            className={
              chatLayout ? styles.chatMenuTrigger : styles.projectMenuTrigger
            }
          />
          {children(ctrl)}
        </div>
      </div>
    </>
  );
}
