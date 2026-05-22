"use client";

import AppModal from "@/components/HomePage/common/AppModal/AppModal";
import Image from "next/image";

import css from "./ErrorPatchImgModal.module.css";

export type ErrorPatchImgVariant = "unsupported" | "tooMany" | "tooLarge";

type ErrorPatchImgModalProps = {
  open: boolean;
  onClose: () => void;
  variant?: ErrorPatchImgVariant;
  /** For `"tooMany"`: max images allowed by the active model. */
  maxImages?: number;
  /** For `"tooLarge"`: max image size in MB allowed by the active model. */
  maxImageSizeMb?: number;
};

type VariantContent = {
  heading: string;
  warning: string;
  note: React.ReactNode;
};

const buildContent = (
  variant: ErrorPatchImgVariant,
  maxImages?: number,
  maxImageSizeMb?: number,
): VariantContent => {
  if (variant === "tooMany") {
    return {
      heading: "Too many images for this model",
      warning: `This model accepts up to ${maxImages ?? 0} image${
        (maxImages ?? 0) === 1 ? "" : "s"
      } per message.`,
      note: (
        <>
          Please remove some of the attached images, or switch to a model with a
          larger image quota (for example
          <span className={css.models}>gpt-5.5, gpt-5.4, gpt-5.1, gpt-4o</span>
          ).
        </>
      ),
    };
  }
  if (variant === "tooLarge") {
    return {
      heading: "Image is too large",
      warning: `Each image must be ${maxImageSizeMb ?? 0} MB or smaller for this model.`,
      note: (
        <>
          Try resizing the image or attaching a smaller version. Larger
          attachments are available on
          <span className={css.models}>premium models</span>.
        </>
      ),
    };
  }
  return {
    heading: "This model doesn’t support images",
    warning: "You added an image, but this model can’t process image inputs.",
    note: (
      <>
        Please note that the following models do not support images in your
        request:
        <span className={css.models}>
          o1, o1-mini, o3-mini, gpt-4o-realtime, gpt-5.1-realtime.
        </span>
      </>
    ),
  };
};

const ErrorPatchImgModal = ({
  open,
  onClose,
  variant = "unsupported",
  maxImages,
  maxImageSizeMb,
}: ErrorPatchImgModalProps) => {
  const { heading, warning, note } = buildContent(
    variant,
    maxImages,
    maxImageSizeMb,
  );

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
          <p className={css.warningText}>{warning}</p>
        </div>
        <p className={css.note}>{note}</p>
      </div>
    </AppModal>
  );
};

export default ErrorPatchImgModal;
