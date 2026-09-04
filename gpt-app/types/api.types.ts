export interface UploadedFile {
  url: string;
  publicId: string;
  mimetype: string;
  size: number;
  originalName: string;
  expiresAt: string;
}

export interface UploadFileResponse {
  success: boolean;
  file: UploadedFile;
}

export interface ConversationProject {
  _id: string;
  title: string;
  icon?: string;
  color?: string;
}

export interface Conversation {
  _id: string;
  title: string | null;
  modelId?: string;
  summary?: string;
  archived?: boolean;
  project?: ConversationProject | null;
  lastMessageAt?: string;
  pinnedAt: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface ConversationMessage {
  _id: string;
  role: "user" | "assistant";
  content: string;
  modelId?: string;
  tokens?: number;
  clientMessageId?: string | null;
  turnId?: string | null;
  attempt?: number | null;
  createdAt: string;
  updatedAt?: string;
}

export interface ClaimTokenResponse {
  code: number;
  success: boolean;
  message: string;
  nextClaimDate: string;
  appTokens: number;
}

export interface ProjectConversation {
  _id: string;
  user?: string;
  title: string | null;
  modelId?: string;
  summary?: string;
  archived?: boolean;
  project?: string;
  lastMessageAt?: string;
  pinnedAt: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiProject {
  _id: string;
  user: string;
  title: string;
  description?: string;
  icon?: string;
  color?: string;
  defaultModel?: string;
  systemPrompt?: string;
  archived: boolean;
  deleted: string | null;
  lastActivityAt: string;
  createdAt: string;
  updatedAt: string;
  pinnedAt: string | null;
  conversationCount?: number;
  conversations?: ProjectConversation[];
}

export interface CreateProjectPayload {
  title: string;
  description?: string;
  icon?: string;
  color?: string;
  defaultModel?: string;
  systemPrompt?: string;
}

export type UpdateProjectPayload = Partial<CreateProjectPayload> & {
  archived?: boolean;
  pinned?: boolean;
};

export interface AddProjectConversationsResponse {
  success: boolean;
  modified: number;
}

export interface RemoveProjectConversationResponse {
  success: boolean;
  message: string;
  conversationId: string;
}
