import styles from './AIResponse.module.css';

export function generateAIResponse(userText: string) {
  return (
        <div className={styles.aiBlock}>
          <h2 className={styles.aiTitle}>✅ Рекомендовані стилі (під твій інтерфейс)</h2>
  
          <p className={styles.aiSubtitle}>1. Заголовок блоку</p>
          <p className={styles.aiText}>
            (наприклад: “2. Баланс білого простору”) пппппппппппппппппппппппппппппппронононгоононорр
          </p>
          <ul className={styles.aiList}>
            <li>Font size: 20–22px</li>
            <li>Font weight: 600</li>
            <li>Line height: 130%</li>
            <li>Letter spacing: 0</li>
            <li>Color: #1A1A1A</li>
          </ul>
  
          <p className={styles.aiSubtitle}>2. Підзаголовок / підписи</p>
          <p className={styles.aiText}>
            (рядки типу “Зараз воно:”, “Зроби:”) птптьпрьрпьпбььптатрпьрьптиваиапитттттттттттттттттттии
          </p>
          <ul className={styles.aiList}>
            <li>Font size: 16px</li>
            <li>Font weight: 500</li>
            <li>Line height: 140%</li>
            <li>Letter spacing: 0</li>
          </ul>
        </div>
      );
}