import Image from "next/image";
import styles from "./MenuItem.module.css";

type MenuItemProps = {
  icon: string;
  iconWidth: number;
  iconHeight: number;
  label: string;
  subtitle?: string;
  danger?: boolean;
  onClick?: () => void;
};

export default function MenuItem({
  icon,
  iconWidth,
  iconHeight,
  label,
  subtitle,
  danger,
  onClick,
}: MenuItemProps) {
  return (
    <button type="button" className={styles.button} onClick={onClick}>
      <span className={styles.iconWrap}>
        <Image src={icon} alt="" width={iconWidth} height={iconHeight} />
      </span>
      <span className={styles.content}>
        <span className={`${styles.label} ${danger ? styles.danger : ""}`}>
          {label}
        </span>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </span>
    </button>
  );
}
