"use client";

import ModelModalOverlay from "@/components/ModelModalOverlay/ModelModalOverlay";
import CreateProjectModalOverlay from "@/components/HomePage/LeftSide/CreateProjectModalWindow/CreateProjectModalOverlay";
import AddChatsModalOverlay from "@/components/HomePage/LeftSide/AddChatsModalWindow/AddChatsModalOverlay";

import { fetchConversations } from "@/redux/chat/operations";
import { setSelectedModelGroup } from "@/redux/model/slice";
import {
  setIsModalOpen,
  setIsCreateProjectModalOpen,
  setActiveProjectId,
  setAddChatsProjectId,
} from "@/redux/ui/slice";
import {
  createProject,
  addProjectConversations,
} from "@/redux/projects/operations";

import type { HomeController } from "./useHomeController";

export default function HomeModals({ ctrl }: { ctrl: HomeController }) {
  const { dispatch } = ctrl;

  return (
    <>
      <ModelModalOverlay
        isModalOpen={ctrl.isModalOpen}
        setIsModalOpen={(open) => dispatch(setIsModalOpen(open))}
        selectedModel={ctrl.selectedModel}
        setSelectedModel={ctrl.handleSelectModel}
        selectedModelGroup={ctrl.selectedModelGroup}
        setSelectedModelGroup={(g) => dispatch(setSelectedModelGroup(g))}
      />

      <CreateProjectModalOverlay
        isOpen={ctrl.isCreateProjectModalOpen}
        setIsOpen={(open) => dispatch(setIsCreateProjectModalOpen(open))}
        onCreate={async (name) => {
          dispatch(setIsCreateProjectModalOpen(false));
          try {
            const created = await dispatch(
              createProject({ title: name, defaultModel: ctrl.selectedModel }),
            ).unwrap();
            dispatch(setActiveProjectId(created.id));
          } catch {
            // creation failed → the modal is already closed, error is in the store
          }
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
          if (ctrl.addChatsProjectId && ids.length > 0) {
            dispatch(
              addProjectConversations({
                projectId: ctrl.addChatsProjectId,
                conversationIds: ids,
              }),
            )
              .unwrap()
              .then(() => dispatch(fetchConversations()))
              .catch(() => {});
          }
          dispatch(setAddChatsProjectId(null));
        }}
      />
    </>
  );
}
