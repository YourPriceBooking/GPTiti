"use client";

import ProjectWorkspace from "@/components/HomePage/RightSide/ProjectWorkspace/ProjectWorkspace";

import { setHasFirstRequest, setIsModalOpen } from "@/redux/ui/slice";

import type { HomeController } from "./useHomeController";
import styles from "../page.module.css";

export default function ProjectView({ ctrl }: { ctrl: HomeController }) {
  const { dispatch, activeProject, inputRef } = ctrl;
  if (!activeProject) return null;

  return (
    <div className={styles.projectWorkspaceScroll}>
      <ProjectWorkspace
        projectId={activeProject.id}
        name={activeProject.title}
        createdAt={activeProject.createdAt}
        chats={ctrl.projectChats}
        chatsLoaded={activeProject.conversationIds !== undefined}
        onOpenChat={ctrl.handleSelectChat}
        onRemoveChat={ctrl.handleRemoveChatFromProject}
        onRenameChat={ctrl.handleRenameChat}
        onAddChatsToProject={ctrl.handleAddChatsToProject}
        onRenameProject={ctrl.handleRenameProject}
        onDeleteProject={ctrl.handleDeleteProject}
        onCreateFirstChat={() => inputRef.current?.focus()}
        inputProps={{
          hasInput: ctrl.hasInput,
          onChange: ctrl.handleChange,
          onSend: (_message, imageUrls, imageFiles) =>
            ctrl.handleProjectSend(imageUrls, imageFiles),
          inputRef: inputRef,
          onHideSection: () => {},
          templateTick: ctrl.templateTick,
          setHasFirstRequest: (updater) => {
            const next =
              typeof updater === "function"
                ? (updater as (prev: boolean) => boolean)(ctrl.hasFirstRequest)
                : updater;
            dispatch(setHasFirstRequest(next));
          },
          hasFirstRequest: ctrl.hasFirstRequest,
          selectedModel: ctrl.selectedModel,
          onImagesChange: ctrl.setInputImageCount,
          isAiResponding: ctrl.isTyping,
          sendDisabled: ctrl.sendDisabled,
        }}
        onChooseModel={() => dispatch(setIsModalOpen(true))}
        showEstimate={ctrl.showEstimate}
        estimateSupported={ctrl.estimateSupported}
        estimatedTokens={ctrl.estimatedTokens}
      />
    </div>
  );
}
