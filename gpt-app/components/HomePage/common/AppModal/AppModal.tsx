"use client";

import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./AppModal.module.css";

type AppModalProps = {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  showCloseButton?: boolean;
  dividers?: boolean;
  paperClassName?: string;
  titleClassName?: string;
  contentClassName?: string;
  closeBtnClassName?: string;
};

export default function AppModal({
  open,
  onClose,
  title,
  children,
  showCloseButton = true,
  dividers = true,
  paperClassName,
  titleClassName,
  contentClassName,
  closeBtnClassName,
}: AppModalProps) {
  return (
    <Dialog open={open}
        onClose={onClose}
        maxWidth={false}
        fullWidth={false}
        slotProps={{
            paper: { className: `${styles.paper} ${paperClassName ?? ""}` },
        }}
    >
      {title != null ? (
        <DialogTitle className={`${styles.title} ${titleClassName ?? ""}`}>
          <span className={styles.titleText}>{title}</span>

          {showCloseButton && (
             <IconButton className={`${styles.closeBtn} ${closeBtnClassName ?? ""}`} aria-label="Close modal" onClick={onClose} size="small">
                <CloseIcon className={styles.closeIcon} fontSize="small" />
            </IconButton>
          )}
        </DialogTitle>
      ) : (
        showCloseButton && (
          <IconButton
            className={`${styles.closeBtn} ${styles.closeBtnFloating} ${closeBtnClassName ?? ""}`}
            aria-label="Close modal"
            onClick={onClose}
            size="small"
          >
            <CloseIcon className={styles.closeIcon} fontSize="small" />
          </IconButton>
        )
      )}

      <DialogContent className={`${styles.content} ${contentClassName ?? ""}`} dividers={dividers}>
        {children}</DialogContent>
      </Dialog>
  );
}