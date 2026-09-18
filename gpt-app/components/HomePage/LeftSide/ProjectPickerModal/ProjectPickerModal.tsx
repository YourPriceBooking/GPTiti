"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Project } from "@/types/types";
import styles from "./ProjectPickerModal.module.css";

type ProjectPickerModalProps = {
  projects: Project[];
  onClose: () => void;
  onConfirm: (projectId: string) => void;
};

export default function ProjectPickerModal({
  projects,
  onClose,
  onConfirm,
}: ProjectPickerModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.container}
        role="dialog"
        aria-modal="true"
        aria-label="Choose a project"
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.header}>
          <Image
            src="/icons/project-picker.svg"
            alt=""
            width={44}
            height={44}
          />
          <div>
            <h2 className={styles.title}>Choose a project</h2>
            <p className={styles.subtitle}>
              Select where you want to move this chat.
            </p>
          </div>
        </header>

        {projects.length > 0 ? (
          <ul className={styles.list}>
            {projects.map((project) => {
              const isSelected = project.id === selectedId;
              return (
                <li key={project.id}>
                  <button
                    type="button"
                    className={`${styles.item} ${
                      isSelected ? styles.itemSelected : ""
                    }`}
                    aria-pressed={isSelected}
                    onClick={() => setSelectedId(project.id)}
                  >
                    <Image
                      src="/icons/project-folder.svg"
                      alt=""
                      width={16}
                      height={14}
                    />
                    <span className={styles.itemTitle}>{project.title}</span>
                    {isSelected && (
                      <Image
                        src="/icons/project-selected.svg"
                        alt=""
                        width={24}
                        height={24}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className={styles.empty}>No other projects yet.</p>
        )}

        <footer className={styles.footer}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.moveButton}
            disabled={!selectedId}
            onClick={() => selectedId && onConfirm(selectedId)}
          >
            Move
          </button>
        </footer>
      </div>
    </div>
  );
}
