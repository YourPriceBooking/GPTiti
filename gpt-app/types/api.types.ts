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

export interface Conversation {
  id: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
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