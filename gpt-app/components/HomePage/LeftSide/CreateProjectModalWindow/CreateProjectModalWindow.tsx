import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./CreateProjectModalWindow.module.css";

type CreateProjectModalWindowProps = {
  onCancel: () => void;
  onCreate: (name: string) => void;
};

export default function CreateProjectModalWindow({
  onCancel,
  onCreate,
}: CreateProjectModalWindowProps) {
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const trimmedName = name.trim();
  const canCreate = trimmedName.length > 0;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  const handleCreate = () => {
    if (!canCreate) return;
    onCreate(trimmedName);
  };

  return (
    <div
      className={styles.container}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-project-title"
    >
      <header className={styles.header}>
          <div className={styles.headerIcon}>
            <Image
              src="/icons/create-modal-project.svg"
              alt="create-project"
              width={36}
              height={36}
            />
          </div>
          <div className={styles.headerText}>
            <h2 id="create-project-title" className={styles.title}>
              Create project
            </h2>
            <p className={styles.subtitle}>
              Group chats by task, client, product, or idea.
            </p>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onCancel}
            aria-label="Close"
          >
            <Image
              src="/icons/close-modal-project.svg"
              alt="close"
              width={20}
              height={20}
            />
          </button>
        </header>

        <label className={styles.fieldLabel} htmlFor="create-project-name">
          Project name
        </label>
        <input
          id="create-project-name"
          ref={inputRef}
          className={styles.input}
          type="text"
          placeholder="Example: Website Redesign"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleCreate();
          }}
        />

        <div className={styles.infoBox}>
          <div className={styles.infoIcon}>
            <Image
              src="/icons/info-modal-project.svg"
              alt="info"
              width={4}
              height={26}
            />
          </div>
          <div className={styles.infoText}>
            <p className={styles.infoTitle}>What will be saved here</p>
            <p className={styles.infoParagraph}>
              Chats, links, images, edited images and uploaded files stay in
              this project history until the project is deleted.
            </p>
          </div>
        </div>
        <footer className={styles.footer}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.createButton}
            onClick={handleCreate}
            disabled={!canCreate}
          >
            Create project
          </button>
        </footer>
    </div>
  );
}
