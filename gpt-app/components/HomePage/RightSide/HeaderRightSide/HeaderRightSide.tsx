"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import Image from "next/image";
import ModelGptitiTitleWithIcon from "@/components/ModelGptitiTitleWithIcon/ModelGptitiTitleWithIcon";
import LoginModal from "@/components/HomePage/common/LoginModal/LoginModal";
import LeftSide from "../../LeftSide/LeftSide";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectIsLoggedIn } from "@/redux/auth/selectors";
import { selectActiveChatId, selectChatList } from "@/redux/chat/selectors";
import {
  deleteChat,
  handleNewChat,
  renameChat,
  setActiveChatId,
} from "@/redux/chat/slice";

import { useModelMode } from "@/hooks/useModelMode";

import { TOKENS_SUFFIX } from "@/config/models.config";

import { getModelGroupAndItem } from "@/functions/getModelGroupAndItem";

import { HeaderRightSideProps } from "@/types/types";

import styles from "./HeaderRightSide.module.css";
import userStyles from "@/components/HomePage/LeftSide/SectionGptUser/SectionGptUser.module.css";

export default function HeaderRightSide({
  chatTitle,
  modelRef,
  selectedModel,
  setSelectedModel,
  selectedModelGroup,
  setSelectedModelGroup,
  isModalOpen,
  setIsModalOpen,
  onOpenQuickActions,
  hasFirstRequest,
}: HeaderRightSideProps & {
  onOpenQuickActions: () => void;
  hasFirstRequest: boolean;
}) {
  const dispatch = useAppDispatch();

  const isAuthed = useAppSelector(selectIsLoggedIn);
  const activeChatId = useAppSelector(selectActiveChatId);
  const chatList = useAppSelector(selectChatList);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isModalMounted, setIsModalMounted] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const result = getModelGroupAndItem(selectedModel);
  const { modelMode, setModelMode } = useModelMode();

  const ANIM_MS = 220;

  const openLeftPanel = () => {
    setIsClosing(false);
    setIsModalMounted(true);
    requestAnimationFrame(() => setIsModalVisible(true));
  };

  const closeLeftPanel = () => {
    setIsClosing(true);
    setIsModalVisible(false);

    window.setTimeout(() => {
      setIsModalMounted(false);
      setIsClosing(false);
    }, ANIM_MS);
  };

  const setModelModalOpenSafe = (open: boolean) => {
    if (!open) {
      setIsModalOpen(false);
      return;
    }

    if (isModalMounted) {
      closeLeftPanel();
      window.setTimeout(() => {
        setIsModalOpen(true);
      }, ANIM_MS);
      return;
    }

    setIsModalOpen(true);
  };

  useEffect(() => {
    if (isModalMounted) closeLeftPanel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChatId]);

  return (
    <div className={styles.container}>
      <Image
        className={styles.openModal}
        src="/icons/open-icon.svg"
        width={25}
        height={25}
        alt="open-modal"
        onClick={openLeftPanel}
      />

      {isModalMounted &&
        createPortal(
          <div
            className={`${styles.modalOverlay} ${
              isModalVisible ? styles.modalOverlayOpen : ""
            } ${isClosing ? styles.modalOverlayClosing : ""}`}
            onClick={closeLeftPanel}
          >
            <div
              className={`${styles.modalContent} ${
                isModalVisible ? styles.modalContentOpen : ""
              } ${isClosing ? styles.modalContentClosing : ""}`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles.closeButton}
                onClick={closeLeftPanel}
                aria-label="Close modal"
                type="button"
              >
                <Image src="/icons/close.svg" width={20} height={20} alt="" />
              </button>

              <LeftSide
                onNewChat={() => dispatch(handleNewChat())}
                isModalOpen={isModalOpen}
                setIsModalOpen={setModelModalOpenSafe}
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
                setSelectedModel={setSelectedModel}
                selectedModelGroup={selectedModelGroup}
                setSelectedModelGroup={setSelectedModelGroup}
              />
            </div>
          </div>,
          document.body,
        )}

      <div className={styles.containerGroupLogos}>
        <Image
          className={styles.rabbitLogo}
          src="/icons/rabbit.svg"
          alt="logo-rabbit"
          width={47}
          height={47}
        />
        <Image
          className={styles.headerTextLogo}
          src="/icons/text-logo.svg"
          alt="text-gptiti-logo"
          width={92}
          height={27}
        />
      </div>

      <div className={styles.modelGptitiWrapper}>
        <div className={styles.modelGptitiContainer}>
          <ModelGptitiTitleWithIcon
            modelRef={modelRef}
            selectedModel={selectedModel}
            isModalOpen={isModalOpen}
            setIsModalOpen={setModelModalOpenSafe}
          />
          <p
            className={`${styles.paragraph} ${
              selectedModel === "gpt-4o-realtime"
                ? styles.paragraphRealtime
                : ""
            }`}
          >
            {result?.model.tokens} {TOKENS_SUFFIX}
          </p>
        </div>
      </div>

      {!isAuthed ? (
        <>
          <button
            className={userStyles.loginBtnHeader}
            onClick={() => setIsLoginOpen(true)}
            type="button"
          >
            <span className={userStyles.loginBtnSpan}>
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  marginRight: "8px",
                  lineHeight: "28px",
                }}
              >
                G
              </span>
              <span className={userStyles.loginBtnText}>
                Continue in with Google
              </span>
            </span>
          </button>

          <LoginModal
            open={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
          />
        </>
      ) : (
        <p
          className={styles.quickActionsContainer}
          onClick={onOpenQuickActions}
          style={{ opacity: hasFirstRequest ? 1 : 0.5 }}
        >
          <Image
            src="/icons/quick-actions.svg"
            width={21}
            height={21}
            alt="quick-actions-icon"
            className={styles.quickActionsIcon}
          />
          <span className={styles.quickActionsSpan}>Quick actions</span>
        </p>
      )}
    </div>
  );
}
