import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  isModalOpen: boolean;
  isCreateProjectModalOpen: boolean;
  activeProjectId: string | null;
  addChatsProjectId: string | null;
  focusMode: boolean;
  isSectionVisible: boolean;
  isOverlayOpen: boolean;
  hasFirstRequest: boolean;
  errorToast: { id: number; message: string } | null;
  nextToastId: number;
}

const initialState: UiState = {
  isModalOpen: false,
  isCreateProjectModalOpen: false,
  activeProjectId: null,
  addChatsProjectId: null,
  focusMode: false,
  isSectionVisible: true,
  isOverlayOpen: false,
  hasFirstRequest: false,
  errorToast: null,
  nextToastId: 0,
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
    setActiveProjectId(state, { payload }: PayloadAction<string | null>) {
      state.activeProjectId = payload;
    },
    setAddChatsProjectId(state, { payload }: PayloadAction<string | null>) {
      state.addChatsProjectId = payload;
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
    showErrorToast(state, { payload }: PayloadAction<string>) {
      state.nextToastId += 1;
      state.errorToast = { id: state.nextToastId, message: payload };
    },
    hideErrorToast(state, { payload }: PayloadAction<number | undefined>) {
      if (payload !== undefined && state.errorToast?.id !== payload) return;
      state.errorToast = null;
    },
  },
});

export const {
  setIsModalOpen,
  setIsCreateProjectModalOpen,
  setActiveProjectId,
  setAddChatsProjectId,
  setFocusMode,
  setIsSectionVisible,
  setIsOverlayOpen,
  setHasFirstRequest,
  showErrorToast,
  hideErrorToast,
} = uiSlice.actions;

export const uiReducer = uiSlice.reducer;
