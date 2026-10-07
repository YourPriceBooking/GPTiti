"use client";

import { useEffect, useRef, useState } from "react";
import type { FocusEvent, KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

import ChatBubbleIcon from "@/components/common/ChatBubbleIcon";
import type { Chat } from "@/types/types";

import styles from "../page.module.css";

type ChatBreadcrumbsProps = {
  chat?: Chat;
  onRename?: (chatId: string, title: string) => void;
};

type RenameInputProps = {
  initialTitle: string;
  currentOnly: boolean;
  onCommit: (title: string) => void;
  onClose: () => void;
};

function RenameInput({
  initialTitle,
  currentOnly,
  onCommit,
  onClose,
}: RenameInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    const nextTitle = event.currentTarget.value.trim();
    if (!cancelledRef.current && nextTitle && nextTitle !== initialTitle) {
      onCommit(nextTitle);
    }
    onClose();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.blur();
    } else if (event.key === "Escape") {
      event.preventDefault();
      cancelledRef.current = true;
      event.currentTarget.blur();
    }
  };

  return (
    <input
      ref={inputRef}
      className={clsx(
        styles.breadcrumbRenameInput,
        currentOnly && styles.breadcrumbCurrentOnly,
      )}
      defaultValue={initialTitle}
      aria-label="Chat name"
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    />
  );
}

export default function ChatBreadcrumbs({
  chat,
  onRename,
}: ChatBreadcrumbsProps) {
  const [editingChatId, setEditingChatId] = useState<string | null>(null);

  if (!chat) return <div className={styles.breadcrumbBar} />;

  const { id, title: rawTitle, project } = chat;
  const title = rawTitle || "Untitled chat";
  const currentOnly = !project;
  const isEditing = editingChatId === id;

  const renderCurrent = () => {
    if (isEditing) {
      return (
        <RenameInput
          initialTitle={rawTitle ?? ""}
          currentOnly={currentOnly}
          onCommit={(next) => onRename?.(id, next)}
          onClose={() => setEditingChatId(null)}
        />
      );
    }

    const className = clsx(
      styles.breadcrumbCurrent,
      currentOnly && styles.breadcrumbCurrentOnly,
    );

    if (!onRename) {
      return (
        <span className={className} aria-current="page">
          {title}
        </span>
      );
    }

    return (
      <button
        type="button"
        className={clsx(className, styles.breadcrumbCurrentEditable)}
        aria-current="page"
        title="Rename chat"
        onClick={() => setEditingChatId(id)}
      >
        {title}
      </button>
    );
  };

  return (
    <div className={styles.breadcrumbBar}>
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        {project ? (
          <Image
            className={styles.breadcrumbIcon}
            src="/icons/breadcrumb-project.svg"
            alt=""
            width={24}
            height={20}
          />
        ) : (
          <ChatBubbleIcon
            className={styles.breadcrumbIcon}
            width={24}
            height={20}
          />
        )}

        {project && (
          <>
            <Link
              href={`/projects/${project.id}`}
              className={styles.breadcrumbProject}
            >
              {project.title}
            </Link>
            <span className={styles.breadcrumbSeparator} aria-hidden="true">
              /
            </span>
          </>
        )}

        {renderCurrent()}
      </nav>
    </div>
  );
}
