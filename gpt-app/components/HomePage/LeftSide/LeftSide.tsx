import styles from "./LeftSide.module.css";
import FooterLeftSide from "./FooterLeftSide/FooterLeftSide";
import { LeftSideProps, Project } from "@/types/types";
import SectionGptUser from "./SectionGptUser/SectionGptUser";
import SectionGptChats from "./SectionGptChats/SectionGptChats";
import SectionGptTokens from "./SectionGptTokens/SectionGptTokens";
import { useState } from "react";
import Image from "next/image";
import WsDebugPanel from "@/components/common/WsDebugPanel/WsDebugPanel";

// TODO: replace with redux project data
const TEMP_PROJECTS: Project[] = [
  { id: "p1", title: "Website Redesign" },
  { id: "p2", title: "Mobile App" },
  { id: "p3", title: "API Integration" },
  { id: "p4", title: "API Integration1" },
];

export default function LeftSide({
  onNewChat,
  onNewProject,
  chatList,
  setActiveChatId,
  deleteChat,
  renameChat,
  modelRef,
  modelMode,
  setModelMode,
  selectedModel,
  setSelectedModel,
  selectedModelGroup,
  setSelectedModelGroup,
  isModalOpen,
  setIsModalOpen,
}: LeftSideProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={styles.chatsScrollArea}
      style={{
        width: isOpen ? "330px" : "64px",
        transition: "width 0.3s ease-in-out",
      }}
    >
      <div className={styles.container}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={styles.toggleButton}
          aria-label={isOpen ? "Hide panel" : "Show panel"}
        >
          <Image
            src="/chevron-left.svg"
            alt=""
            width={24}
            height={24}
            className={styles.chevron}
            style={{
              transform: !isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          />
        </button>
        {isOpen ? (
          <div
            className={`${styles.panelContent} ${
              isOpen ? styles.panelContentShow : styles.panelContentHide
            }`}
          >
            <SectionGptTokens
              modelRef={modelRef}
              modelMode={modelMode}
              setModelMode={setModelMode}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              selectedModelGroup={selectedModelGroup}
              setSelectedModelGroup={setSelectedModelGroup}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
            />

            <SectionGptChats
              onNewChat={onNewChat}
              onNewProject={onNewProject}
              projectList={TEMP_PROJECTS}
              chatList={chatList}
              setActiveChatId={setActiveChatId}
              deleteChat={deleteChat}
              renameChat={renameChat}
            />

            <SectionGptUser />

            {/* {process.env.NODE_ENV !== "production" && (
              <div style={{ marginTop: 12 }}>
                <WsDebugPanel />
              </div>
            )} */}

            <FooterLeftSide />
          </div>
        ) : (
          <div
            className={`${styles.collapsedContent} ${
              isOpen ? styles.collapsedHide : styles.collapsedShow
            }`}
          >
            <button
              onClick={() => setIsModalOpen(true)}
              className={styles.iconButton}
              aria-label="Select a model"
              title="Select a model"
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                />
              </svg>
            </button>

            <button
              onClick={onNewChat}
              className={styles.iconButton}
              aria-label="New chat"
              title="New chat"
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>

            <div className={styles.userIconBottom}>
              <div
                className={styles.userIconAvatar}
                title="henrinkwinta@gmail.com"
              >
                <Image
                  width={20}
                  height={26}
                  src="/icons/ghost-user.svg"
                  alt="user"
                  className={styles.userAvatarImage}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
