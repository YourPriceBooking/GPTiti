import React from "react";

export interface CustomScrollBarProps {
  scrollTargetClass: string;
}

export type ChatRole = "user" | "assistant";

export type Message = {
  id?: string;
  role: ChatRole;
  content: string;
  tokens?: number;
  images?: string[];
  modelId?: string;
  streaming?: boolean;
};

export type Chat = {
  id: string;
  title: string | null;
  messages: Message[];
  messagesLoaded?: boolean;
  modelId?: string;
  lastMessageAt?: string;
};

export type Project = {
  id: string;
  title: string;
};

export type ModelType =
  | "gpt-4o"
  | "gpt-5.1"
  | "gpt-5.4"
  | "gpt-5.5"
  | "0-Series"
  | "AI tools";

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
};

export type SectionGptChatsProps = Pick<
  LeftSideProps,
  "onNewChat" | "onNewProject" | "projectList" | "chatList" | "setActiveChatId" | "deleteChat" | "renameChat"
> & {
  setActiveProject?: (id: string) => void;
  deleteProject?: (id: string) => void;
  renameProject?: (id: string, title: string) => void;
};

export type MainSectionRightSideProps = {
  insertTemplate: (text: string) => void;
  setFocusMode: React.Dispatch<React.SetStateAction<boolean>>;
  focusMode: boolean;
  isSectionVisible: boolean;
  hasInput: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: (message: string, imageUrls?: string[], imageFiles?: File[]) => void;
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
