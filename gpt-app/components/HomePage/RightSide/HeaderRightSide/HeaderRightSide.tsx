"use client";

import { useState } from "react";

import Image from "next/image";
import ModelGptitiTitleWithIcon from "@/components/ModelGptitiTitleWithIcon/ModelGptitiTitleWithIcon";
import LoginModal from "@/components/HomePage/common/LoginModal/LoginModal";
import LeftSideDrawer from "../../LeftSide/LeftSideDrawer/LeftSideDrawer";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectIsLoggedIn, selectUser } from "@/redux/auth/selectors";
import { selectChatList } from "@/redux/chat/selectors";
import {
  deleteDraftChat,
  handleNewChat,
  isDraftId,
  renameChat,
  setActiveChatId,
} from "@/redux/chat/slice";
import {
  fetchConversationMessages,
  removeConversation,
  renameConversation,
} from "@/redux/chat/operations";
import { setIsCreateProjectModalOpen } from "@/redux/ui/slice";

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
}: HeaderRightSideProps) {
  const dispatch = useAppDispatch();

  const isAuthed = useAppSelector(selectIsLoggedIn);
  const user = useAppSelector(selectUser);
  const chatList = useAppSelector(selectChatList);

  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const result = getModelGroupAndItem(selectedModel);
  const { modelMode, setModelMode } = useModelMode();

  const handleSelectChat = (id: string) => {
    dispatch(setActiveChatId(id));
    if (isDraftId(id)) return;
    const chat = chatList.find((c) => c.id === id);
    if (chat && !chat.messagesLoaded) dispatch(fetchConversationMessages(id));
  };

  const handleDeleteChat = (id: string) => {
    if (isDraftId(id)) dispatch(deleteDraftChat(id));
    else dispatch(removeConversation(id));
  };

  const handleRenameChat = (chatId: string, newTitle: string) => {
    dispatch(renameChat({ chatId, newTitle })); // optimistic local update
    if (!isDraftId(chatId)) {
      dispatch(renameConversation({ id: chatId, title: newTitle }));
    }
  };

  return (
    <div className={styles.container}>
      <LeftSideDrawer
        className={styles.menuTrigger}
        onNewChat={() => dispatch(handleNewChat())}
        onNewProject={() => dispatch(setIsCreateProjectModalOpen(true))}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        modelMode={modelMode}
        setModelMode={setModelMode}
        chatList={chatList}
        setActiveChatId={handleSelectChat}
        deleteChat={handleDeleteChat}
        renameChat={handleRenameChat}
        modelRef={modelRef}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        selectedModelGroup={selectedModelGroup}
        setSelectedModelGroup={setSelectedModelGroup}
      />

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
        <div
          className={styles.modelGptitiContainer}
          onClick={() => setIsModalOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsModalOpen(true);
            }
          }}
        >
          <ModelGptitiTitleWithIcon
            modelRef={modelRef}
            selectedModel={selectedModel}
            setIsModalOpen={setIsModalOpen}
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
        <div className={styles.userAvatarContainer}>
          <Image
            className={styles.userAvatar}
            src={user?.avatar || "/icons/ghost-user.svg"}
            width={36}
            height={36}
            alt={user?.email || "user-avatar"}
          />
        </div>
      )}
    </div>
  );
}
