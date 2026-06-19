import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Project } from "@/types/types";

interface ProjectsState {
  list: Project[];
}

const initialState: ProjectsState = {
  list: [],
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    addProject(state, { payload }: PayloadAction<Project>) {
      state.list.unshift(payload);
    },
    removeProject(state, { payload }: PayloadAction<string>) {
      state.list = state.list.filter((p) => p.id !== payload);
    },
    renameProject(
      state,
      { payload }: PayloadAction<{ id: string; title: string }>,
    ) {
      const project = state.list.find((p) => p.id === payload.id);
      if (project) project.title = payload.title;
    },
  },
});

export const { addProject, removeProject, renameProject } =
  projectsSlice.actions;

export const projectsReducer = projectsSlice.reducer;
