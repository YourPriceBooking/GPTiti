import Image from "next/image";
import styles from "./AIResponse.module.css";

export default function AIResponse({ content }: { content: string }) {
  return (
    <div className={styles.aiBlock}>
      <h2 className={styles.aiTitle}>
        <Image
          src="/icons/rabbit.svg"
          alt="logo-rabbit"
          height={41}
          width={41}
        />
        <p className={styles.aiParagraph}>GPTiti</p>
      </h2>

      <p className={styles.aiContent}>{content}</p>
    </div>
  );
}
