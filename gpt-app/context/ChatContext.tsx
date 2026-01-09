"use client";
import { createContext, useContext, useState, useRef } from "react";
import { Chat} from "@/types/types";
import { ChatContextType } from "@/types/shared";
import { generateAIResponse } from "@/components/HomePage/RightSide/AIResponse/AIResponse";

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const initialChatId = crypto.randomUUID();
  const [chatList, setChatList] = useState<Chat[]>([
    { id: initialChatId, title: null, messages: [] },
  ]);
  const [activeChatId, setActiveChatId] = useState<string | null>(initialChatId);

  const [hasInput, setHasInput] = useState(false);
  const [inputSent, setInputSent] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [templateTick, setTemplateTick] = useState(0);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement | null>) {
    setHasInput(e.target.value.trim().length > 0);
  }

  async function handleSendClick(hasFirstRequest: boolean) {
    if (!hasInput || !inputRef.current) return;
    const userText = inputRef.current.value.trim();
    if (!userText) return;

    setChatList((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              title: chat.title ?? userText,
              messages: [...chat.messages, { user: userText, ai: null }],
            }
          : chat
      )
    );

    setInputSent(true);
    setHasInput(false);
    setIsTyping(true);
    inputRef.current.value = "";

    const delay = Math.random() * 1000 + 1500;
    await new Promise((resolve) => setTimeout(resolve, delay));

    const aiResponse = generateAIResponse(userText, hasFirstRequest);
    const usedTokens = Math.floor(Math.random() * 100) + 50;

    setChatList((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                { user: "", ai: aiResponse, tokens: usedTokens },
              ],
            }
          : chat
      )
    );

    setIsTyping(false);
  }

  function handleNewChat() {
    const newChatId = crypto.randomUUID();
    const newChat: Chat = { id: newChatId, title: null, messages: [] };
    setChatList((prev) => [...prev, newChat]);
    setActiveChatId(newChatId);
    setHasInput(false);
    setInputSent(false);
    setIsTyping(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function deleteChat(chatId: string) {
    setChatList((prev) => prev.filter((chat) => chat.id !== chatId));
    if (activeChatId === chatId) setActiveChatId(null);
  }

  function renameChat(chatId: string, newTitle: string) {
    setChatList((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      )
    );
  }

  function insertTemplate(template: string) {
    if (!inputRef.current) return;
    inputRef.current.value = template;
    inputRef.current.scrollTop = 0;
    setHasInput(template.trim().length > 0);
    setTemplateTick((t) => t + 1);
    inputRef.current.focus();
  }

  const activeChat = chatList.find((chat) => chat.id === activeChatId);

  return (
    <ChatContext.Provider
      value={{
        chatList,
        activeChatId,
        activeChat,
        setActiveChatId,
        handleNewChat,
        deleteChat,
        renameChat,
        hasInput,
        inputSent,
        isTyping,
        inputRef,
        templateTick,
        handleChange,
        handleSendClick,
        insertTemplate,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within ChatProvider");
  }
  return context;
}
