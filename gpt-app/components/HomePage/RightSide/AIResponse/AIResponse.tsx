import Image from "next/image";
import styles from "./AIResponse.module.css";

export default function AIResponse() {
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

      <ul className={styles.aiList}>
        <li>
          <p className={styles.aiListParagraph}>1) Setup (Day 1–2)</p>
          <span className={styles.aiListSpan}>
            • Pick 3 default models • pricing tokens • /models endpoint
          </span>
        </li>
        <li>
          <p className={styles.aiListParagraph}>2) Core chat (Day 3–6)</p>
          <span className={styles.aiListSpan}>
            • Threads + history • usage tracking • limits per user • UI polish
          </span>
        </li>
        <li>
          <p className={styles.aiListParagraph}>3) Payments & top-up (Day 7–10)</p>
          <span className={styles.aiListSpan}>
            • Stripe checkout • webhooks → add tokens • receipts • retries
          </span>
        </li>
        <li>
          <p className={styles.aiListParagraph}>4) Launch (Day 11–14)</p>
          <span className={styles.aiListSpan}>
            • QA + monitoring • landing copy • beta users • deploy + backup
          </span>
        </li>
      </ul>
    </div>
  );
}
