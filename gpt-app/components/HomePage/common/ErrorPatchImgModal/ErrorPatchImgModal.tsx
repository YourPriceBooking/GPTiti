"use client";

import AppModal from "@/components/HomePage/common/AppModal/AppModal";
import Image from "next/image";

import {
  type LimitKind,
  getLimitMessage,
} from "@/config/limitMessages";

import css from "./ErrorPatchImgModal.module.css";

export type { LimitKind };

type ErrorPatchImgModalProps = {
  open: boolean;
  onClose: () => void;
  /** What rule was violated. Defaults to "imagesNotSupported" for back-compat. */
  kind?: LimitKind;
  /** Active model — its display name is interpolated into the message. */
  model: string;
};

const ErrorPatchImgModal = ({
  open,
  onClose,
  kind = "imagesNotSupported",
  model,
}: ErrorPatchImgModalProps) => {
  const { heading, body, note } = getLimitMessage(kind, model);

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
        <h2 className={css.heading}>{heading}</h2>
        <div className={css.warning}>
          <Image
            className={css.warningIcon}
            src="/icons/trust/warning.svg"
            width={25}
            height={25}
            alt="warn put images"
          />
          <p className={css.warningText}>{body}</p>
        </div>
        {note && <p className={css.note}>{note}</p>}
      </div>
    </AppModal>
  );
};

export default ErrorPatchImgModal;
