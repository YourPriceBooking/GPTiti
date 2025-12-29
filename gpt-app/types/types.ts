import React, { ReactElement } from "react";
import { ModelProps } from "./shared";

export interface CustomScrollBarProps {
  scrollTargetClass: string;
}

export type Message = {
  user: string;
  ai: ReactElement;
};

export type Chat = {
  id: string;
  title: string | null;
  messages: Message[];
};

export type ModelType = "GPT-4o" | "GPT-5.1" | "0-Series";

export type ModelItem = {
  title: string;
  tokens: number;
  desc: string;
};

export type ModelConfig = {
  list: ModelItem[];
};

export type ModelMode = "idle" | "hover" | "click";

export type LeftSideProps = {
  onNewChat: () => void;
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
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export type SectionGptChatsProps = Pick<
  LeftSideProps,
  "onNewChat" | "chatList" | "setActiveChatId" | "deleteChat" | "renameChat"
>;

export type TokensContextType = {
  balance: number;
  countdown: string;
  handleClaim: () => void;
};

export type MainSectionRightSideProps = {
  insertTemplate: (text: string) => void;
  setFocusMode: React.Dispatch<React.SetStateAction<boolean>>;
  focusMode: boolean;

  isSectionVisible: boolean; // ✅ додали

  hasInput: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: () => void; // ✅ було (message: string) — у тебе фактично void
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  onHideSection: () => void;
  templateTick: number;

  // ✅ додали для логіки quick actions / first request
  setHasFirstRequest: React.Dispatch<React.SetStateAction<boolean>>;
  hasFirstRequest: boolean;

  // ✅ додали, щоб TS не сварився
  isOverlay?: boolean;
};

export type ModelModalOverlayProps = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  selectedModelGroup: ModelType;
  setSelectedModelGroup: (group: ModelType) => void;
};

export type ModelGptitiTitleWithIconProps = {
  modelRef: React.RefObject<HTMLDivElement | null>;
  selectedModel: string;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface HeaderRightSideProps {
  chatTitle: string | null | undefined;
  modelRef: React.RefObject<HTMLDivElement | null>;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  selectedModelGroup: ModelType;
  setSelectedModelGroup: (group: ModelType) => void;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
