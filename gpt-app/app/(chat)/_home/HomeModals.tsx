"use client";

import { AllModelsDialog } from "@/components/HomePage/RightSide/NewChatModels/NewChatModels";
import CreateProjectModalOverlay from "@/components/HomePage/LeftSide/CreateProjectModalWindow/CreateProjectModalOverlay";
import AddChatsModalOverlay from "@/components/HomePage/LeftSide/AddChatsModalWindow/AddChatsModalOverlay";

import {
  setIsModalOpen,
  setIsCreateProjectModalOpen,
  setActiveProjectId,
  setAddChatsProjectId,
} from "@/redux/ui/slice";
import { createProject } from "@/redux/projects/operations";

import type { HomeController } from "./useHomeController";

type HomeModalsProps = {
  ctrl: HomeController;
  onProjectCreated?: (projectId: string) => void;
};

export default function HomeModals({
  ctrl,
  onProjectCreated,
}: HomeModalsProps) {
  const { dispatch } = ctrl;

  return (
    <>
      {ctrl.isModalOpen && <AllModelsDialog
        selected={ctrl.selectedModel}
        onSelect={ctrl.handleSelectModel}
        onClose={() => dispatch(setIsModalOpen(false))}
      />}

      <CreateProjectModalOverlay
        isOpen={ctrl.isCreateProjectModalOpen}
        setIsOpen={(open) => dispatch(setIsCreateProjectModalOpen(open))}
        onCreate={async (name) => {
          const created = await dispatch(
            createProject({ title: name, defaultModel: ctrl.selectedModel }),
          ).unwrap();
          dispatch(setIsCreateProjectModalOpen(false));
          dispatch(setActiveProjectId(created.id));
          onProjectCreated?.(created.id);
        }}
      />

      <AddChatsModalOverlay
        isOpen={ctrl.addChatsProjectId !== null}
        setIsOpen={(open) => {
          if (!open) dispatch(setAddChatsProjectId(null));
        }}
        projectName={ctrl.addChatsProject?.title ?? "this project"}
        chats={ctrl.availableChatsForProject}
        onConfirm={(ids) => {
          if (ctrl.addChatsProjectId) {
            ctrl.linkConversations(ctrl.addChatsProjectId, ids);
          }
          dispatch(setAddChatsProjectId(null));
        }}
      />
    </>
  );
}
