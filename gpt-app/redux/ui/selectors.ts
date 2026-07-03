import type { RootState } from "../store";

export const selectIsModalOpen = (state: RootState) => state.ui.isModalOpen;
export const selectIsCreateProjectModalOpen = (state: RootState) =>
  state.ui.isCreateProjectModalOpen;
export const selectActiveProjectId = (state: RootState) =>
  state.ui.activeProjectId;
export const selectAddChatsProjectId = (state: RootState) =>
  state.ui.addChatsProjectId;
export const selectFocusMode = (state: RootState) => state.ui.focusMode;
export const selectIsSectionVisible = (state: RootState) =>
  state.ui.isSectionVisible;
export const selectIsOverlayOpen = (state: RootState) => state.ui.isOverlayOpen;
export const selectHasFirstRequest = (state: RootState) =>
  state.ui.hasFirstRequest;
export const selectNewChatOpened = (state: RootState) => state.ui.newChatOpened;
