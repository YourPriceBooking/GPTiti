import Image from "next/image";

import InputBar from "@/components/HomePage/RightSide/InputBar/InputBar";
import ChooseModelColumn from "@/components/HomePage/RightSide/ChooseModelColumn/ChooseModelColumn";

import styles from "./ProjectWorkspace.module.css";

type ProjectWorkspaceProps = {
  name: string;
  chatCount?: number;
  onCreateFirstChat: () => void;
  inputProps: React.ComponentProps<typeof InputBar>;
  onChooseModel: () => void;
  showEstimate: boolean;
};

export default function ProjectWorkspace({
  name,
  chatCount = 0,
  onCreateFirstChat,
  inputProps,
  onChooseModel,
  showEstimate,
}: ProjectWorkspaceProps) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerIcon}>
          <Image
            src="/icons/create-modal-project.svg"
            alt="project"
            width={40}
            height={40}
          />
        </div>
        <div className={styles.headerText}>
          <h1 className={styles.title}>{name}</h1>
          <p className={styles.subtitle}>Project workspace</p>
          <p className={styles.description}>
            Organize chats, links, images, edited images and uploaded files in
            one place.
          </p>
        </div>
      </header>

      <div className={styles.inputRow}>
        <InputBar
          {...inputProps}
          placeholder="Start a new chat in this project"
          variant="project"
        />
        <div className={styles.modelRow}>
          <ChooseModelColumn
            selectedModel={inputProps.selectedModel}
            showEstimate={showEstimate}
            onChoose={onChooseModel}
          />
        </div>
      </div>

      <div className={styles.tabsRow}>
        <span className={styles.tab}>Chats</span>
        <span className={styles.counter}>
          <Image
            src="/icons/chat-bubble.svg"
            alt=""
            width={18}
            height={18}
          />
          {chatCount} chats
        </span>
      </div>

      <div className={styles.divider} />

      <div className={styles.emptyState}>
        <div className={styles.decorPattern} aria-hidden="true">
          <div className={styles.decorDots} />
        </div>
        <div className={styles.emptyContent}>
          <div className={styles.emptyIcon}>
            <Image
              src="/icons/create-modal-project.svg"
              alt=""
              width={36}
              height={36}
            />
          </div>
          <h2 className={styles.emptyTitle}>No chats yet</h2>
          <p className={styles.emptyDescription}>
            Create your first chat in this project. Chats, links, images, edited
            images, and uploaded files stay in this project history.
          </p>
          <button
            type="button"
            className={styles.createButton}
            onClick={onCreateFirstChat}
          >
            Create first chat
          </button>
        </div>
      </div>
    </div>
  );
}
