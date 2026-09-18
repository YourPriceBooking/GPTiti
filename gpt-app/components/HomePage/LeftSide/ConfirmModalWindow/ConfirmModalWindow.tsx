import Image from "next/image";
import styles from "./ConfirmModalWindow.module.css";

export type ConfirmVariant = "delete" | "archive" | "move" | "remove";

type ConfirmModalWindowProps = {
  icon: string;
  title: string;
  lines: string[];
  confirmLabel: string;
  variant: ConfirmVariant;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmModalWindow({
  icon,
  title,
  lines,
  confirmLabel,
  variant,
  onCancel,
  onConfirm,
}: ConfirmModalWindowProps) {
  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>
        <Image src={icon} alt="" width={44} height={44} />
      </div>
      <div className={styles.infoContainer}>
        <h2 className={styles.title}>{title}</h2>
        {lines.map((line) => (
          <p key={line} className={styles.paragraph}>
            {line}
          </p>
        ))}
        <div className={styles.buttonsContainer}>
          <button className={styles.cancelButton} onClick={onCancel}>
            <span className={styles.cancelButtonText}>Cancel</span>
          </button>
          <button
            className={`${styles.confirmButton} ${styles[variant]}`}
            onClick={onConfirm}
          >
            <span className={styles.confirmButtonText}>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
