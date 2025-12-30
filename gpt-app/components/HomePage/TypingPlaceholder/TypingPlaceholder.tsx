import styles from "./TypingPlaceholder.module.css";
import Image from "next/image";

export default function TypingPlaceholder() {
  return (
    <div className={styles.placeholderBlock}>
      <div className={styles.header}>
        <Image
          src="/icons/rabbit.svg"
          alt="logo-rabbit"
          height={41}
          width={41}
        />
        <div>
          <p className={styles.title}>GPTiti</p>
          <span className={styles.typingText}>typing</span>
        </div>
      </div>

      <div className={styles.dotsContainer}>
        <span className={styles.dot}></span>
        <span className={styles.dot}></span>
        <span className={styles.dot}></span>
      </div>

      <div className={styles.skeleton}>
        <div className={styles.skeletonLine}></div>
        <div className={styles.skeletonLine}></div>
        <div className={styles.skeletonLine}></div>
      </div>
    </div>
  );
}
