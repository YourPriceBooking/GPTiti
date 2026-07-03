export interface UsageSummaryResponse {
  totalTokens: number;
  totalUsd: number;
  usage: Array<{ model: string; tokens: number; usd: number }>;
}

export interface UsageHistoryItem {
  date: string;
  tokens: number;
  usd: number;
}

export interface ChatPreviewRequest {
  model: string;
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
}

export interface ChatPreviewResponse {
  estimatedTokens: number;
  estimatedUsd: number;
  canProceed: boolean;
  balance: number;
}

export interface ChatStreamRequest {
  model: string;
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
  conversationId?: string;
}

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

export interface Conversation {
  _id: string;
  title: string | null;
  modelId?: string;
  summary?: string;
  archived?: boolean;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ConversationMessage {
  _id: string;
  role: "user" | "assistant";
  content: string;
  modelId?: string;
  tokens?: number;
  createdAt: string;
}

export interface ChatHistoryMessage {
  _id: string;
  role: "user" | "assistant";
  content: string;
  modelId: string;
  createdAt: string;
}

export interface ChatHistoryResponse {
  messages: ChatHistoryMessage[];
}

export interface UploadResponse {
  success: boolean;
  file: {
    url: string;
    publicId: string;
    mimetype: string;
    size: number;
    originalName: string;
    expiresAt: string;
  };
}

export interface ClaimTokenResponse {
  code: number;
  success: boolean;
  message: string;
  nextClaimDate: string;
  appTokens: number;
}

export interface PricePackage {
  id: string;
  tokens: number;
  price: number;
  currency: string;
}

export interface CheckoutResponse {
  checkoutUrl: string;
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
  conversationCount?: number;
  conversations?: string[];
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
