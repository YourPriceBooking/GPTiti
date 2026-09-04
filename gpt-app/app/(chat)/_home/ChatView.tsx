"use client";

import { useEffect, useState } from "react";

import MessageList from "@/components/HomePage/RightSide/MessageList/MessageList";
import InputComposer from "@/components/HomePage/RightSide/InputComposer/InputComposer";
import MainSectionRightSide from "@/components/HomePage/RightSide/MainSectionRightSide/MainSectionRightSide";

import {
  setFocusMode,
  setHasFirstRequest,
  setIsModalOpen,
  setIsOverlayOpen,
  setIsSectionVisible,
} from "@/redux/ui/slice";

import { useQuickTasksAccess } from "@/hooks/useFeatureAccess";

import type { HomeController } from "./useHomeController";
import ChatBreadcrumbs from "./ChatBreadcrumbs";
import styles from "../page.module.css";

export default function ChatView({
  ctrl,
  showBreadcrumbs = false,
}: {
  ctrl: HomeController;
  showBreadcrumbs?: boolean;
}) {
  const { dispatch, activeChat, inputRef, scrollContainerRef, messagesEndRef } =
    ctrl;
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const showQuickTasks = useQuickTasksAccess();
  const focusOnly = !showQuickTasks;

  const showMainSection =
    !ctrl.restoringActiveChat && !ctrl.isOverlayOpen && ctrl.isNewChat;
  const hasMessages = Boolean(activeChat && activeChat.messages.length > 0);
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
      {showBreadcrumbs && <ChatBreadcrumbs chat={activeChat} />}

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
            onSend={(_message, imageUrls, imageFiles) =>
              ctrl.handleSendClick(ctrl.hasFirstRequest, imageUrls, imageFiles)
            }
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
            sendDisabled={ctrl.sendDisabled}
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
              onCancelPending={ctrl.handleCancelPendingMessage}
            />
          )}

        <div
          ref={messagesEndRef}
          className={`${styles.scrollAnchor} ${
            !hasMessages && dockHidden ? styles.scrollAnchorEmpty : ""
          }`}
        />
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
                onSend={async (_message, imageUrls, imageFiles) => {
                  const accepted = await ctrl.handleSendClick(
                    ctrl.hasFirstRequest,
                    imageUrls,
                    imageFiles,
                  );
                  if (accepted) dispatch(setIsOverlayOpen(false));
                  return accepted;
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
                sendDisabled={ctrl.sendDisabled}
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
                onSend={async (_message, imageUrls, imageFiles) => {
                  const accepted = await ctrl.handleSendClick(
                    ctrl.hasFirstRequest,
                    imageUrls,
                    imageFiles,
                  );
                  if (accepted && !ctrl.hasFirstRequest) {
                    dispatch(setHasFirstRequest(true));
                  }
                  return accepted;
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
                showModelSelection={ctrl.isNewChat}
                onChooseModel={() => dispatch(setIsModalOpen(true))}
                sendDisabled={ctrl.sendDisabled}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
