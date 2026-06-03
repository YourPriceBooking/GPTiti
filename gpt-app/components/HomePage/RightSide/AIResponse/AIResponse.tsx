import Image from "next/image";
import styles from "./AIResponse.module.css";

type AIResponseProps = {
  content: string;
  modelId?: string;
};

export default function AIResponse({ content, modelId }: AIResponseProps) {
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
        {modelId && <span className={styles.aiModel}>{modelId}</span>}
      </h2>

      <p className={styles.aiContent}>{content}</p>
    </div>
  );
}
