import { useState, useRef } from 'react';
import { Chat } from '@/types/types';
import { generateAIResponse } from '@/components/HomePage/RightSide/AIResponse/AIReaponse';

export function useChat() {
  const initialChatId = crypto.randomUUID();
  const [chatList, setChatList] = useState<Chat[]>([
    { id: initialChatId, title: null, messages: [] }
  ]);
  const [activeChatId, setActiveChatId] = useState<string | null>(initialChatId);
  const [hasInput, setHasInput] = useState(false);
  const [inputSent, setInputSent] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setHasInput(e.target.value.trim().length > 0);
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  function handleSendClick() {
    if (!hasInput || !inputRef.current) return;

    const userText = inputRef.current.value.trim();
    if (!userText) return;

    const aiResponse = generateAIResponse(userText);
    const newMessage = { user: userText, ai: aiResponse };

    setChatList(prev =>
      prev.map(chat =>
        chat.id === activeChatId
          ? {
              ...chat,
              title: chat.title ?? userText,
              messages: [...chat.messages, newMessage]
            }
          : chat
      )
    );

    setInputSent(true);
    setHasInput(false);
    inputRef.current.value = '';
  }

  function handleNewChat() {
    const newChatId = crypto.randomUUID();
    const newChat: Chat = { id: newChatId, title: null, messages: [] };

    setChatList(prev => [...prev, newChat]);
    setActiveChatId(newChatId);
    setHasInput(false);
    setInputSent(false);

    if (inputRef.current) inputRef.current.value = '';
  }
  function deleteChat(chatId: string) {
    setChatList(prev => prev.filter(chat => chat.id !== chatId));
    if (activeChatId === chatId) {
      setActiveChatId(null); 
    }
  }

  
  function renameChat(chatId: string, newTitle: string) {
    setChatList(prev =>
      prev.map(chat =>
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      )
    );
  }

  const activeChat = chatList.find(chat => chat.id === activeChatId);

  return {
    chatList,
    activeChat,
    activeChatId,
    setActiveChatId,
    hasInput,
    inputSent,
    inputRef,
    handleChange,
    handleSendClick,
    handleNewChat,
    deleteChat,
    renameChat,
  };
}