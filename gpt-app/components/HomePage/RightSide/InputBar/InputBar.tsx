import { useState, useLayoutEffect, useEffect, useRef } from "react";

import AddSomethingToInput from "../AddSomethingToInput/AddSomethingToInput";
import LoginModal from "@/components/HomePage/common/LoginModal/LoginModal";
import ErrorPatchImgModal from "@/components/HomePage/common/ErrorPatchImgModal/ErrorPatchImgModal";

import { useAppSelector } from "@/redux/hooks";
import { selectIsLoggedIn } from "@/redux/auth/selectors";

import styles from "./InputBar.module.css";

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
}: {
  hasInput: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: (message: string, imageUrls?: string[]) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  onHideSection: () => void;
  templateTick: number;
  setHasFirstRequest: React.Dispatch<React.SetStateAction<boolean>>;
  hasFirstRequest: boolean;
  selectedModel: string;
}) {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  const modalRef = useRef<HTMLDivElement | null>(null);

  const [isMultiline, setIsMultiline] = useState(false);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [showAddInput, setShowAddInput] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isImgErrorOpen, setIsImgErrorOpen] = useState(false);
  const [images, setImages] = useState<
    { id: string; url: string; file: File }[]
  >([]);

  const aviableModelImgPaste = [
    "o1",
    "o1-mini",
    "o3-mini",
    "gpt-5.1-realtime",
    "gpt-4o-realtime",
  ];

  const resizeTextarea = () => {
    const textarea = inputRef.current;
    if (!textarea) return;

    const hasImages = images.length > 0;
    const BASE = hasImages ? 140 : 68;
    const MAX = hasImages ? 320 : 240;

    const PB_NORMAL = hasImages ? 24 : 20;
    const PB_MULTI = 60;

    textarea.style.overflowY = "hidden";
    textarea.style.paddingBottom = `${PB_NORMAL}px`;
    textarea.style.height = `${BASE}px`;
    textarea.style.minHeight = "";
    textarea.scrollTop = 0;

    if (!textarea.value.trim()) {
      setIsMultiline(false);
      setShouldScroll(false);
      return;
    }

    const overflows = textarea.scrollHeight > textarea.clientHeight;

    if (!overflows) {
      setIsMultiline(false);
      setShouldScroll(false);
      return;
    }

    textarea.style.paddingBottom = `${PB_MULTI}px`;
    textarea.style.height = "auto";

    const full = textarea.scrollHeight;
    const next = Math.min(full + 2, MAX);
    textarea.style.height = `${next}px`;

    const needScroll = full > MAX;
    textarea.style.overflowY = needScroll ? "auto" : "hidden";
    textarea.scrollTop = 0;

    setIsMultiline(true);
    setShouldScroll(needScroll);
  };

  useLayoutEffect(() => {
    resizeTextarea();

    requestAnimationFrame(() => {
      resizeTextarea();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateTick, images.length]);

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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e);
    resizeTextarea();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = Array.from(e.clipboardData.items);
    const hasImage = items.some(
      (item) => item.kind === "file" && item.type.startsWith("image/"),
    );

    if (hasImage && aviableModelImgPaste.includes(selectedModel)) {
      e.preventDefault();
      setIsImgErrorOpen(true);
      return;
    }

    items.forEach((item) => {
      if (item.kind === "file" && item.type.startsWith("image/")) {
        const file = item.getAsFile();

        const url = URL.createObjectURL(file as any);

        setImages((prevs): any => [
          ...prevs,
          { id: crypto.randomUUID(), url, file },
        ]);
      }
    });
  };

  const removeImage = (id: string) => {
    const image = images.find((img) => img.id === id);
    if (image) URL.revokeObjectURL(image.url);

    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleImageSelect = (files: File[]) => {
    const newImages = files.map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      file,
    }));
    setImages((prev) => [...prev, ...newImages]);
    setShowAddInput(false);
  };

  const handleSend = () => {
    if (inputRef.current) {
      const message = inputRef.current.value;
      const hasContent = message.trim() !== "" || images.length > 0;
      if (hasContent) {
        if (!isLoggedIn) {
          setIsLoginOpen(true);
          return;
        }
        if (
          images.length > 0 &&
          aviableModelImgPaste.includes(selectedModel)
        ) {
          setIsImgErrorOpen(true);
          return;
        }
        onSend(
          message,
          images.map((img) => img.url),
        );
        setImages([]);
        onHideSection();
        if (!hasFirstRequest) {
          setHasFirstRequest(true);
        }
      }
      inputRef.current.value = "";
      inputRef.current.style.height = "68px";
      setIsMultiline(false);
      setShouldScroll(false);
    }
  };

  return (
    <div
      className={`
    ${styles.inputContainer}
    ${isMultiline ? styles.multiline : ""}
    ${shouldScroll ? styles.scrollable : ""}
    ${images.length > 0 ? styles.hasImages : ""}
  `}
    >
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
      {showAddInput && (
        <div
          className={`${styles.modalWrapper} ${showAddInput ? styles.visible : styles.hidden}`}
          ref={modalRef}
        >
          <AddSomethingToInput
            onImageSelect={handleImageSelect}
            isImageBlocked={aviableModelImgPaste.includes(selectedModel)}
            onImageBlocked={() => {
              setShowAddInput(false);
              setIsImgErrorOpen(true);
            }}
          />
        </div>
      )}

      {images.length > 0 && (
        <div className={styles.imagePreviewRow}>
          {images.map((img) => (
            <div key={img.id} className={styles.imageChip}>
              <img src={img.url} alt="pasted preview" />
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

      <textarea
        ref={inputRef}
        className={styles.input}
        placeholder="Ask anything..."
        onChange={handleChange}
        onPaste={handlePaste}
        rows={1}
      />

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

      {hasInput || images.length > 0 ? (
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

      <LoginModal open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <ErrorPatchImgModal
        open={isImgErrorOpen}
        onClose={() => setIsImgErrorOpen(false)}
      />
    </div>
  );
}
