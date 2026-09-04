import { createSlice, isAnyOf, type PayloadAction } from "@reduxjs/toolkit";
import type { ProjectConversation } from "@/types/api.types";
import type { Project } from "@/types/types";
import {
  fetchProjects,
  createProject,
  updateProject,
  removeProject,
  fetchProject,
  addProjectConversations,
  removeProjectConversation,
  updateProjectPin,
} from "./operations";
import { logoutUser, refreshUser } from "../auth/operations";
import { refreshError } from "../auth/slice";
import { updateConversationPin } from "../chat/operations";

interface ProjectsState {
  list: Project[];
  status: "idle" | "loading" | "loaded" | "error";
  error: string | null;
  pinMutations: Record<string, string>;
}

const initialState: ProjectsState = {
  list: [],
  status: "idle",
  error: null,
  pinMutations: {},
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    // Optimistic local rename; the server value is reconciled by updateProject.
    renameProject(
      state,
      { payload }: PayloadAction<{ id: string; title: string }>,
    ) {
      const project = state.list.find((p) => p.id === payload.id);
      if (project) project.title = payload.title;
    },
  },

  extraReducers: (builder) =>
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, { payload }) => {
        state.status = "loaded";
        const prevById = new Map(state.list.map((p) => [p.id, p]));
        state.list = payload.map((p) => {
          const prev = prevById.get(p.id);
          return prev
            ? {
                ...p,
                conversationIds: p.conversationIds ?? prev.conversationIds,
              }
            : p;
        });
      })
      .addCase(fetchProjects.rejected, (state, { payload }) => {
        state.status = "error";
        state.error = payload ?? "Failed to load projects";
      })
      .addCase(createProject.fulfilled, (state, { payload }) => {
        state.list.unshift({
          ...payload,
          conversationIds: payload.conversationIds ?? [],
        });
      })
      .addCase(createProject.rejected, (state, { payload }) => {
        state.error = payload ?? "Failed to create project";
      })
      .addCase(updateProject.fulfilled, (state, { payload }) => {
        const i = state.list.findIndex((p) => p.id === payload.id);
        if (i !== -1) state.list[i] = payload;
      })
      .addCase(updateProject.rejected, (state, { payload }) => {
        state.error = payload ?? "Failed to update project";
      })
      .addCase(removeProject.fulfilled, (state, { payload }) => {
        state.list = state.list.filter((p) => p.id !== payload);
      })
      .addCase(removeProject.rejected, (state, { payload }) => {
        state.error = payload ?? "Failed to delete project";
      })
      .addCase(updateProjectPin.pending, (state, { meta }) => {
        state.pinMutations[meta.arg.id] = meta.requestId;
      })
      .addCase(updateProjectPin.fulfilled, (state, { payload, meta }) => {
        if (state.pinMutations[meta.arg.id] !== meta.requestId) return;
        const project = state.list.find((item) => item.id === meta.arg.id);
        if (project) project.pinnedAt = payload.pinnedAt;
        delete state.pinMutations[meta.arg.id];
      })
      .addCase(updateProjectPin.rejected, (state, { meta }) => {
        if (state.pinMutations[meta.arg.id] !== meta.requestId) return;
        delete state.pinMutations[meta.arg.id];
      })
      .addCase(updateConversationPin.fulfilled, (state, { payload }) => {
        for (const project of state.list) {
          const conversation = project.conversationIds?.find(
            (item) => item._id === payload._id,
          );
          if (conversation) conversation.pinnedAt = payload.pinnedAt ?? null;
        }
      })
      .addCase(fetchProject.fulfilled, (state, { payload }) => {
        const i = state.list.findIndex((p) => p.id === payload.id);
        if (i !== -1) state.list[i] = { ...state.list[i], ...payload };
        else state.list.unshift(payload);
      })
      .addCase(addProjectConversations.fulfilled, (state, { payload }) => {
        const project = state.list.find((p) => p.id === payload.projectId);
        if (!project) return;
        const existing = project.conversationIds ?? [];
        const existingIds = new Set(existing.map((c) => c._id));
        const added: ProjectConversation[] = payload.conversationIds
          .filter((id) => !existingIds.has(id))
          .map((id) => ({ _id: id, title: null, pinnedAt: null }));
        project.conversationIds = [...existing, ...added];
        project.conversationCount = project.conversationIds.length;
      })
      .addCase(addProjectConversations.rejected, (state, { payload }) => {
        state.error = payload ?? "Failed to add chats to project";
      })
      .addCase(removeProjectConversation.fulfilled, (state, { payload }) => {
        const project = state.list.find((p) => p.id === payload.projectId);
        if (!project) return;
        project.conversationIds = (project.conversationIds ?? []).filter(
          (c) => c._id !== payload.conversationId,
        );
        project.conversationCount = project.conversationIds.length;
      })
      .addCase(removeProjectConversation.rejected, (state, { payload }) => {
        state.error = payload ?? "Failed to remove chat from project";
      })

      .addMatcher(
        isAnyOf(logoutUser.fulfilled, refreshError, refreshUser.rejected),
        (state) => {
          state.list = [];
          state.status = "idle";
          state.error = null;
          state.pinMutations = {};
        },
      ),
});

export const { renameProject } = projectsSlice.actions;

export const projectsReducer = projectsSlice.reducer;
