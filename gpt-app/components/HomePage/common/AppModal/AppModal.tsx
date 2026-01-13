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
};

export default function AppModal({
  open,
  onClose,
  title,
  children,
  showCloseButton = true,
}: AppModalProps) {
  return (
    <Dialog open={open}
        onClose={onClose}
        maxWidth={false}
        fullWidth={false}
        slotProps={{
            paper: { className: styles.paper },
        }}
    >
      {title != null && (
        <DialogTitle className={styles.title}>
          <span className={styles.titleText}>{title}</span>

          {showCloseButton && (
             <IconButton className={styles.closeBtn} aria-label="Close modal" onClick={onClose} size="small">
                <CloseIcon className={styles.closeIcon} fontSize="small" />
            </IconButton>
          )}
        </DialogTitle>
      )}

      <DialogContent className={styles.content} dividers>
        {children}</DialogContent>
      </Dialog>
  );
}