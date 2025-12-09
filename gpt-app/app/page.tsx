"use client";

import { useRef, useState, useEffect } from 'react';
import LeftSide from '@/components/HomePage/LeftSide/LeftSide';
import styles from './page.module.css';
import { Chat, ModelType } from '@/types/types';
import MessageList from '@/components/HomePage/RightSide/MessageList/MessageList';
import InputBar from '@/components/HomePage/RightSide/InputBar/InputBar';
import { generateAIResponse } from '@/components/HomePage/RightSide/AIResponse/AIReaponse';

type ModelMode = 'idle' | 'hover' | 'click';

export default function Home() {
  const [hasInput, setHasInput] = useState(false);
  const [inputSent, setInputSent] = useState(false);

  const [selectedModel, setSelectedModel] = useState<ModelType>('GPT-4o');
  const [modelMode, setModelMode] = useState<ModelMode>('idle');

  const initialChatId = crypto.randomUUID();
  const [chatList, setChatList] = useState<Chat[]>([
    { id: initialChatId, title: null, messages: [] }
  ]);
  const [activeChatId, setActiveChatId] = useState<string | null>(initialChatId);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const modelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatList, activeChatId]);

  // close popup on outside click
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (
        modelRef.current &&
        !modelRef.current.contains(e.target as Node)
      ) {
        setModelMode('idle');
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

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
    const newChat: Chat = {
      id: newChatId,
      title: null,
      messages: []
    };

    setChatList(prev => [...prev, newChat]);
    setActiveChatId(newChatId);
    setHasInput(false);
    setInputSent(false);
    if (inputRef.current) inputRef.current.value = '';
  }

  const activeChat = chatList.find(chat => chat.id === activeChatId);

  return (
    <div className={styles.appContainer}>
      <LeftSide
        onNewChat={handleNewChat}
        chatList={chatList}
        setActiveChatId={setActiveChatId}

        modelRef={modelRef}
        modelMode={modelMode}
        setModelMode={setModelMode}

        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />

      <div className={styles.rightSection}>
        {activeChat && activeChat.messages.length > 0 && (
          <MessageList messages={activeChat.messages} />
        )}

        <div className={inputSent ? styles.inputBottom : styles.inputWrapper}>
          <InputBar
            hasInput={hasInput}
            onChange={handleChange}
            onSend={handleSendClick}
            inputRef={inputRef}
          />

          {inputSent && (
            <div className={styles.spanContainer}>
              <span className={styles.inputSpan}>
                AI systems may make mistakes, so we recommend verifying important information.
              </span>
            </div>
          )}
        </div>

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}