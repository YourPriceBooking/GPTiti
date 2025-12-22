"use client";

import styles from './page.module.css';
import LeftSide from '@/components/HomePage/LeftSide/LeftSide';
import MessageList from '@/components/HomePage/RightSide/MessageList/MessageList';
import InputBar from '@/components/HomePage/RightSide/InputBar/InputBar';
import { useChat } from '@/hooks/useChat';
import { useModelMode } from '@/hooks/useModelMode';
import { useState, useRef, useEffect } from 'react';
import { ModelType } from '@/types/types';
import HeaderRightSide from '@/components/HomePage/RightSide/HeaderRightSide/HeaderRightSide';
import MainSectionRightSide from '@/components/HomePage/RightSide/MainSectionRightSide/MainSectionRightSide';



export default function Home() {
  const {
    chatList,
    activeChat,
    setActiveChatId,
    hasInput,
    inputSent,
    inputRef,
    insertTemplate,
    handleChange,
    handleSendClick,
    handleNewChat,
    deleteChat,
    renameChat,
  } = useChat();
  

  const { modelMode, setModelMode, modelRef } = useModelMode();

  const [selectedModelGroup, setSelectedModelGroup] = useState<ModelType>('GPT-4o');
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4o-mini');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatList, activeChat]);

  return (
    <>
      {modelMode === 'click' && (
        <div className={styles.backdrop} onClick={() => setModelMode('idle')} />
      )}

      <div className={styles.appContainer}>
        <LeftSide
          onNewChat={handleNewChat}
          chatList={chatList}
          setActiveChatId={setActiveChatId}
          deleteChat={deleteChat}
          renameChat={renameChat}
          modelRef={modelRef}
          modelMode={modelMode}
          setModelMode={setModelMode}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          selectedModelGroup={selectedModelGroup}
          setSelectedModelGroup={setSelectedModelGroup}
          />

        <div className={styles.rightSection}>
          <HeaderRightSide chatTitle = {activeChat?.title}/>
          <MainSectionRightSide insertTemplate={insertTemplate}/>
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
      </>
  );
}