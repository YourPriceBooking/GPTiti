import { axiosInstance } from "@/lib/axiosInstance";
import type {
  Conversation,
  ConversationMessage,
  ClaimTokenResponse,
  UploadFileResponse,
  ApiProject,
  CreateProjectPayload,
  UpdateProjectPayload,
  AddProjectConversationsResponse,
  RemoveProjectConversationResponse,
} from "@/types/api.types";

export const api = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axiosInstance.post<UploadFileResponse>(
      "/upload",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return res.data;
  },
  createConversation: async (modelId: string, title?: string) => {
    const res = await axiosInstance.post<Conversation>("/conversations", {
      title,
      modelId,
    });
    return res.data;
  },
  getConversations: async () => {
    const res = await axiosInstance.get<Conversation[]>("/conversations");
    return res.data;
  },
  deleteConversation: async (id: string) => {
    const res = await axiosInstance.delete<{ success: boolean }>(
      `/conversations/${id}`,
    );
    return res.data;
  },
  renameConversation: async (id: string, title: string) => {
    const res = await axiosInstance.patch(
      "/conversations/rename-conversation",
      {
        id,
        title,
      },
    );
    return res.data;
  },
  getConversationMessages: async (id: string, signal?: AbortSignal) => {
    const res = await axiosInstance.get<ConversationMessage[]>(
      `/conversations/${id}/messages`,
      { signal, timeout: 15_000 },
    );
    return res.data;
  },
  claimToken: async () => {
    const res =
      await axiosInstance.post<ClaimTokenResponse>("/users/claim-token");
    return res.data;
  },
  getProjects: async () => {
    const res = await axiosInstance.get<ApiProject[]>("/project/");
    return res.data;
  },
  getProject: async (id: string) => {
    const res = await axiosInstance.get<ApiProject>(`/project/${id}`);
    return res.data;
  },
  createProject: async (payload: CreateProjectPayload) => {
    const res = await axiosInstance.post<ApiProject>("/project/", payload);
    return res.data;
  },
  updateProject: async (id: string, payload: UpdateProjectPayload) => {
    const res = await axiosInstance.patch<ApiProject>(`/project/${id}`, payload);
    return res.data;
  },
  deleteProject: async (id: string) => {
    const res = await axiosInstance.delete<{ success: boolean }>(
      `/project/${id}`,
    );
    return res.data;
  },
  addProjectConversations: async (id: string, conversationIds: string[]) => {
    const res = await axiosInstance.post<AddProjectConversationsResponse>(
      `/project/${id}/conversations`,
      { conversationIds },
    );
    return res.data;
  },
  removeProjectConversation: async (
    projectId: string,
    conversationId: string,
  ) => {
    const res = await axiosInstance.delete<RemoveProjectConversationResponse>(
      `/project/${projectId}/conversations/${conversationId}`,
    );
    return res.data;
  },
};
