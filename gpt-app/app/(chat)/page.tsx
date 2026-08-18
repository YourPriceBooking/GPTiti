"use client";

import LeftSide from "@/components/HomePage/LeftSide/LeftSide";

import { getFlowThemeId } from "@/config/modelFlows.config";
import { handleNewChat } from "@/redux/chat/slice";
import { setSelectedModelGroup } from "@/redux/model/slice";
import {
  setIsModalOpen,
  setIsCreateProjectModalOpen,
  setActiveProjectId,
} from "@/redux/ui/slice";

import { useHomeController } from "./_home/useHomeController";
import HomeModals from "./_home/HomeModals";
import ProjectView from "./_home/ProjectView";
import ChatView from "./_home/ChatView";

import styles from "./page.module.css";

export default function Home() {
  const ctrl = useHomeController();
  const { dispatch, modelRef } = ctrl;

  return (
    <>
      <HomeModals ctrl={ctrl} />

      <div
        className={styles.appContainer}
        data-flow={getFlowThemeId(ctrl.selectedModel)}
      >
        <div className={styles.leftSideContainer}>
          <LeftSide
            onNewChat={() => {
              dispatch(setActiveProjectId(null));
              dispatch(handleNewChat());
            }}
            onNewProject={() => dispatch(setIsCreateProjectModalOpen(true))}
            isModalOpen={ctrl.isModalOpen}
            setIsModalOpen={(open) => dispatch(setIsModalOpen(open))}
            modelMode={ctrl.modelMode}
            setModelMode={ctrl.setModelMode}
            chatList={ctrl.sortedChatList}
            setActiveChatId={ctrl.handleSelectChat}
            deleteChat={ctrl.handleDeleteChat}
            renameChat={ctrl.handleRenameChat}
            modelRef={modelRef}
            selectedModel={ctrl.selectedModel}
            setSelectedModel={ctrl.handleSelectModel}
            selectedModelGroup={ctrl.selectedModelGroup}
            setSelectedModelGroup={(g) => dispatch(setSelectedModelGroup(g))}
          />
        </div>
        <div
          className={`${styles.rightSection} ${
            ctrl.activeProject ? "" : styles.rightSectionChat
          }`}
        >
          {ctrl.activeProject ? (
            <ProjectView ctrl={ctrl} />
          ) : (
            <ChatView ctrl={ctrl} />
          )}
        </div>
      </div>
    </>
  );
}
