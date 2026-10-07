import styles from "./ActionTooltip.module.css";

export default function ActionTooltip({ label }: { label: string }) {
  return (
    <span className={styles.tooltip} aria-hidden="true">
      {label}
    </span>
  );
}
