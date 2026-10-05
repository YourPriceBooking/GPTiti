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

export interface TokenOperation {
  id: string;
  kind: string;
  status: "pending" | "confirmed" | "failed";
  source: string;
  transactionHash?: string | null;
}

export interface ClaimTokenResponse {
  userId?: string;
  balanceVersion?: number;
  operation?: TokenOperation;
  code: number;
  success: boolean;
  message: string;
  nextClaimDate: string;
  appTokens: number;
}

export interface TokenTransferErrorResponse {
  success: false;
  code?: string;
  message?: string;
  appTokens?: number;
  userId?: string;
  balanceVersion?: number;
}

export type TokenTransferRecipientResponse =
  | {
      success: true;
      canTransfer: boolean;
      recipient: { email: string; status: "active" | "blocked" };
      appTokens: number;
      userId?: string;
      balanceVersion?: number;
      operation?: TokenOperation | null;
      message?: string;
      code?: string;
    }
  | TokenTransferErrorResponse;

export interface SendTokensPayload {
  email: string;
  amount: number;
  clientTransferId: string;
}

export type SendTokensResponse =
  | {
      success: true;
      alreadyApplied: boolean;
      appTokens: number;
      userId?: string;
      balanceVersion?: number;
      operation?: TokenOperation | null;
      message?: string;
    }
  | TokenTransferErrorResponse;

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
