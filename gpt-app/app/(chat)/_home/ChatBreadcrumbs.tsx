import Image from "next/image";
import Link from "next/link";

import ChatBubbleIcon from "@/components/common/ChatBubbleIcon";
import type { Chat } from "@/types/types";

import styles from "../page.module.css";

export default function ChatBreadcrumbs({ chat }: { chat?: Chat }) {
  return (
    <div className={styles.breadcrumbBar}>
      {chat && (
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          {chat.project ? (
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
          {chat.project ? (
            <>
              <Link
                href={`/projects/${chat.project.id}`}
                className={styles.breadcrumbProject}
              >
                {chat.project.title}
              </Link>
              <span className={styles.breadcrumbSeparator} aria-hidden="true">
                /
              </span>
              <span className={styles.breadcrumbCurrent} aria-current="page">
                {chat.title || "Untitled chat"}
              </span>
            </>
          ) : (
            <span
              className={`${styles.breadcrumbCurrent} ${styles.breadcrumbCurrentOnly}`}
              aria-current="page"
            >
              {chat.title || "Untitled chat"}
            </span>
          )}
        </nav>
      )}
    </div>
  );
}
