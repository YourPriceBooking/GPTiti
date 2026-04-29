"use client";

import AppModal from "@/components/HomePage/common/AppModal/AppModal";
import Image from "next/image";

import css from "./ErrorPatchImgModal.module.css";

type ErrorPatchImgModalProps = {
  open: boolean;
  onClose: () => void;
};

const ErrorPatchImgModal = ({ open, onClose }: ErrorPatchImgModalProps) => {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      dividers={false}
      paperClassName={css.paper}
      titleClassName={css.title}
      contentClassName={css.content}
      closeBtnClassName={css.closeBtn}
    >
      <div className={css.wrapperModal}>
        <h2 className={css.heading}>This model doesn’t support images</h2>
        <div className={css.warning}>
          <Image
            className={css.warningIcon}
            src="/icons/trust/warning.svg"
            width={25}
            height={25}
            alt="warn put images"
          />
          <p className={css.warningText}>
            You added an image, but this model can’t process image inputs.
          </p>
        </div>
        <p className={css.note}>
          Please note that the following models do not support images in your
          request:
          <span className={css.models}>
            o1, o1-mini, o3-mini, gpt-4o-realtime, gpt-5.1-realtime.
          </span>
        </p>
      </div>
    </AppModal>
  );
};

export default ErrorPatchImgModal;
