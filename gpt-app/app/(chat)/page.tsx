"use client";

import { useRef, useEffect, useCallback, useState, useMemo } from "react";

import LeftSide from "@/components/HomePage/LeftSide/LeftSide";
import MessageList from "@/components/HomePage/RightSide/MessageList/MessageList";
import InputBar from "@/components/HomePage/RightSide/InputBar/InputBar";
import HeaderRightSide from "@/components/HomePage/RightSide/HeaderRightSide/HeaderRightSide";
import MainSectionRightSide from "@/components/HomePage/RightSide/MainSectionRightSide/MainSectionRightSide";
import ModelModalOverlay from "@/components/ModelModalOverlay/ModelModalOverlay";

import { useModelMode } from "@/hooks/useModelMode";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { getFlowType } from "@/config/modelFlows.config";
import { getEstimatedTokens } from "@/config/modelPricing.config";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectActiveChat,
  selectActiveChatId,
  selectChatList,
  selectHasInput,
  selectInputSent,
  selectIsTyping,
  selectTemplateTick,
} from "@/redux/chat/selectors";
import {
  appendAiMessage,
  appendUserMessage,
  bumpTemplateTick,
  deleteChat,
  handleNewChat,
  renameChat,
  setActiveChatId,
  setHasInput,
  setInputSent,
  setIsTyping,
} from "@/redux/chat/slice";
import {
  selectSelectedModel,
  selectSelectedModelGroup,
} from "@/redux/model/selectors";
import { setSelectedModel, setSelectedModelGroup } from "@/redux/model/slice";
import {
  selectFocusMode,
  selectHasFirstRequest,
  selectIsModalOpen,
  selectIsOverlayOpen,
  selectIsSectionVisible,
  selectNewChatOpened,
} from "@/redux/ui/selectors";
import {
  setFocusMode,
  setHasFirstRequest,
  setIsModalOpen,
  setIsOverlayOpen,
  setIsSectionVisible,
  setNewChatOpened,
} from "@/redux/ui/slice";

import styles from "./page.module.css";

