import Link from "next/link";

import styles from "../page.module.css";

export default function NotFound({ title }: { title: string }) {
  return (
    <div className={styles.notFound}>
      <div className={styles.notFoundPanel}>
        <h1>{title}</h1>
        <p>It may have been deleted, or the link is no longer valid.</p>
        <div className={styles.notFoundActions}>
          <Link
            href="/projects"
            className={`${styles.notFoundAction} ${styles.notFoundPrimary}`}
          >
            My Projects
          </Link>
          <Link
            href="/"
            className={`${styles.notFoundAction} ${styles.notFoundGhost}`}
          >
            Start New Chat
          </Link>
        </div>
      </div>
    </div>
  );
}
