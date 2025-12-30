import { useState, useRef } from "react";
import { Chat } from "@/types/types";
import { generateAIResponse } from "@/components/HomePage/RightSide/AIResponse/AIReaponse";

export function useChat() {
  const initialChatId = crypto.randomUUID();
  const [chatList, setChatList] = useState<Chat[]>([
    { id: initialChatId, title: null, messages: [] },
  ]);
  const [activeChatId, setActiveChatId] = useState<string | null>(
    initialChatId
  );
  const [hasInput, setHasInput] = useState(false);
  const [inputSent, setInputSent] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [templateTick, setTemplateTick] = useState(0);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setHasInput(e.target.value.trim().length > 0);
  }

  async function handleSendClick() {
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
    const aiResponse = generateAIResponse(userText);

    setChatList((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: chat.messages.map((msg, idx) =>
                idx === chat.messages.length - 1
                  ? { ...msg, ai: aiResponse }
                  : msg
              ),
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
    if (activeChatId === chatId) {
      setActiveChatId(null);
    }
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

  return {
    chatList,
    activeChat,
    activeChatId,
    setActiveChatId,
    hasInput,
    inputSent,
    isTyping,
    inputRef,
    insertTemplate,
    templateTick,
    handleChange,
    handleSendClick,
    handleNewChat,
    deleteChat,
    renameChat,
  };
}
