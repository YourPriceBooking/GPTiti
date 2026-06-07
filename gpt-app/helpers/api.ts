import { axiosInstance } from "@/lib/axiosInstance";
import { BackendAuthResponse } from "@/types/google.types";
import type {
  UsageSummaryResponse,
  UsageHistoryItem,
  ChatPreviewRequest,
  ChatPreviewResponse,
  ChatStreamRequest,
  ChatHistoryResponse,
  Conversation,
  ConversationMessage,
  PricePackage,
  CheckoutResponse,
  ClaimTokenResponse,
  UploadFileResponse,
} from "@/types/api.types";

export const api = {
  loginWithGoogle: async (googleToken: string) => {
    try {
      const res = await axiosInstance.post<BackendAuthResponse>("/users/user", {
        idToken: googleToken,
      });
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error("Invalid Google token");
      }
      if (error.response?.status === 500) {
        throw new Error("Server error, please try again later");
      }
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },
  loginWithGoogleCode: async (code: string) => {
    const res = await axiosInstance.post("/users/google/code", { code });
    return res.data;
  },
  getUsageSummary: async () => {
    const res = await axiosInstance.get<UsageSummaryResponse>(
      "/users/usage/summary",
    );
    return res.data;
  },
  getUsageHistory: async (days: number = 7) => {
    const res = await axiosInstance.get<UsageHistoryItem[]>(
      `/users/usage/history?days=${days}`,
    );
    return res.data;
  },
  chatPreview: async (data: ChatPreviewRequest) => {
    const res = await axiosInstance.post<ChatPreviewResponse>(
      "/chat/preview",
      data,
    );
    return res.data;
  },
  chatStream: async (data: ChatStreamRequest) => {
    const res = await axiosInstance.post("/chat/stream", data, {
      responseType: "stream",
    });
    return res.data;
  },
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
  getConversationMessages: async (id: string) => {
    const res = await axiosInstance.get<ConversationMessage[]>(
      `/conversations/${id}/messages`,
    );
    return res.data;
  },
  getChatHistory: async () => {
    const res = await axiosInstance.get<ChatHistoryResponse>("/chat/history");
    return res.data;
  },
  regenerateLastMessage: async (conversationId: string, model: string) => {
    const res = await axiosInstance.post(
      `/conversations/${conversationId}/regenerate`,
      { model },
    );
    return res.data;
  },
  forkConversation: async (conversationId: string, messageId: string) => {
    const res = await axiosInstance.post<{ conversationId: string }>(
      `/conversations/${conversationId}/fork`,
      { messageId },
    );
    return res.data;
  },
  editAndRegenerate: async (
    messageId: string,
    newContent: string,
    model: string,
  ) => {
    const res = await axiosInstance.post(
      `/messages/${messageId}/edit-and-regenerate`,
      { newContent, model },
    );
    return res.data;
  },
  getBillingPrices: async () => {
    const res = await axiosInstance.get<PricePackage[]>("/billing/prices");
    return res.data;
  },
  createCheckout: async (packageId: string) => {
    const res = await axiosInstance.post<CheckoutResponse>(
      "/billing/checkout",
      { packageId },
    );
    return res.data;
  },
  adminGetModels: async () => {
    const res = await axiosInstance.get("/admin/models");
    return res.data;
  },

  adminGetUsers: async () => {
    const res = await axiosInstance.get("/admin/users");
    return res.data;
  },

  adminBlockUser: async (userId: number) => {
    const res = await axiosInstance.post(`/admin/users/${userId}/block`);
    return res.data;
  },

  adminGetAnalytics: async () => {
    const res = await axiosInstance.get("/admin/analytics/models");
    return res.data;
  },
  refreshAccessToken: async () => {
    try {
      const res = await axiosInstance.post<{ accessToken: string }>(
        "/users/refresh",
      );
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error("Session expired, please login again");
      }
      throw new Error("Failed to refresh token");
    }
  },
  logout: async () => {
    try {
      await axiosInstance.get("/users/logout");
    } catch (error) {
      console.warn("Logout request failed:", error);
    }
  },
  claimToken: async () => {
    const res =
      await axiosInstance.post<ClaimTokenResponse>("/users/claim-token");
    return res.data;
  },
};
