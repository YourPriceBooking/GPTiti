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
import SecondHeaderRightSide from "@/components/HomePage/RightSide/SecondHeaderRightSide.tsx/SecondHeaderRightSide";

export default function Home() {
  const {
    chatList,
    activeChat,
    setActiveChatId,
    activeChatId,
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
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [hasFirstRequest, setHasFirstRequest] = useState(false);
  const [pendingTemplate, setPendingTemplate] = useState<string | null>(null);
  const isNewChat = !activeChat || activeChat.messages.length === 0;

  const isExistingChat = !!activeChat && !newChatOpened;

  useEffect(() => {
    if (activeChat && activeChat.messages.length > 0) {
      setTimeout(() => {
        setNewChatOpened(false);
      }, 0);
    }
  }, [activeChat?.messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatList, activeChat]);

  useEffect(() => {
    const empty = !activeChat || activeChat.messages.length === 0;
    setTimeout(() => {
      setIsSectionVisible(empty);
      setFocusMode(false);
    }, 0);
  }, [activeChatId, activeChat?.messages.length]);

  const insertTemplateToInput = (template: string) => {
    if (inputRef.current) {
      inputRef.current.value = template;
      inputRef.current.focus();
      handleChange({
        target: inputRef.current,
      } as React.ChangeEvent<HTMLTextAreaElement>);
    } else {
      setPendingTemplate(template);
    }
  };
  useEffect(() => {
    if (!isOverlayOpen && pendingTemplate && inputRef.current) {
      inputRef.current.value = pendingTemplate;
      inputRef.current.focus();
      handleChange({
        target: inputRef.current,
      } as React.ChangeEvent<HTMLTextAreaElement>);
      setTimeout(() => {
        setPendingTemplate(null);
      }, 0);
    }
  }, [isOverlayOpen]);

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
          onNewChat={() => {
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
            hasFirstRequest={hasFirstRequest}
            onOpenQuickActions={() => {
              if (hasFirstRequest) {
                setIsOverlayOpen(true);
              }
            }}
          />
D
         

          <SecondHeaderRightSide chatTitle={activeChat?.title}/>
        
      {/* Overlay для Quick Actions */}

          {isOverlayOpen && (
            <>
              <div
                className={styles.overlay}
                onClick={() => setIsOverlayOpen(false)}
              />
              <div className={styles.overlayContent}>
                <div
                  className={styles.overlayContentInner}
                  onClick={(e) => e.stopPropagation()}
                >
                  <MainSectionRightSide
                    insertTemplate={(template) => {
                      insertTemplateToInput(template);
                      setIsOverlayOpen(false);
                      // setFocusMode(true);
                    }}
                    setFocusMode={setFocusMode}
                    isSectionVisible={true}
                    focusMode={false}
                    hasInput={hasInput}
                    onChange={handleChange}
                    onSend={() => {
                      handleSendClick();
                      setIsOverlayOpen(false);
                    }}
                    inputRef={inputRef}
                    onHideSection={() => setIsOverlayOpen(false)}
                    templateTick={templateTick}
                    setHasFirstRequest={setHasFirstRequest}
                    hasFirstRequest={hasFirstRequest}
                    isOverlay={true}
                  />
                </div>
              </div>
            </>
          )}

          {!isOverlayOpen && (
            <MainSectionRightSide
              insertTemplate={insertTemplate}
              setFocusMode={setFocusMode}
              focusMode={focusMode}
              isSectionVisible={isSectionVisible}
              hasInput={hasInput}
              onChange={handleChange}
              onSend={handleSendClick}
              inputRef={inputRef}
              onHideSection={() => setIsSectionVisible(false)}
              templateTick={templateTick}
              setHasFirstRequest={setHasFirstRequest}
              hasFirstRequest={hasFirstRequest}
              isOverlay={false}
            />
          )}

          {activeChat && activeChat.messages.length > 0 && (
            <MessageList messages={activeChat.messages} isTyping={isTyping} />
          )}

          <div
            className={
              isExistingChat
                ? styles.inputBottom
                : newChatOpened && isNewChat
                ? styles.inputBottom
                : focusMode && inputSent
                ? styles.inputBottom
                : focusMode
                ? styles.inputBottom
                : inputSent
                ? styles.inputBottom
                : styles.inputWrapper
            }
          >
            {!(isSectionVisible && focusMode) && !isOverlayOpen && (
              <div className={styles.inputBottom}>
                <InputBar
                  hasInput={hasInput}
                  onChange={handleChange}
                  onSend={() => {
                    handleSendClick();
                    if (!hasFirstRequest) {
                      setHasFirstRequest(true);
                    }
                  }}
                  inputRef={inputRef}
                  onHideSection={() => setIsSectionVisible(false)}
                  templateTick={templateTick}
                  setHasFirstRequest={setHasFirstRequest}
                  hasFirstRequest={hasFirstRequest}
                />

                <div className={styles.spanContainer}>
                  <span className={styles.inputSpan}>
                    AI systems may make mistakes, so we recommend verifying
                    important information.
                  </span>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>
      </div>
    </>
  );
}
