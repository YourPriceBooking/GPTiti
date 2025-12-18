import { ReactElement } from "react"

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

export type ModelType = 'GPT-4o' | 'GPT-5.1' | '0-Series';

export type ModelItem = {
  title: string;
  tokens: number;
  desc: string;
};

export type ModelConfig = {
  list: ModelItem[];
};

export type ModelMode = 'idle' | 'hover' | 'click';

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
};

export type SectionGptChatsProps = Pick<
  LeftSideProps,
  'onNewChat' | 'chatList' | 'setActiveChatId' | 'deleteChat' | 'renameChat'
>;
export type SectionGptTokensProps = Pick<
  LeftSideProps,
  | 'modelRef'
  | 'modelMode'
  | 'setModelMode'
  | 'selectedModel'
  | 'setSelectedModel'
  | 'selectedModelGroup'
  | 'setSelectedModelGroup'
  >;

export type TokensContextType = {
  balance: number;
  countdown: string;
  handleClaim: () => void;
};
