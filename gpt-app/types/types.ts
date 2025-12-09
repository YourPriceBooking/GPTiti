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