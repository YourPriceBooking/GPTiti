import { createSlice, isAnyOf, type PayloadAction } from "@reduxjs/toolkit";
import type { Project, ProjectConversation } from "@/types/types";
import {
  fetchProjects,
  createProject,
  updateProject,
  removeProject,
  fetchProject,
  addProjectConversations,
  removeProjectConversation,
} from "./operations";
import { logoutUser, refreshUser } from "../auth/operations";
import { refreshError } from "../auth/slice";

interface ProjectsState {
  list: Project[];
  status: "idle" | "loading" | "error";
  error: string | null;
}

const initialState: ProjectsState = {
  list: [],
  status: "idle",
  error: null,
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
        state.status = "idle";
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
          .map((id) => ({ _id: id, title: null }));
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
        },
      ),
});

export const { renameProject } = projectsSlice.actions;

export const projectsReducer = projectsSlice.reducer;
