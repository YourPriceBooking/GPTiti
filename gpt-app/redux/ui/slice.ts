import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  isModalOpen: boolean;
  isCreateProjectModalOpen: boolean;
  focusMode: boolean;
  isSectionVisible: boolean;
  isOverlayOpen: boolean;
  hasFirstRequest: boolean;
  newChatOpened: boolean;
}

const initialState: UiState = {
  isModalOpen: false,
  isCreateProjectModalOpen: false,
  focusMode: false,
  isSectionVisible: true,
  isOverlayOpen: false,
  hasFirstRequest: false,
  newChatOpened: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setIsModalOpen(state, { payload }: PayloadAction<boolean>) {
      state.isModalOpen = payload;
    },
    setIsCreateProjectModalOpen(state, { payload }: PayloadAction<boolean>) {
      state.isCreateProjectModalOpen = payload;
    },
    setFocusMode(state, { payload }: PayloadAction<boolean>) {
      state.focusMode = payload;
    },
    setIsSectionVisible(state, { payload }: PayloadAction<boolean>) {
      state.isSectionVisible = payload;
    },
    setIsOverlayOpen(state, { payload }: PayloadAction<boolean>) {
      state.isOverlayOpen = payload;
    },
    setHasFirstRequest(state, { payload }: PayloadAction<boolean>) {
      state.hasFirstRequest = payload;
    },
    setNewChatOpened(state, { payload }: PayloadAction<boolean>) {
      state.newChatOpened = payload;
    },
  },
});

export const {
  setIsModalOpen,
  setIsCreateProjectModalOpen,
  setFocusMode,
  setIsSectionVisible,
  setIsOverlayOpen,
  setHasFirstRequest,
  setNewChatOpened,
} = uiSlice.actions;

export const uiReducer = uiSlice.reducer;
