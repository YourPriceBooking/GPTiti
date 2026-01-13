"use client";

import React from "react";
import Image from "next/image";
import styles from "./SimpleCheckbox.module.css";

export type SimpleCheckboxProps = {
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  ariaLabel?: string;
};

const ICONS = {
  unchecked: "/checkbox_unchecked.svg",
  hover: "/checkboxhover.svg",
  focus: "/checkbox_focus.svg",
  checked: "/checkbox_hecked.svg",
} as const;

export default function SimpleCheckbox({
  defaultChecked = false,
  disabled = false,
  onChange,
  ariaLabel = "Checkbox",
}: SimpleCheckboxProps) {
  const [checked, setChecked] = React.useState(defaultChecked);
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);

  const src = checked
    ? ICONS.checked
    : focused
    ? ICONS.focus
    : hovered
    ? ICONS.hover
    : ICONS.unchecked;

  const toggle = () => {
    if (disabled) return;
    setChecked((prev) => {
      const next = !prev;
      onChange?.(next);
      return next;
    });
  };

  return (
    <span className={styles.root}>
      <button
        type="button"
        className={styles.button}
        role="checkbox"
        aria-checked={checked}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={toggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            toggle();
          }
        }}
      >
        <Image
          className={styles.icon}
          src={src}
          alt=""
          width={20}
          height={20}
          unoptimized
        />
      </button>
    </span>
  );
}
