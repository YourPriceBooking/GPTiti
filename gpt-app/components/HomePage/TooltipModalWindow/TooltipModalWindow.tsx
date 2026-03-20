import React from 'react';
import styles from "./TooltipModalWindow.module.css";
import Image from "next/image";

type Props = {
  onClose: () => void;
};

export default function TooltipModalWindow({ onClose }: Props) {
  return (
    <div className={styles.tooltipContainer}>
      {/* Закриваюча іконка тільки для планшетів і менше */}
      <button className={styles.closeBtn} onClick={onClose}>
        <Image width={14} height={14} src="/icons/close.svg" alt="close" />
      </button>

      <h5 className={styles.tooltipTitle}>GPT-5.1</h5>
      <section className={styles.tooltipSection}>
        <p className={styles.tooltipParagraph}>
          Think deeper. Go further. Handles complex reasoning and long context.
        </p>
        <ul className={styles.tooltipList}>
          <li className={styles.tooltipListItem1}>✓ Exceptional reasoning</li>
          <li className={styles.tooltipListItem1}>✓ Best quality output</li>
        </ul>
        <ul className={styles.tooltipList1}>
          <li className={styles.tooltipListItem2}>— Slower</li>
          <li className={styles.tooltipListItem2}>— Higher cost</li>
        </ul>
      </section>
    </div>
  );
}
