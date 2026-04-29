"use client";

import styles from "./page.module.css";
import LeftSide from "@/components/HomePage/LeftSide/LeftSide";
import MessageList from "@/components/HomePage/RightSide/MessageList/MessageList";
import InputBar from "@/components/HomePage/RightSide/InputBar/InputBar";
import { useChatContext } from "@/context/ChatContext";
import { useModelMode } from "@/hooks/useModelMode";
import { useState, useRef, useEffect } from "react";
import { ModelType } from "@/types/types";
import HeaderRightSide from "@/components/HomePage/RightSide/HeaderRightSide/HeaderRightSide";
import MainSectionRightSide from "@/components/HomePage/RightSide/MainSectionRightSide/MainSectionRightSide";
import ModelModalOverlay from "@/components/ModelModalOverlay/ModelModalOverlay";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { BackendAuthResponse } from "@/types/google.types";
import { useAuth } from "@/context/AuthContext";

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
  } = useChatContext();

  const { modelMode, setModelMode, modelRef } = useModelMode();
  const [selectedModelGroup, setSelectedModelGroup] =
    useState<ModelType>("gpt-5.4");
  const [selectedModel, setSelectedModel] = useState<string>("gpt-5.4-mini");

  useEffect(() => {
    const savedModel = localStorage.getItem("selectedModel");
    const savedGroup = localStorage.getItem("selectedModelGroup");
    if (savedModel) {
      setSelectedModel(savedModel);
    }
    if (savedGroup) {
      setSelectedModelGroup(savedGroup as ModelType);
    }
  }, []);

  const [focusMode, setFocusMode] = useState(false);
  const [isSectionVisible, setIsSectionVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { hidden } = useScrollDirection(scrollContainerRef);

  const [newChatOpened, setNewChatOpened] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [hasFirstRequest, setHasFirstRequest] = useState(false);
  const [pendingTemplate, setPendingTemplate] = useState<string | null>(null);

  const isNewChat = !activeChat || activeChat.messages.length === 0;
  const isExistingChat = !!activeChat && !newChatOpened;

  useEffect(() => {
    if (activeChat && activeChat.messages.length > 0) {
      setTimeout(() => setNewChatOpened(false), 0);
    }
  }, [activeChat?.messages.length]);

  useEffect(() => {
    if (!activeChat || activeChat.messages.length === 0) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.id, activeChat?.messages.length]);

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
      setTimeout(() => setPendingTemplate(null), 0);
    }
  }, [isOverlayOpen, pendingTemplate, handleChange, inputRef]);
  const { login } = useAuth();

  const handleLogin = async (res: CredentialResponse) => {
    try {
      if (!res.credential) {
        console.error("No credential returned");
        return;
      }
      console.log("Got credential?", Boolean(res.credential));
      await login(res.credential);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  function setIsIconClicked(arg0: boolean): void {
    throw new Error("Function not implemented.");
  }

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
        <div className={styles.leftSideContainer}>
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
        </div>
        <div className={styles.rightSection}>
          <div className={styles.headerRightSectionContainer}>
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
                if (hasFirstRequest) setIsOverlayOpen(true);
              }}
            />
          </div>

          <div className={styles.scrollableContent} ref={scrollContainerRef}>
            {!isOverlayOpen && (
              <MainSectionRightSide
                insertTemplate={insertTemplate}
                setFocusMode={setFocusMode}
                focusMode={focusMode}
                isSectionVisible={isSectionVisible}
                hasInput={hasInput}
                onChange={handleChange}
                onSend={() => handleSendClick(hasFirstRequest)}
                inputRef={inputRef}
                onHideSection={() => setIsSectionVisible(false)}
                templateTick={templateTick}
                setHasFirstRequest={setHasFirstRequest}
                hasFirstRequest={hasFirstRequest}
                isOverlay={false}
                selectedModel={selectedModel}
              />
            )}

            {activeChat && activeChat.messages.length > 0 && (
              <MessageList
                messages={activeChat.messages}
                isTyping={isTyping}
                hasFirstRequest={hasFirstRequest}
              />
            )}

            <div ref={messagesEndRef} />
          </div>

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
                    }}
                    setFocusMode={setFocusMode}
                    isSectionVisible={true}
                    focusMode={false}
                    hasInput={hasInput}
                    onChange={handleChange}
                    onSend={() => {
                      handleSendClick(hasFirstRequest);
                      setIsOverlayOpen(false);
                    }}
                    inputRef={inputRef}
                    onHideSection={() => setIsOverlayOpen(false)}
                    templateTick={templateTick}
                    setHasFirstRequest={setHasFirstRequest}
                    hasFirstRequest={hasFirstRequest}
                    isOverlay={true}
                    selectedModel={selectedModel}
                  />
                </div>
              </div>
            </>
          )}

          <div className={styles.inputDock}>
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
                <div className={styles.inputBottomInner}>
                  <InputBar
                    hasInput={hasInput}
                    onChange={handleChange}
                    onSend={() => {
                      handleSendClick(hasFirstRequest);
                      if (!hasFirstRequest) setHasFirstRequest(true);
                    }}
                    inputRef={inputRef}
                    onHideSection={() => setIsSectionVisible(false)}
                    templateTick={templateTick}
                    setHasFirstRequest={setHasFirstRequest}
                    hasFirstRequest={hasFirstRequest}
                    selectedModel={selectedModel}
                  />

                  <div className={styles.spanContainer}>
                    {!hasFirstRequest ? (
                      <span className={styles.inputSpan}>
                        AI systems may make mistakes, so we recommend verifying
                        important information.
                      </span>
                    ) : (
                      <div className={styles.spanContainerFirstRequest}>
                        <span className={styles.inputSpan1}>
                          ≈ Estimated cost: ~120 tokens
                        </span>
                        <span className={styles.inputSpan}>
                          AI systems may make mistakes, so we recommend
                          verifying important information.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
