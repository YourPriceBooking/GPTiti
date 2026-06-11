import { useState, useLayoutEffect, useEffect, useRef, useMemo } from "react";

import AddSomethingToInput from "../AddSomethingToInput/AddSomethingToInput";
import LoginModal from "@/components/HomePage/common/LoginModal/LoginModal";
import ErrorPatchImgModal, {
  LimitKind,
} from "@/components/HomePage/common/ErrorPatchImgModal/ErrorPatchImgModal";
import ImageEditorModal from "@/components/HomePage/common/ImageEditorModal/ImageEditorModal";

import { useAppSelector } from "@/redux/hooks";
import { selectIsLoggedIn } from "@/redux/auth/selectors";

import { getModelLimits } from "@/config/modelLimits.config";
import { compressImage } from "@/lib/compressImage";

import styles from "./InputBar.module.css";

const MB = 1024 * 1024;

const formatFileSize = (bytes: number) => {
  if (bytes >= MB) return `${(bytes / MB).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
};

const fileExtension = (name: string) => {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(dot + 1).toUpperCase() : "FILE";
};

export default function InputBar({
  hasInput,
  onChange,
  onSend,
  inputRef,
  onHideSection,
  templateTick,
  setHasFirstRequest,
  hasFirstRequest,
  selectedModel,
  onImagesChange,
}: {
  hasInput: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: (message: string, imageUrls?: string[], imageFiles?: File[]) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  onHideSection: () => void;
  templateTick: number;
  setHasFirstRequest: React.Dispatch<React.SetStateAction<boolean>>;
  hasFirstRequest: boolean;
  selectedModel: string;
  onImagesChange?: (count: number) => void;
}) {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  const modalRef = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const leftControlsRef = useRef<HTMLDivElement | null>(null);
  const rightControlsRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLSpanElement | null>(null);

  const [isMultiline, setIsMultiline] = useState(false);
  const [showAddInput, setShowAddInput] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLimitErrorOpen, setIsLimitErrorOpen] = useState(false);
  const [limitErrorKind, setLimitErrorKind] =
    useState<LimitKind>("imagesNotSupported");
  const [images, setImages] = useState<
    { id: string; url: string; file: File }[]
  >([]);
  const [files, setFiles] = useState<{ id: string; file: File }[]>([]);
  const [editingImage, setEditingImage] = useState<{
    id: string;
    url: string;
    file: File;
  } | null>(null);

  const limits = useMemo(() => getModelLimits(selectedModel), [selectedModel]);
  const isImageBlocked = limits.maxImages === 0;
  const maxImageBytes = limits.maxImageSizeMb * MB;
  const isFileBlocked = limits.maxFiles === 0;
  const maxFileBytes = limits.maxFileSizeMb * MB;

  const openLimitError = (kind: LimitKind) => {
    setLimitErrorKind(kind);
    setIsLimitErrorOpen(true);
  };

  const resizeTextarea = () => {
    const textarea = inputRef.current;
    if (!textarea) return;

    const MAX_HEIGHT = 240;

    textarea.style.height = "0px";
    const full = textarea.scrollHeight;
    textarea.style.height = `${Math.min(full, MAX_HEIGHT)}px`;
    textarea.style.overflowY = full > MAX_HEIGHT ? "auto" : "hidden";
  };

  const fitsSingleLine = () => {
    const textarea = inputRef.current;
    const body = bodyRef.current;
    const left = leftControlsRef.current;
    const right = rightControlsRef.current;
    const measure = measureRef.current;
    if (!textarea || !body || !left || !right || !measure) return true;

    const value = textarea.value;
    if (!value) return true;
    if (value.includes("\n")) return false;

    const taStyle = getComputedStyle(textarea);
    measure.style.fontFamily = taStyle.fontFamily;
    measure.style.fontSize = taStyle.fontSize;
    measure.style.fontWeight = taStyle.fontWeight;
    measure.style.fontStyle = taStyle.fontStyle;
    measure.style.letterSpacing = taStyle.letterSpacing;
    measure.textContent = value;

    const bodyStyle = getComputedStyle(body);
    const available =
      body.clientWidth -
      parseFloat(bodyStyle.paddingLeft) -
      parseFloat(bodyStyle.paddingRight) -
      left.offsetWidth -
      right.offsetWidth -
      2 * (parseFloat(bodyStyle.columnGap) || 0);

    return measure.getBoundingClientRect().width <= available - 2;
  };

  const syncComposer = () => {
    setIsMultiline(!fitsSingleLine());
    resizeTextarea();
  };

  useLayoutEffect(() => {
    syncComposer();

    requestAnimationFrame(() => {
      syncComposer();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateTick]);

  useLayoutEffect(() => {
    resizeTextarea();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMultiline]);

  useEffect(() => {
    const onWindowResize = () => syncComposer();
    window.addEventListener("resize", onWindowResize);
    return () => window.removeEventListener("resize", onWindowResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowAddInput(false);
      }
    };
    if (showAddInput) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAddInput]);

  useEffect(() => {
    onImagesChange?.(images.length);
  }, [images.length, onImagesChange]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e);
    syncComposer();
  };

  const addImageFiles = async (incoming: File[]) => {
    if (incoming.length === 0) return;

    if (isImageBlocked) {
      openLimitError("imagesNotSupported");
      return;
    }

    const remaining = Math.max(0, limits.maxImages - images.length);
    if (remaining === 0) {
      openLimitError("imagesCount");
      return;
    }

    const accepted: File[] = [];
    let trimmedForCount = false;
    let rejectedForSize = false;

    for (const file of incoming) {
      if (accepted.length >= remaining) {
        trimmedForCount = true;
        break;
      }
      if (maxImageBytes > 0 && file.size > maxImageBytes) {
        rejectedForSize = true;
        continue;
      }
      accepted.push(file);
    }

    if (accepted.length === 0) {
      if (rejectedForSize) openLimitError("imageSize");
      else if (trimmedForCount) openLimitError("imagesCount");
      return;
    }

    const processed = await Promise.all(
      accepted.map(async (file) => {
        const compressed = await compressImage(file).catch(() => file);
        return {
          id: crypto.randomUUID(),
          url: URL.createObjectURL(compressed),
          file: compressed,
        };
      }),
    );

    setImages((prev) => [...prev, ...processed]);

    if (rejectedForSize) openLimitError("imageSize");
    else if (trimmedForCount) openLimitError("imagesCount");
  };

  const addFiles = (incoming: File[]) => {
    if (incoming.length === 0) return;

    if (isFileBlocked) {
      openLimitError("filesNotSupported");
      return;
    }

    const remaining = Math.max(0, limits.maxFiles - files.length);
    if (remaining === 0) {
      openLimitError("filesCount");
      return;
    }

    const accepted: File[] = [];
    let trimmedForCount = false;
    let rejectedForSize = false;

    for (const file of incoming) {
      if (accepted.length >= remaining) {
        trimmedForCount = true;
        break;
      }
      if (maxFileBytes > 0 && file.size > maxFileBytes) {
        rejectedForSize = true;
        continue;
      }
      accepted.push(file);
    }

    if (accepted.length === 0) {
      if (rejectedForSize) openLimitError("fileSize");
      else if (trimmedForCount) openLimitError("filesCount");
      return;
    }

    setFiles((prev) => [
      ...prev,
      ...accepted.map((file) => ({ id: crypto.randomUUID(), file })),
    ]);

    if (rejectedForSize) openLimitError("fileSize");
    else if (trimmedForCount) openLimitError("filesCount");
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = Array.from(e.clipboardData.items);
    const pastedImages = items
      .filter((item) => item.kind === "file" && item.type.startsWith("image/"))
      .map((item) => item.getAsFile())
      .filter((f): f is File => f !== null);

    if (pastedImages.length > 0) {
      e.preventDefault();
      void addImageFiles(pastedImages);
      return;
    }

    if (limits.maxTextChars !== null) {
      const pastedText = e.clipboardData.getData("text") ?? "";
      if (pastedText.length === 0) return;

      const ta = inputRef.current;
      if (!ta) return;
      const selStart = ta.selectionStart ?? ta.value.length;
      const selEnd = ta.selectionEnd ?? selStart;
      const selectionLen = Math.max(0, selEnd - selStart);
      const projectedLen = ta.value.length - selectionLen + pastedText.length;

      if (projectedLen > limits.maxTextChars) {
        openLimitError("textLength");
      }
    }
  };

  const removeImage = (id: string) => {
    const image = images.find((img) => img.id === id);
    if (image) URL.revokeObjectURL(image.url);

    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleEditedImage = (file: File, url: string) => {
    const editedId = editingImage?.id;
    if (!editedId) return;

    setImages((prev) =>
      prev.map((img) => {
        if (img.id !== editedId) return img;
        URL.revokeObjectURL(img.url);
        return { ...img, url, file };
      }),
    );
    setEditingImage(null);
  };

  const handleImageSelect = (files: File[]) => {
    setShowAddInput(false);
    void addImageFiles(files);
  };

  const handleFileSelect = (selected: File[]) => {
    setShowAddInput(false);
    addFiles(selected);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSend = () => {
    if (inputRef.current) {
      const message = inputRef.current.value;
      const hasContent =
        message.trim() !== "" || images.length > 0 || files.length > 0;
      if (hasContent) {
        if (!isLoggedIn) {
          setIsLoginOpen(true);
          return;
        }
        if (images.length > 0 && isImageBlocked) {
          openLimitError("imagesNotSupported");
          return;
        }
        if (images.length > limits.maxImages) {
          openLimitError("imagesCount");
          return;
        }
        if (files.length > 0 && isFileBlocked) {
          openLimitError("filesNotSupported");
          return;
        }
        if (files.length > limits.maxFiles) {
          openLimitError("filesCount");
          return;
        }
        onSend(
          message,
          images.map((img) => img.url),
          images.map((img) => img.file),
        );
        setImages([]);
        setFiles([]);
        onHideSection();
        if (!hasFirstRequest) {
          setHasFirstRequest(true);
        }
      }
      inputRef.current.value = "";
      setIsMultiline(false);
      resizeTextarea();
    }
  };

  return (
    <div
      className={`${styles.inputContainer} ${
        isMultiline ? styles.multiline : ""
      }`}
    >
      {showAddInput && (
        <div
          className={`${styles.modalWrapper} ${
            showAddInput ? styles.visible : styles.hidden
          }`}
          ref={modalRef}
        >
          <AddSomethingToInput
            onImageSelect={handleImageSelect}
            isImageBlocked={isImageBlocked}
            onImageBlocked={() => {
              setShowAddInput(false);
              openLimitError("imagesNotSupported");
            }}
            onFileSelect={handleFileSelect}
            isFileBlocked={isFileBlocked}
            onFileBlocked={() => {
              setShowAddInput(false);
              openLimitError("filesNotSupported");
            }}
          />
        </div>
      )}

      {images.length > 0 && (
        <div className={styles.imagePreviewRow}>
          {images.map((img) => (
            <div key={img.id} className={styles.imageChip}>
              <img
                src={img.url}
                alt="pasted preview"
                onClick={() => setEditingImage(img)}
              />
              <button
                type="button"
                aria-label="Edit image"
                className={styles.editImageBtn}
                onClick={() => setEditingImage(img)}
              >
                <svg
                  width={12}
                  height={12}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                  />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Remove image"
                onClick={() => removeImage(img.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className={styles.filePreviewRow}>
          {files.map((f) => (
            <div key={f.id} className={styles.fileChip}>
              <span className={styles.fileChipExt}>
                {fileExtension(f.file.name)}
              </span>
              <div className={styles.fileChipInfo}>
                <span className={styles.fileChipName} title={f.file.name}>
                  {f.file.name}
                </span>
                <span className={styles.fileChipSize}>
                  {formatFileSize(f.file.size)}
                </span>
              </div>
              <button
                type="button"
                aria-label="Remove file"
                className={styles.fileChipRemove}
                onClick={() => removeFile(f.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className={styles.composerBody} ref={bodyRef}>
        <div className={styles.leftControls} ref={leftControlsRef}>
          <div
            className={styles.iconWrapper}
            tabIndex={0}
            onClick={() => {
              setShowAddInput((prev) => !prev);
            }}
          >
            <svg
              className={styles.inputIcon}
              width={28}
              height={28}
              viewBox="0 0 29 29"
              aria-hidden="true"
            >
              <use href="/icons/input-sprite.svg#ib-plus" />
            </svg>
          </div>
        </div>

        <textarea
          ref={inputRef}
          className={styles.input}
          placeholder="Ask anything..."
          onChange={handleChange}
          onPaste={handlePaste}
          rows={1}
          maxLength={limits.maxTextChars ?? undefined}
        />

        <div className={styles.rightControls} ref={rightControlsRef}>
          <div className={styles.iconWrapper1} tabIndex={0}>
            <svg
              className={styles.inputIcon}
              width={35}
              height={35}
              viewBox="0 0 35 35"
              aria-hidden="true"
            >
              <use href="/icons/input-sprite.svg#ib-microphone" />
            </svg>
          </div>

          {hasInput || images.length > 0 || files.length > 0 ? (
            <div
              className={`${styles.iconWrapper2} ${styles.disabledHover}`}
              onClick={handleSend}
            >
              <svg
                className={styles.sendIcon}
                width={35}
                height={35}
                viewBox="0 0 44 44"
                role="img"
                aria-label="send"
              >
                <use href="/icons/input-sprite.svg#ib-send" />
              </svg>
            </div>
          ) : (
            <div className={styles.iconWrapper2} tabIndex={0}>
              <svg
                className={styles.inputIcon}
                width={35}
                height={35}
                viewBox="0 0 35 35"
                role="img"
                aria-label="voice"
              >
                <use href="/icons/input-sprite.svg#ib-voice" />
              </svg>
            </div>
          )}
        </div>

        <span className={styles.measure} ref={measureRef} aria-hidden="true" />
      </div>

      {editingImage && (
        <ImageEditorModal
          open
          source={editingImage.url}
          fileName={editingImage.file.name}
          onSave={handleEditedImage}
          onClose={() => setEditingImage(null)}
        />
      )}

      <LoginModal open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <ErrorPatchImgModal
        open={isLimitErrorOpen}
        onClose={() => setIsLimitErrorOpen(false)}
        kind={limitErrorKind}
        model={selectedModel}
      />
    </div>
  );
}
