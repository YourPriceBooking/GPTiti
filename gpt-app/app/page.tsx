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
    activeChatId,
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
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);  
  const [hasFirstRequest, setHasFirstRequest] = useState(false); 
  const isNewChat = !activeChat || activeChat.messages.length === 0;

  const isExistingChat = !!activeChat && !newChatOpened;

  useEffect(() => {
    if (activeChat && activeChat.messages.length > 0) {
      setTimeout(() => {setNewChatOpened(false)},0);
    }
  }, [activeChat?.messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatList, activeChat]);

  useEffect(() => {
    const empty = !activeChat || activeChat.messages.length === 0;
    setTimeout(() => {setIsSectionVisible(empty);
    setFocusMode(false);}, 0)
    
  }, [activeChatId, activeChat?.messages.length]);

const insertTemplateToInput = (template: string) => 
  { if (inputRef.current) 
    { inputRef.current.value = template; inputRef.current.focus(); 
      (
        { target: inputRef.current, } as unknown as React.ChangeEvent<HTMLTextAreaElement>); } };

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
            // setIsSectionVisible(true);
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
              if (hasFirstRequest) { setIsOverlayOpen(true); } }}
          />
          {isOverlayOpen && 
          ( <div className={styles.overlay}> 
          <div className={styles.overlayContent}> 
            <MainSectionRightSide insertTemplate={(template) => 
            { insertTemplateToInput(template); 
              setIsOverlayOpen(false); 
              setFocusMode(true); }} 
              setFocusMode={setFocusMode} 
              isSectionVisible={isSectionVisible} 
              focusMode={focusMode} 
              hasInput={hasInput} 
               onChange={handleChange} 
               onSend={handleSendClick} 
               inputRef={inputRef} 
               onHideSection={() => setIsSectionVisible(false)} 
               templateTick={templateTick}
               setHasFirstRequest={setHasFirstRequest}
               hasFirstRequest = {hasFirstRequest} /> 
               </div> 
               </div> )}
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
            hasFirstRequest = {hasFirstRequest}
          />
          {activeChat && activeChat.messages.length > 0 && (
            <MessageList messages={activeChat.messages} />
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
            {!(isSectionVisible && focusMode) && (
              <div className={styles.inputBottom}>
                <InputBar
                  hasInput={hasInput}
                  onChange={handleChange}
                  onSend={() => { handleSendClick(); 
                    if (!hasFirstRequest) 
                      { setHasFirstRequest(true);  } 
                  }}
                  inputRef={inputRef}
                  onHideSection={() => setIsSectionVisible(false)}
                  templateTick={templateTick}
                  setHasFirstRequest={setHasFirstRequest} 
                  hasFirstRequest={hasFirstRequest}
                />

                {inputSent && (
                  <div className={styles.spanContainer}>
                    <span className={styles.inputSpan}>
                      AI systems may make mistakes, so we recommend verifying
                      important information.
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>
      </div>{" "}
    </>
  );
}