export default function Home() {
  const dispatch = useAppDispatch();

  const chatList = useAppSelector(selectChatList);
  const activeChat = useAppSelector(selectActiveChat);
  const activeChatId = useAppSelector(selectActiveChatId);
  const hasInput = useAppSelector(selectHasInput);
  const inputSent = useAppSelector(selectInputSent);
  const isTyping = useAppSelector(selectIsTyping);
  const templateTick = useAppSelector(selectTemplateTick);

  const selectedModel = useAppSelector(selectSelectedModel);
  const selectedModelGroup = useAppSelector(selectSelectedModelGroup);

  const focusMode = useAppSelector(selectFocusMode);
  const isSectionVisible = useAppSelector(selectIsSectionVisible);
  const isModalOpen = useAppSelector(selectIsModalOpen);
  const isOverlayOpen = useAppSelector(selectIsOverlayOpen);
  const hasFirstRequest = useAppSelector(selectHasFirstRequest);
  const newChatOpened = useAppSelector(selectNewChatOpened);

  const { modelMode, setModelMode, modelRef } = useModelMode();

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pendingTemplateRef = useRef<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [inputCharCount, setInputCharCount] = useState(0);
  const [inputImageCount, setInputImageCount] = useState(0);

  const estimatedTokens = useMemo(
    () => getEstimatedTokens(selectedModel, inputCharCount, inputImageCount),
    [selectedModel, inputCharCount, inputImageCount],
  );
  const showEstimate = estimatedTokens !== null;

  useScrollDirection(scrollContainerRef);

  const isNewChat = !activeChat || activeChat.messages.length === 0;
  const isExistingChat = !!activeChat && !newChatOpened;

  useEffect(() => {
    if (activeChat && activeChat.messages.length > 0) {
      const t = setTimeout(() => dispatch(setNewChatOpened(false)), 0);
      return () => clearTimeout(t);
    }
  }, [activeChat?.messages.length, activeChat, dispatch]);

  useEffect(() => {
    if (!activeChat || activeChat.messages.length === 0) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.id, activeChat?.messages.length, activeChat]);

  useEffect(() => {
    const empty = !activeChat || activeChat.messages.length === 0;
    const t = setTimeout(() => {
      dispatch(setIsSectionVisible(empty));
      dispatch(setFocusMode(false));
    }, 0);
    return () => clearTimeout(t);
  }, [activeChatId, activeChat?.messages.length, activeChat, dispatch]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | null>) => {
      const value = e.target?.value ?? "";
      dispatch(setHasInput(value.trim().length ? true : false));
      setInputCharCount(value.length);
    },
    [dispatch],
  );

  const insertTemplate = useCallback(
    (template: string) => {
      if (!inputRef.current) return;
      inputRef.current.value = template;
      inputRef.current.scrollTop = 0;
      dispatch(setHasInput(template.trim().length > 0));
      setInputCharCount(template.length);
      dispatch(bumpTemplateTick());
      inputRef.current.focus();
    },
    [dispatch],
  );

  const handleSendClick = useCallback(
    async (_hasFirstRequest: boolean, imageUrls: string[] = []) => {
      if (!inputRef.current || !activeChatId) return;
      const userText = inputRef.current.value.trim();
      if (!userText && imageUrls.length === 0) return;

      dispatch(
        appendUserMessage({
          chatId: activeChatId,
          user: userText,
          images: imageUrls,
        }),
      );
      dispatch(setInputSent(true));
      dispatch(setHasInput(false));
      dispatch(setIsTyping(true));
      inputRef.current.value = "";
      setInputCharCount(0);
      setInputImageCount(0);

      const delay = Math.random() * 1000 + 1500;
      await new Promise((resolve) => setTimeout(resolve, delay));

      const usedTokens = Math.floor(Math.random() * 100) + 50;

      dispatch(
        appendAiMessage({
          chatId: activeChatId,
          ai: "default",
          tokens: usedTokens,
        }),
      );
      dispatch(setIsTyping(false));
    },
    [dispatch, activeChatId],
  );

  const insertTemplateToInput = (template: string) => {
    if (inputRef.current) {
      inputRef.current.value = template;
      inputRef.current.focus();
      handleChange({
        target: inputRef.current,
      } as React.ChangeEvent<HTMLTextAreaElement>);
    } else {
      pendingTemplateRef.current = template;
    }
  };

  useEffect(() => {
    if (!isOverlayOpen && pendingTemplateRef.current && inputRef.current) {
      inputRef.current.value = pendingTemplateRef.current;
      inputRef.current.focus();
      handleChange({
        target: inputRef.current,
      } as React.ChangeEvent<HTMLTextAreaElement>);
      pendingTemplateRef.current = null;
    }
  }, [isOverlayOpen, handleChange]);

  return (
    <>
      <ModelModalOverlay
        isModalOpen={isModalOpen}
        setIsModalOpen={(open) => dispatch(setIsModalOpen(open))}
        selectedModel={selectedModel}
        setSelectedModel={(m) => dispatch(setSelectedModel(m))}
        selectedModelGroup={selectedModelGroup}
        setSelectedModelGroup={(g) => dispatch(setSelectedModelGroup(g))}
      />

      <div className={styles.appContainer} data-flow={getFlowType(selectedModel)}>
        <div className={styles.leftSideContainer}>
          <LeftSide
            onNewChat={() => dispatch(handleNewChat())}
            isModalOpen={isModalOpen}
            setIsModalOpen={(open) => dispatch(setIsModalOpen(open))}
            modelMode={modelMode}
            setModelMode={setModelMode}
            chatList={chatList}
            setActiveChatId={(id) => dispatch(setActiveChatId(id))}
            deleteChat={(id) => dispatch(deleteChat(id))}
            renameChat={(chatId, newTitle) =>
              dispatch(renameChat({ chatId, newTitle }))
            }
            modelRef={modelRef}
            selectedModel={selectedModel}
            setSelectedModel={(m) => dispatch(setSelectedModel(m))}
            selectedModelGroup={selectedModelGroup}
            setSelectedModelGroup={(g) => dispatch(setSelectedModelGroup(g))}
          />
        </div>
        <div className={styles.rightSection}>
          <div className={styles.headerRightSectionContainer}>
            <HeaderRightSide
              chatTitle={activeChat?.title}
              modelRef={modelRef}
              selectedModel={selectedModel}
              setSelectedModel={(m) => dispatch(setSelectedModel(m))}
              selectedModelGroup={selectedModelGroup}
              setSelectedModelGroup={(g) => dispatch(setSelectedModelGroup(g))}
              isModalOpen={isModalOpen}
              setIsModalOpen={(open) => dispatch(setIsModalOpen(open))}
              hasFirstRequest={hasFirstRequest}
              onOpenQuickActions={() => {
                if (hasFirstRequest) dispatch(setIsOverlayOpen(true));
              }}
            />
          </div>

          <div className={styles.scrollableContent} ref={scrollContainerRef}>
            {!isOverlayOpen && (
              <MainSectionRightSide
                insertTemplate={insertTemplate}
                setFocusMode={(updater) => {
                  const next =
                    typeof updater === "function"
                      ? (updater as (prev: boolean) => boolean)(focusMode)
                      : updater;
                  dispatch(setFocusMode(next));
                }}
                focusMode={focusMode}
                isSectionVisible={isSectionVisible}
                hasInput={hasInput}
                onChange={handleChange}
                onSend={(_message, imageUrls) => {
                  handleSendClick(hasFirstRequest, imageUrls);
                }}
                inputRef={inputRef}
                onHideSection={() => dispatch(setIsSectionVisible(false))}
                templateTick={templateTick}
                setHasFirstRequest={(updater) => {
                  const next =
                    typeof updater === "function"
                      ? (updater as (prev: boolean) => boolean)(hasFirstRequest)
                      : updater;
                  dispatch(setHasFirstRequest(next));
                }}
                hasFirstRequest={hasFirstRequest}
                isOverlay={false}
                selectedModel={selectedModel}
                onImagesChange={setInputImageCount}
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
                onClick={() => dispatch(setIsOverlayOpen(false))}
              />
              <div className={styles.overlayContent}>
                <div
                  className={styles.overlayContentInner}
                  onClick={(e) => e.stopPropagation()}
                >
                  <MainSectionRightSide
                    insertTemplate={(template) => {
                      insertTemplateToInput(template);
                      dispatch(setIsOverlayOpen(false));
                    }}
                    setFocusMode={(updater) => {
                      const next =
                        typeof updater === "function"
                          ? (updater as (prev: boolean) => boolean)(focusMode)
                          : updater;
                      dispatch(setFocusMode(next));
                    }}
                    isSectionVisible={true}
                    focusMode={false}
                    hasInput={hasInput}
                    onChange={handleChange}
                    onSend={(_message, imageUrls) => {
                      handleSendClick(hasFirstRequest, imageUrls);
                      dispatch(setIsOverlayOpen(false));
                    }}
                    inputRef={inputRef}
                    onHideSection={() => dispatch(setIsOverlayOpen(false))}
                    templateTick={templateTick}
                    setHasFirstRequest={(updater) => {
                      const next =
                        typeof updater === "function"
                          ? (updater as (prev: boolean) => boolean)(
                              hasFirstRequest,
                            )
                          : updater;
                      dispatch(setHasFirstRequest(next));
                    }}
                    hasFirstRequest={hasFirstRequest}
                    isOverlay={true}
                    selectedModel={selectedModel}
                    onImagesChange={setInputImageCount}
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
                    onSend={(_message, imageUrls) => {
                      handleSendClick(hasFirstRequest, imageUrls);
                      if (!hasFirstRequest) dispatch(setHasFirstRequest(true));
                    }}
                    inputRef={inputRef}
                    onHideSection={() => dispatch(setIsSectionVisible(false))}
                    templateTick={templateTick}
                    setHasFirstRequest={(updater) => {
                      const next =
                        typeof updater === "function"
                          ? (updater as (prev: boolean) => boolean)(
                              hasFirstRequest,
                            )
                          : updater;
                      dispatch(setHasFirstRequest(next));
                    }}
                    hasFirstRequest={hasFirstRequest}
                    selectedModel={selectedModel}
                    onImagesChange={setInputImageCount}
                  />

                  <div className={styles.spanContainer}>
                    {showEstimate ? (
                      <div className={styles.spanContainerFirstRequest}>
                        <span className={styles.inputSpan1}>
                          ≈ Estimated cost: ~
                          {estimatedTokens?.toLocaleString("en-US")} tokens
                        </span>
                        <span className={styles.inputSpan}>
                          AI systems may make mistakes, so we recommend
                          verifying important information.
                        </span>
                      </div>
                    ) : (
                      <span className={styles.inputSpan}>
                        AI systems may make mistakes, so we recommend verifying
                        important information.
                      </span>
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
