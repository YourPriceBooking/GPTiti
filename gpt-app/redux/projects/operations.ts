import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/helpers/api";
import type {
  ApiProject,
  CreateProjectPayload,
  UpdateProjectPayload,
} from "@/types/api.types";
import type { Project } from "@/types/types";

const errMessage = (e: unknown, fallback: string) => {
  const err = e as { response?: { data?: { message?: string } } };
  return err.response?.data?.message ?? fallback;
};

const normalizeProject = (p: ApiProject): Project => ({
  id: p._id,
  title: p.title,
  description: p.description,
  icon: p.icon,
  color: p.color,
  defaultModel: p.defaultModel,
  systemPrompt: p.systemPrompt,
  archived: p.archived,
  conversationCount: p.conversationCount,
  conversationIds: p.conversations,
  lastActivityAt: p.lastActivityAt,
});

/** Load the user's project list for the sidebar. */
export const fetchProjects = createAsyncThunk<
  Project[],
  void,
  { rejectValue: string }
>("projects/fetchProjects", async (_, thunkApi) => {
  try {
    const projects = await api.getProjects();
    return projects.map(normalizeProject);
  } catch (e) {
    return thunkApi.rejectWithValue(errMessage(e, "Failed to load projects"));
  }
});

/** Create a new project on the server. */
export const createProject = createAsyncThunk<
  Project,
  CreateProjectPayload,
  { rejectValue: string }
>("projects/createProject", async (payload, thunkApi) => {
  try {
    const project = await api.createProject(payload);
    return normalizeProject(project);
  } catch (e) {
    return thunkApi.rejectWithValue(errMessage(e, "Failed to create project"));
  }
});

/** Update a project (title, description, archived, …) and reconcile the store. */
export const updateProject = createAsyncThunk<
  Project,
  { id: string; changes: UpdateProjectPayload },
  { rejectValue: string }
>("projects/updateProject", async ({ id, changes }, thunkApi) => {
  try {
    const project = await api.updateProject(id, changes);
    return normalizeProject(project);
  } catch (e) {
    return thunkApi.rejectWithValue(errMessage(e, "Failed to update project"));
  }
});

/** Delete a project on the server, then remove it locally. */
export const removeProject = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("projects/removeProject", async (id, thunkApi) => {
  try {
    await api.deleteProject(id);
    return id;
  } catch (e) {
    return thunkApi.rejectWithValue(errMessage(e, "Failed to delete project"));
  }
});

/** Load a single project with its attached conversation ids. */
export const fetchProject = createAsyncThunk<
  Project,
  string,
  { rejectValue: string }
>("projects/fetchProject", async (id, thunkApi) => {
  try {
    const project = await api.getProject(id);
    return normalizeProject(project);
  } catch (e) {
    return thunkApi.rejectWithValue(errMessage(e, "Failed to load project"));
  }
});

/** Attach existing conversations to a project. */
export const addProjectConversations = createAsyncThunk<
  { projectId: string; conversationIds: string[] },
  { projectId: string; conversationIds: string[] },
  { rejectValue: string }
>(
  "projects/addConversations",
  async ({ projectId, conversationIds }, thunkApi) => {
    try {
      await api.addProjectConversations(projectId, conversationIds);
      return { projectId, conversationIds };
    } catch (e) {
      return thunkApi.rejectWithValue(
        errMessage(e, "Failed to add chats to project"),
      );
    }
  },
);

/** Detach a single conversation from a project. */
export const removeProjectConversation = createAsyncThunk<
  { projectId: string; conversationId: string },
  { projectId: string; conversationId: string },
  { rejectValue: string }
>(
  "projects/removeConversation",
  async ({ projectId, conversationId }, thunkApi) => {
    try {
      await api.removeProjectConversation(projectId, conversationId);
      return { projectId, conversationId };
    } catch (e) {
      return thunkApi.rejectWithValue(
        errMessage(e, "Failed to remove chat from project"),
      );
    }
  },
);
