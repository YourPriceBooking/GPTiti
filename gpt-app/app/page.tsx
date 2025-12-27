"use client";
import styles from "./page.module.css";
import LeftSide from "@/components/HomePage/LeftSide/LeftSide";
import MessageList from "@/components/HomePage/RightSide/MessageList/MessageList";
import InputBar from "@/components/HomePage/RightSide/InputBar/InputBar";
import { useChat } from "@/hooks/useChat";
import { useModelMode } from "@/hooks/useModelMode";
import { useState, useRef, useEffect } from "react";
import { ModelType } from "@/types/types";
import HeaderRightSide from "@/components/HomePage/RightSide/HeaderRightSide/HeaderRightSide";
import MainSectionRightSide from "@/components/HomePage/RightSide/MainSectionRightSide/MainSectionRightSide";
import ModelModalOverlay from "@/components/ModelModalOverlay/ModelModalOverlay";
export default function Home() {
  const {
    chatList,
    activeChat,
    setActiveChatId,
    hasInput,
    inputSent,
    inputRef,
    insertTemplate,
    templateTick,
    handleChange,
    handleSendClick,
    handleNewChat,
    deleteChat,
    renameChat,
  } = useChat();

  const { modelMode, setModelMode, modelRef } = useModelMode();
  const [selectedModelGroup, setSelectedModelGroup] =
    useState<ModelType>("GPT-4o");
  const [selectedModel, setSelectedModel] = useState<string>("gpt-4o-mini");
  const [focusMode, setFocusMode] = useState(false);
  const [isSectionVisible, setIsSectionVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [newChatOpened, setNewChatOpened] = useState(false);
  const isNewChat = !activeChat || activeChat.messages.length === 0;

  const isExistingChat = !!activeChat && !newChatOpened;

  useEffect(() => {
    if (activeChat && activeChat.messages.length > 0) {
      setNewChatOpened(false);
    }
  }, [activeChat?.messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatList, activeChat]);
  return (
    <>
      <ModelModalOverlay
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        selectedModelGroup={selectedModelGroup}
        setSelectedModelGroup={setSelectedModelGroup}
      />
      <div className={styles.appContainer}>
        <LeftSide
          // onNewChat={handleNewChat}
          onNewChat={() => {
            setNewChatOpened(true);
            handleNewChat();
          }}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          modelMode={modelMode}
          setModelMode={setModelMode}
          chatList={chatList}
          setActiveChatId={setActiveChatId}
          deleteChat={deleteChat}
          renameChat={renameChat}
          modelRef={modelRef}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          selectedModelGroup={selectedModelGroup}
          setSelectedModelGroup={setSelectedModelGroup}
        />
        <div className={styles.rightSection}>
          <HeaderRightSide
            chatTitle={activeChat?.title}
            modelRef={modelRef}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            selectedModelGroup={selectedModelGroup}
            setSelectedModelGroup={setSelectedModelGroup}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
          <MainSectionRightSide
            insertTemplate={insertTemplate}
            setFocusMode={setFocusMode}
            isSectionVisible={isSectionVisible}
          />
          {activeChat && activeChat.messages.length > 0 && (
            <MessageList messages={activeChat.messages} />
          )}
          <div
            className={
              isExistingChat
                ? styles.inputBottom
                : newChatOpened && isNewChat
                ? styles.inputCenter
                : focusMode && inputSent
                ? styles.inputBottom
                : focusMode
                ? styles.inputCenter
                : inputSent
                ? styles.inputBottom
                : styles.inputWrapper
            }
          >
            <InputBar
              hasInput={hasInput}
              onChange={handleChange}
              onSend={handleSendClick}
              inputRef={inputRef}
              onHideSection={() => setIsSectionVisible(false)}
              templateTick={templateTick}
            />
            {inputSent && (
              <div className={styles.spanContainer}>
                <span className={styles.inputSpan}>
                  {" "}
                  AI systems may make mistakes, so we recommend verifying
                  important information.
                </span>{" "}
              </div>
            )}{" "}
          </div>
          <div ref={messagesEndRef} />
        </div>
      </div>{" "}
    </>
  );
}
