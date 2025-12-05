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