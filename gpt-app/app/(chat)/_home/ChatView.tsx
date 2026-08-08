"use client";

import { useEffect, useState } from "react";

import MessageList from "@/components/HomePage/RightSide/MessageList/MessageList";
import InputBar from "@/components/HomePage/RightSide/InputBar/InputBar";
import HeaderRightSide from "@/components/HomePage/RightSide/HeaderRightSide/HeaderRightSide";
import MainSectionRightSide from "@/components/HomePage/RightSide/MainSectionRightSide/MainSectionRightSide";
import ChooseModelColumn from "@/components/HomePage/RightSide/ChooseModelColumn/ChooseModelColumn";

import { setSelectedModelGroup } from "@/redux/model/slice";
import {
  setFocusMode,
  setHasFirstRequest,
  setIsModalOpen,
  setIsOverlayOpen,
  setIsSectionVisible,
} from "@/redux/ui/slice";

import type { HomeController } from "./useHomeController";
import styles from "../page.module.css";

export default function ChatView({ ctrl }: { ctrl: HomeController }) {
  const { dispatch, activeChat, inputRef, scrollContainerRef, messagesEndRef } =
    ctrl;
  const [showDisclaimer, setShowDisclaimer] = useState(false);

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
  }, [activeChat?.id, activeChat?.messages.length, ctrl.isTyping, scrollContainerRef]);

  return (
    <>
      <div className={styles.headerRightSectionContainer}>
        <HeaderRightSide
          chatTitle={activeChat?.title}
          modelRef={ctrl.modelRef}
          selectedModel={ctrl.selectedModel}
          setSelectedModel={ctrl.handleSelectModel}
          selectedModelGroup={ctrl.selectedModelGroup}
          setSelectedModelGroup={(g) => dispatch(setSelectedModelGroup(g))}
          isModalOpen={ctrl.isModalOpen}
          setIsModalOpen={(open) => dispatch(setIsModalOpen(open))}
        />
      </div>

      <div className={styles.scrollableContent} ref={scrollContainerRef}>
        {ctrl.streamError && (
          <div className={styles.streamNotice} role="alert">
            <span>{ctrl.streamError}</span>
            <button type="button" onClick={ctrl.clearStreamError}>
              Dismiss
            </button>
          </div>
        )}

        {!ctrl.restoringActiveChat && !ctrl.isOverlayOpen && ctrl.isNewChat && (
          <MainSectionRightSide
            insertTemplate={ctrl.insertTemplate}
            setFocusMode={(updater) => {
              const next =
                typeof updater === "function"
                  ? (updater as (prev: boolean) => boolean)(ctrl.focusMode)
                  : updater;
              dispatch(setFocusMode(next));
            }}
            focusMode={ctrl.focusMode}
            isSectionVisible={ctrl.isSectionVisible}
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
                  ? (updater as (prev: boolean) => boolean)(ctrl.hasFirstRequest)
                  : updater;
              dispatch(setHasFirstRequest(next));
            }}
            hasFirstRequest={ctrl.hasFirstRequest}
            isOverlay={false}
            selectedModel={ctrl.selectedModel}
            onImagesChange={ctrl.setInputImageCount}
            showEstimate={ctrl.showEstimate}
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

      {ctrl.isOverlayOpen && (
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
        {showDisclaimer && !ctrl.dockHidden && (
          <span className={styles.inputDockDisclaimer}>
            AI systems may make mistakes, so we recommend verifying important
            information.
          </span>
        )}
        <div
          className={
            ctrl.isExistingChat || ctrl.focusMode || ctrl.inputSent
              ? styles.inputBottom
              : styles.inputWrapper
          }
        >
          {!ctrl.dockHidden && (
            <div className={styles.inputBottomInner}>
              <InputBar
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
              />

              <div className={styles.spanContainer}>
                {ctrl.estimateSupported ? (
                  <div className={styles.spanContainerFirstRequest}>
                    <div className={styles.spanContainerFirstRequestTop}>
                      <span
                        className={`${styles.inputSpan1} ${
                          ctrl.showEstimate ? "" : styles.estimateHidden
                        }`}
                      >
                        ≈ Estimated cost: ~
                        {(ctrl.estimatedTokens ?? 0).toLocaleString("en-US")}{" "}
                        tokens
                      </span>
                      <ChooseModelColumn
                        selectedModel={ctrl.selectedModel}
                        showEstimate={ctrl.showEstimate}
                        onChoose={() => dispatch(setIsModalOpen(true))}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
