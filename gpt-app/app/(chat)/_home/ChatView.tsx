"use client";

import { useEffect, useState } from "react";

import MessageList from "@/components/HomePage/RightSide/MessageList/MessageList";
import InputComposer from "@/components/HomePage/RightSide/InputComposer/InputComposer";
import MainSectionRightSide from "@/components/HomePage/RightSide/MainSectionRightSide/MainSectionRightSide";
import LeftSideDrawer from "@/components/HomePage/LeftSide/LeftSideDrawer/LeftSideDrawer";

import { handleNewChat } from "@/redux/chat/slice";
import { setSelectedModelGroup } from "@/redux/model/slice";
import {
  setFocusMode,
  setHasFirstRequest,
  setIsModalOpen,
  setIsOverlayOpen,
  setIsSectionVisible,
  setIsCreateProjectModalOpen,
} from "@/redux/ui/slice";

import { useQuickTasksAccess } from "@/hooks/useFeatureAccess";

import type { HomeController } from "./useHomeController";
import styles from "../page.module.css";

export default function ChatView({ ctrl }: { ctrl: HomeController }) {
  const { dispatch, activeChat, inputRef, scrollContainerRef, messagesEndRef } =
    ctrl;
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const showQuickTasks = useQuickTasksAccess();
  const focusOnly = !showQuickTasks;

  const showMainSection =
    !ctrl.restoringActiveChat && !ctrl.isOverlayOpen && ctrl.isNewChat;
  const focusMode = focusOnly ? true : ctrl.focusMode;
  const isSectionVisible = focusOnly ? true : ctrl.isSectionVisible;

  const dockHidden = focusOnly ? showMainSection : ctrl.dockHidden;

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const updateDisclaimer = () => {
      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      setShowDisclaimer(distanceFromBottom <= 32);
    };

    const frame = requestAnimationFrame(updateDisclaimer);
    const resizeObserver = new ResizeObserver(updateDisclaimer);
    resizeObserver.observe(container);
    Array.from(container.children).forEach((child) =>
      resizeObserver.observe(child),
    );
    container.addEventListener("scroll", updateDisclaimer, { passive: true });
    window.addEventListener("resize", updateDisclaimer);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      container.removeEventListener("scroll", updateDisclaimer);
      window.removeEventListener("resize", updateDisclaimer);
    };
  }, [
    activeChat?.id,
    activeChat?.messages.length,
    ctrl.isTyping,
    scrollContainerRef,
  ]);

  return (
    <>
      <LeftSideDrawer
        className={styles.chatMenuTrigger}
        onNewChat={() => dispatch(handleNewChat())}
        onNewProject={() => dispatch(setIsCreateProjectModalOpen(true))}
        isModalOpen={ctrl.isModalOpen}
        setIsModalOpen={(open) => dispatch(setIsModalOpen(open))}
        modelMode={ctrl.modelMode}
        setModelMode={ctrl.setModelMode}
        chatList={ctrl.sortedChatList}
        setActiveChatId={ctrl.handleSelectChat}
        deleteChat={ctrl.handleDeleteChat}
        renameChat={ctrl.handleRenameChat}
        modelRef={ctrl.modelRef}
        selectedModel={ctrl.selectedModel}
        setSelectedModel={ctrl.handleSelectModel}
        selectedModelGroup={ctrl.selectedModelGroup}
        setSelectedModelGroup={(g) => dispatch(setSelectedModelGroup(g))}
      />

      <div className={styles.scrollableContent} ref={scrollContainerRef}>
        {ctrl.streamError && (
          <div className={styles.streamNotice} role="alert">
            <span>{ctrl.streamError}</span>
            <button type="button" onClick={ctrl.clearStreamError}>
              Dismiss
            </button>
          </div>
        )}

        {showMainSection && (
          <MainSectionRightSide
            insertTemplate={ctrl.insertTemplate}
            setFocusMode={(updater) => {
              if (focusOnly) return;
              const next =
                typeof updater === "function"
                  ? (updater as (prev: boolean) => boolean)(ctrl.focusMode)
                  : updater;
              dispatch(setFocusMode(next));
            }}
            focusMode={focusMode}
            isSectionVisible={isSectionVisible}
            hasInput={ctrl.hasInput}
            onChange={ctrl.handleChange}
            onSend={(_message, imageUrls, imageFiles) => {
              ctrl.handleSendClick(ctrl.hasFirstRequest, imageUrls, imageFiles);
            }}
            inputRef={inputRef}
            onHideSection={() => dispatch(setIsSectionVisible(false))}
            templateTick={ctrl.templateTick}
            setHasFirstRequest={(updater) => {
              const next =
                typeof updater === "function"
                  ? (updater as (prev: boolean) => boolean)(
                      ctrl.hasFirstRequest,
                    )
                  : updater;
              dispatch(setHasFirstRequest(next));
            }}
            hasFirstRequest={ctrl.hasFirstRequest}
            isOverlay={false}
            selectedModel={ctrl.selectedModel}
            onImagesChange={ctrl.setInputImageCount}
            showEstimate={ctrl.showEstimate}
            estimateSupported={ctrl.estimateSupported}
            estimatedTokens={ctrl.estimatedTokens}
            onChooseModel={() => dispatch(setIsModalOpen(true))}
          />
        )}

        {!ctrl.restoringActiveChat &&
          activeChat &&
          activeChat.messages.length > 0 && (
            <MessageList
              messages={activeChat.messages}
              isTyping={ctrl.isTyping}
              hasFirstRequest={ctrl.hasFirstRequest}
              onRetry={() => void ctrl.handleRetryStream()}
            />
          )}

        <div ref={messagesEndRef} className={styles.scrollAnchor} />
      </div>

      {showQuickTasks && ctrl.isOverlayOpen && (
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
                  ctrl.insertTemplate(template);
                  dispatch(setIsOverlayOpen(false));
                }}
                setFocusMode={(updater) => {
                  const next =
                    typeof updater === "function"
                      ? (updater as (prev: boolean) => boolean)(ctrl.focusMode)
                      : updater;
                  dispatch(setFocusMode(next));
                }}
                isSectionVisible={true}
                focusMode={false}
                hasInput={ctrl.hasInput}
                onChange={ctrl.handleChange}
                onSend={(_message, imageUrls, imageFiles) => {
                  ctrl.handleSendClick(
                    ctrl.hasFirstRequest,
                    imageUrls,
                    imageFiles,
                  );
                  dispatch(setIsOverlayOpen(false));
                }}
                inputRef={inputRef}
                onHideSection={() => dispatch(setIsOverlayOpen(false))}
                templateTick={ctrl.templateTick}
                setHasFirstRequest={(updater) => {
                  const next =
                    typeof updater === "function"
                      ? (updater as (prev: boolean) => boolean)(
                          ctrl.hasFirstRequest,
                        )
                      : updater;
                  dispatch(setHasFirstRequest(next));
                }}
                hasFirstRequest={ctrl.hasFirstRequest}
                isOverlay={true}
                selectedModel={ctrl.selectedModel}
                onImagesChange={ctrl.setInputImageCount}
                showEstimate={ctrl.showEstimate}
                onChooseModel={() => dispatch(setIsModalOpen(true))}
              />
            </div>
          </div>
        </>
      )}

      <div
        className={styles.inputDock}
        style={ctrl.restoringActiveChat ? { display: "none" } : undefined}
      >
        <div
          className={
            ctrl.isExistingChat || focusMode || ctrl.inputSent
              ? styles.inputBottom
              : styles.inputWrapper
          }
        >
          {!dockHidden && (
            <div className={styles.inputBottomInner}>
              <InputComposer
                hasInput={ctrl.hasInput}
                onChange={ctrl.handleChange}
                onSend={(_message, imageUrls, imageFiles) => {
                  ctrl.handleSendClick(
                    ctrl.hasFirstRequest,
                    imageUrls,
                    imageFiles,
                  );
                  if (!ctrl.hasFirstRequest) dispatch(setHasFirstRequest(true));
                }}
                inputRef={inputRef}
                onHideSection={() => dispatch(setIsSectionVisible(false))}
                templateTick={ctrl.templateTick}
                setHasFirstRequest={(updater) => {
                  const next =
                    typeof updater === "function"
                      ? (updater as (prev: boolean) => boolean)(
                          ctrl.hasFirstRequest,
                        )
                      : updater;
                  dispatch(setHasFirstRequest(next));
                }}
                hasFirstRequest={ctrl.hasFirstRequest}
                selectedModel={ctrl.selectedModel}
                onImagesChange={ctrl.setInputImageCount}
                isAiResponding={ctrl.isTyping}
                showDisclaimer={showDisclaimer}
                showEstimate={ctrl.showEstimate}
                estimateSupported={ctrl.estimateSupported}
                estimatedTokens={ctrl.estimatedTokens}
                onChooseModel={() => dispatch(setIsModalOpen(true))}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
