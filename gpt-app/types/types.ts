import React from "react";
import type { ProjectConversation, UploadedFile } from "@/types/api.types";

export interface CustomScrollBarProps {
  scrollTargetClass: string;
}

export type ChatRole = "user" | "assistant";

export type ChatDeliveryStatus = "sending" | "accepted" | "failed";

export type PendingChatTurnStatus =
  | "awaiting_ack"
  | "queued"
  | "processing"
  | "syncing"
  | "completed"
  | "failed"
  | "delivery_unknown";

export type PendingChatTurn = {
  clientMessageId: string;
  turnId: string | null;
  conversationId: string;
  modelId: string;
  message: string;
  files: UploadedFile[];
  localFileFingerprints: string[];
  status: PendingChatTurnStatus;
  attempt: number;
  lastAppliedSeq: number;
  partialContent: string;
  retryable: boolean;
  errorCode?: string;
  errorMessage?: string;
  createdAt: string;
};

export type Message = {
  id?: string;
  role: ChatRole;
  content: string;
  tokens?: number;
  images?: string[];
  modelId?: string;
  updatedAt?: string;
  streaming?: boolean;
  error?: string;
  errorCode?: string;
  retryable?: boolean;
  clientMessageId?: string;
  turnId?: string;
  attempt?: number;
  deliveryStatus?: ChatDeliveryStatus;
};

export type ChatProject = {
  id: string;
  title: string;
  icon?: string;
  color?: string;
};

export type MessagesStatus = "idle" | "loading" | "loaded" | "error";

export type Chat = {
  id: string;
  title: string | null;
  messages: Message[];
  messagesStatus: MessagesStatus;
  preview?: string;
  modelId?: string;
  lastMessageAt?: string;
  createdAt?: string;
  project?: ChatProject;
  pinnedAt: string | null;
};

export type Project = {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  color?: string;
  defaultModel?: string;
  systemPrompt?: string;
  archived?: boolean;
  conversationCount?: number;
  conversationIds?: ProjectConversation[];
  lastActivityAt?: string;
  createdAt?: string;
  pinnedAt: string | null;
};

export type ModelType =
  "gpt-4o" | "gpt-5.1" | "gpt-5.4" | "gpt-5.5" | "0-Series" | "AI tools";

export type ModelTooltip = {
  title: string;
  intro: string;
  pros: string[];
  cons: string[];
};

export type ModelItem = {
  title: string;
  tokens: number;
  desc: string;
  subDesc?: string;
  tooltip: ModelTooltip;
  unit?: string;
  amount?: string;
};

export type ModelConfig = {
  list: ModelItem[];
};

export type ModelMode = "idle" | "hover" | "click";

export type LeftSideProps = {
  onNewChat: () => void;
  onNewProject?: () => void;
  projectList?: Project[];
  chatList: Chat[];
  setActiveChatId: (id: string) => void;

  deleteChat: (id: string) => void;
  renameChat: (id: string, newTitle: string) => void;

  modelRef: React.RefObject<HTMLDivElement | null>;
  modelMode: ModelMode;
  setModelMode: React.Dispatch<React.SetStateAction<ModelMode>>;

  selectedModel: string;
  setSelectedModel: (model: string) => void;

  selectedModelGroup: ModelType;
  setSelectedModelGroup: (group: ModelType) => void;

  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;

  /** Optional: fires after a project is selected (used to close the mobile drawer). */
  onSelectProject?: () => void;
};

export type SectionGptChatsProps = Pick<
  LeftSideProps,
  | "onNewChat"
  | "onNewProject"
  | "projectList"
  | "chatList"
  | "setActiveChatId"
  | "deleteChat"
  | "renameChat"
> & {
  setActiveProject?: (id: string) => void;
  deleteProject?: (id: string) => void;
  renameProject?: (id: string, title: string) => void;
  addChatsToProject?: (id: string) => void;
};

export type MainSectionRightSideProps = {
  insertTemplate: (text: string) => void;
  setFocusMode: React.Dispatch<React.SetStateAction<boolean>>;
  focusMode: boolean;
  isSectionVisible: boolean;
  hasInput: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: (
    message: string,
    imageUrls?: string[],
    imageFiles?: File[],
  ) => Promise<boolean>;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  onHideSection: () => void;
  templateTick: number;
  setHasFirstRequest: React.Dispatch<React.SetStateAction<boolean>>;
  hasFirstRequest: boolean;
  isOverlay?: boolean;
  selectedModel: string;
  onImagesChange?: (count: number) => void;
  showEstimate: boolean;
  onChooseModel: () => void;
  estimateSupported?: boolean;
  estimatedTokens?: number | null;
  sendDisabled?: boolean;
};

export type ModelModalOverlayProps = {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  selectedModelGroup: ModelType;
  setSelectedModelGroup: (group: ModelType) => void;
};

export type ModelGptitiTitleWithIconProps = {
  modelRef: React.RefObject<HTMLDivElement | null>;
  selectedModel: string;
  setIsModalOpen: (open: boolean) => void;
};

export type SectionGptTokensProps = {
  selectedModel: string;
  modelRef: React.RefObject<HTMLDivElement | null>;
  modelMode: ModelMode;
  setModelMode: React.Dispatch<React.SetStateAction<ModelMode>>;
  selectedModelGroup: ModelType;
  setSelectedModel: (model: string) => void;
  setSelectedModelGroup: (group: ModelType) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
};

export interface HeaderRightSideProps {
  chatTitle: string | null | undefined;
  modelRef: React.RefObject<HTMLDivElement | null>;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  selectedModelGroup: ModelType;
  setSelectedModelGroup: (group: ModelType) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

export type SecondHeaderRightSideProps = Pick<
  HeaderRightSideProps,
  "chatTitle"
>;

export type Plan = {
  id: string;
  tokens: number;
  price: number;
  subtitle: string;
  badge?: string | null;
  saveText?: string | null;
};
