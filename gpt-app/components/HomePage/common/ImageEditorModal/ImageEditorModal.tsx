"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

import ImageEditor from "./ImageEditor";

import css from "./ImageEditorModal.module.css";

type ImageEditorModalProps = {
  open: boolean;
  source: string;
  fileName: string;
  onSave: (file: File, url: string) => void;
  onClose: () => void;
};

const ImageEditorModal = ({
  open,
  source,
  fileName,
  onSave,
  onClose,
}: ImageEditorModalProps) => {
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className={css.overlay}>
      <div className={css.editorBox}>
        <ImageEditor
          source={source}
          fileName={fileName}
          onSave={onSave}
          onClose={onClose}
        />
      </div>
    </div>,
    document.body
  );
};

export default ImageEditorModal;
