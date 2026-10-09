"use client";

import {
  useState,
  useLayoutEffect,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";

import AddSomethingToInput from "../AddSomethingToInput/AddSomethingToInput";
import LoginModal from "@/components/HomePage/common/LoginModal/LoginModal";
import ErrorPatchImgModal, {
  LimitKind,
} from "@/components/HomePage/common/ErrorPatchImgModal/ErrorPatchImgModal";
import ImageEditorModal from "@/components/HomePage/common/ImageEditorModal/ImageEditorModal";

import { useAppSelector } from "@/redux/hooks";
import { selectIsLoggedIn } from "@/redux/auth/selectors";
import { selectActiveChatId } from "@/redux/chat/selectors";
import { selectActiveProjectId } from "@/redux/ui/selectors";
import { useDictation } from "@/hooks/useDictation";
import {
  MAX_DICTATION_MS,
  insertDictation,
  type DraftSelection,
} from "@/lib/dictation/protocol";
import { DictationStopIcon, DictationWaveform } from "./DictationVisuals";

import { getModelLimits } from "@/config/modelLimits.config";
import { isModelComingSoon } from "@/config/models.config";
import { compressImage } from "@/lib/compressImage";

import styles from "./InputBar.module.css";

const MB = 1024 * 1024;
const TOOLTIP_VIEWPORT_GAP = 8;

const fitInputTooltipToViewport = (trigger: HTMLElement) => {
  const tooltip = trigger.querySelector<HTMLElement>("[data-input-tooltip]");
  if (!tooltip) return;

  tooltip.style.setProperty("--tooltip-shift", "0px");
  requestAnimationFrame(() => {
    if (!tooltip.isConnected) return;

    const inputBar = trigger.closest<HTMLElement>("[data-input-bar]");
    const inputBarRect = inputBar?.getBoundingClientRect();
    const rect = tooltip.getBoundingClientRect();
    const allowedLeft = Math.max(
      TOOLTIP_VIEWPORT_GAP,
      (inputBarRect?.left ?? 0) + TOOLTIP_VIEWPORT_GAP,
    );
    const allowedRight = Math.min(
      window.innerWidth - TOOLTIP_VIEWPORT_GAP,
      (inputBarRect?.right ?? window.innerWidth) - TOOLTIP_VIEWPORT_GAP,
    );
    let shift = 0;

    if (rect.left < allowedLeft) {
      shift = allowedLeft - rect.left;
    } else if (rect.right > allowedRight) {
      shift = allowedRight - rect.right;
    }

    tooltip.style.setProperty("--tooltip-shift", `${shift}px`);
  });
};

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
  placeholder = "Ask anything...",
  variant = "default",
  isAiResponding = false,
  sendDisabled = false,
}: {
  hasInput: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: (
    message: string,
    imageUrls?: string[],
    imageFiles?: File[],
  ) => Promise<boolean>;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  onHideSection: () => void;
  templateTick: number;
  setHasFirstRequest: React.Dispatch<React.SetStateAction<boolean>>;
  hasFirstRequest: boolean;
  selectedModel: string;
  onImagesChange?: (count: number) => void;
  placeholder?: string;
  variant?: "default" | "project";
  isAiResponding?: boolean;
  sendDisabled?: boolean;
}) {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const activeChatId = useAppSelector(selectActiveChatId);
  const activeProjectId = useAppSelector(selectActiveProjectId);
  const dictationScope = `${activeChatId ?? "new"}:${activeProjectId ?? "none"}:${selectedModel}`;
  const dictation = useDictation(dictationScope, isLoggedIn);
  const voiceBusy = !["idle", "error"].includes(dictation.phase);
  const waveVisible = ["recording", "stopping", "transcribing"].includes(
    dictation.phase,
  );
  const draftSelectionRef = useRef<DraftSelection | null>(null);
  const voiceActionRef = useRef({ token: 0, busy: false });
  const finishVoiceRef = useRef<(action: "edit" | "send") => Promise<void>>(
    async () => {},
  );
  const [clock, setClock] = useState({ startedAt: 0, seconds: 0 });
  const [voiceNotice, setVoiceNotice] = useState<{
    scope: string;
    message: string;
  } | null>(null);
  const elapsedSeconds =
    clock.startedAt === dictation.startedAt ? clock.seconds : 0;

  const cancelDictation = useCallback(() => {
    voiceActionRef.current = {
      token: voiceActionRef.current.token + 1,
      busy: false,
    };
    draftSelectionRef.current = null;
    setVoiceNotice(null);
    dictation.cancel();
  }, [dictation.cancel]);

  useLayoutEffect(() => {
    draftSelectionRef.current = null;
    voiceActionRef.current = {
      token: voiceActionRef.current.token + 1,
      busy: false,
    };
  }, [dictationScope, isLoggedIn]);

  useEffect(() => {
    const startedAt = dictation.startedAt;
    if (!startedAt || dictation.phase !== "recording") return;
    const timer = setInterval(() => {
      const duration = Date.now() - startedAt;
      setClock({ startedAt, seconds: Math.floor(duration / 1000) });
      if (duration >= MAX_DICTATION_MS) void finishVoiceRef.current("edit");
    }, 500);
    return () => clearInterval(timer);
  }, [dictation.startedAt, dictation.phase]);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") cancelDictation();
    };
    if (!voiceBusy) return;
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [voiceBusy, cancelDictation]);

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
  const [isSending, setIsSending] = useState(false);
  const isSendingRef = useRef(false);
  const [editingImage, setEditingImage] = useState<{
    id: string;
    url: string;
    file: File;
  } | null>(null);

  const limits = useMemo(() => getModelLimits(selectedModel), [selectedModel]);
  const isComingSoon = useMemo(
    () => isModelComingSoon(selectedModel),
    [selectedModel],
  );
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
  }, [isMultiline, waveVisible]);

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

  useLayoutEffect(() => {
    const textarea = inputRef.current;
    if (!textarea) return;
    onChange({
      target: textarea,
    } as React.ChangeEvent<HTMLTextAreaElement>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isSendingRef.current || voiceBusy) return;
    setVoiceNotice(null);
    onChange(e);
    syncComposer();
  };

  const addImageFiles = async (incoming: File[]) => {
    if (isSendingRef.current || incoming.length === 0) return;

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

    if (isSendingRef.current) {
      processed.forEach((image) => URL.revokeObjectURL(image.url));
      return;
    }

    setImages((prev) => [...prev, ...processed]);

    if (rejectedForSize) openLimitError("imageSize");
    else if (trimmedForCount) openLimitError("imagesCount");
  };

  const addFiles = (incoming: File[]) => {
    if (isSendingRef.current || incoming.length === 0) return;

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
    if (isSendingRef.current) {
      e.preventDefault();
      return;
    }
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
    if (isSendingRef.current) return;
    const image = images.find((img) => img.id === id);
    if (image) URL.revokeObjectURL(image.url);

    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleEditedImage = (file: File, url: string) => {
    if (isSendingRef.current) {
      URL.revokeObjectURL(url);
      return;
    }
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
    if (isSendingRef.current) return;
    setShowAddInput(false);
    void addImageFiles(files);
  };

  const handleFileSelect = (selected: File[]) => {
    if (isSendingRef.current) return;
    setShowAddInput(false);
    addFiles(selected);
  };

  const removeFile = (id: string) => {
    if (isSendingRef.current) return;
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSend = async () => {
    if (isComingSoon || sendDisabled || isSendingRef.current || isAiResponding)
      return;
    const textarea = inputRef.current;
    if (textarea) {
      const message = textarea.value;
      const hasContent =
        message.trim() !== "" || images.length > 0 || files.length > 0;
      if (hasContent) {
        if (
          limits.maxTextChars !== null &&
          message.length > limits.maxTextChars
        ) {
          openLimitError("textLength");
          return;
        }
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
        isSendingRef.current = true;
        textarea.readOnly = true;
        setIsSending(true);
        setShowAddInput(false);
        setEditingImage(null);
        try {
          const accepted = await onSend(
            message,
            images.map((img) => img.url),
            images.map((img) => img.file),
          );
          if (!accepted) return;
          images.forEach((image) => URL.revokeObjectURL(image.url));
          setImages([]);
          setFiles([]);
          onHideSection();
          if (!hasFirstRequest) setHasFirstRequest(true);
          textarea.value = "";
          onChange({
            target: textarea,
          } as React.ChangeEvent<HTMLTextAreaElement>);
          setIsMultiline(false);
          resizeTextarea();
        } catch {
          setVoiceNotice({
            scope: dictationScope,
            message:
              "Could not send your message. Your text is kept here — try again.",
          });
        } finally {
          isSendingRef.current = false;
          textarea.readOnly = false;
          setIsSending(false);
        }
      }
    }
  };

  const startDictation = () => {
    if (
      isSendingRef.current ||
      voiceBusy ||
      dictation.recording ||
      isComingSoon ||
      isAiResponding
    )
      return;
    if (!isLoggedIn) {
      setIsLoginOpen(true);
      return;
    }
    const textarea = inputRef.current;
    if (!textarea) return;
    draftSelectionRef.current = {
      text: textarea.value,
      start: textarea.selectionStart ?? textarea.value.length,
      end: textarea.selectionEnd ?? textarea.value.length,
    };
    setShowAddInput(false);
    setVoiceNotice(null);
    void dictation.start();
  };

  const finishDictation = async (action: "edit" | "send") => {
    if (
      voiceActionRef.current.busy ||
      (action === "send" && (sendDisabled || isAiResponding))
    )
      return;
    const textarea = inputRef.current;
    if (!textarea) return;
    const token = voiceActionRef.current.token + 1;
    voiceActionRef.current = { token, busy: true };
    try {
      const transcript = await dictation.finish();
      if (
        !transcript ||
        voiceActionRef.current.token !== token ||
        inputRef.current !== textarea ||
        !textarea.isConnected
      )
        return;
      const saved = draftSelectionRef.current;
      const selection =
        saved?.text === textarea.value
          ? saved
          : {
              text: textarea.value,
              start: textarea.selectionStart ?? textarea.value.length,
              end: textarea.selectionEnd ?? textarea.value.length,
            };
      const result = insertDictation(selection, transcript);
      textarea.value = result.text;
      onChange({ target: textarea } as React.ChangeEvent<HTMLTextAreaElement>);
      syncComposer();
      const tooLong =
        limits.maxTextChars !== null &&
        result.text.length > limits.maxTextChars;
      if (tooLong) {
        setVoiceNotice({
          scope: dictationScope,
          message:
            "Your transcript exceeds this model's text limit. Shorten it before sending.",
        });
        openLimitError("textLength");
      }
      if (action === "send" && !tooLong) await handleSend();
      else
        requestAnimationFrame(() => {
          if (!textarea.isConnected) return;
          textarea.focus();
          textarea.setSelectionRange(result.caret, result.caret);
          syncComposer();
        });
    } finally {
      if (voiceActionRef.current.token === token)
        voiceActionRef.current.busy = false;
    }
  };

  useLayoutEffect(() => {
    finishVoiceRef.current = finishDictation;
  });

  const saveRecording = () => {
    const audio = dictation.recording?.audio;
    if (!audio) return;
    const extension = audio.type.includes("mp4")
      ? "m4a"
      : audio.type.includes("ogg")
        ? "ogg"
        : "webm";
    const url = URL.createObjectURL(audio);
    const link = document.createElement("a");
    link.href = url;
    link.download = `gptiti-dictation.${extension}`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (!voiceBusy) void handleSend();
    }
  };

  return (
    <div
      className={`${styles.inputContainer} ${
        isMultiline && !waveVisible ? styles.multiline : ""
      } ${variant === "project" ? styles.project : ""} ${waveVisible ? styles.dictating : ""}`}
      data-input-bar
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
                onClick={() => {
                  if (!isSendingRef.current) setEditingImage(img);
                }}
              />
              <button
                type="button"
                aria-label="Edit image"
                className={styles.editImageBtn}
                onClick={() => {
                  if (!isSendingRef.current) setEditingImage(img);
                }}
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
                className={styles.removeImageBtn}
                type="button"
                aria-label="Remove image"
                onClick={() => removeImage(img.id)}
              >
                <svg
                  width={12}
                  height={12}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z"
                  />
                </svg>
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
          <button
            type="button"
            aria-label="Add files and more"
            className={styles.iconWrapper}
            disabled={isSending || voiceBusy}
            onPointerEnter={(event) =>
              fitInputTooltipToViewport(event.currentTarget)
            }
            onFocus={(event) => fitInputTooltipToViewport(event.currentTarget)}
            onClick={() => {
              if (isSendingRef.current || voiceBusy) return;
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
            <span
              className={styles.inputTooltip}
              data-input-tooltip
              role="tooltip"
            >
              Add files and more
            </span>
          </button>
        </div>

        <div className={styles.inputSlot}>
          <textarea
            ref={inputRef}
            className={styles.input}
            placeholder={placeholder}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            readOnly={isSending || voiceBusy}
            aria-label="Message"
            rows={1}
            maxLength={limits.maxTextChars ?? undefined}
          />
          {waveVisible && (
            <div className={styles.dictationWaveSlot}>
              <DictationWaveform stream={dictation.stream} />
            </div>
          )}
        </div>

        <div className={styles.rightControls} ref={rightControlsRef}>
          <button
            type="button"
            className={`${styles.iconWrapper1} ${styles.controlButton}`}
            disabled={
              isSending ||
              isAiResponding ||
              isComingSoon ||
              dictation.phase === "stopping" ||
              dictation.phase === "transcribing" ||
              !!dictation.recording
            }
            aria-label={
              dictation.phase === "recording"
                ? "Stop dictation"
                : dictation.phase === "requesting"
                  ? "Cancel microphone request"
                  : "Dictate"
            }
            onPointerEnter={(event) =>
              fitInputTooltipToViewport(event.currentTarget)
            }
            onFocus={(event) => fitInputTooltipToViewport(event.currentTarget)}
            onClick={() => {
              if (dictation.phase === "recording") void finishDictation("edit");
              else if (dictation.phase === "requesting") cancelDictation();
              else startDictation();
            }}
          >
            {dictation.phase === "recording" ? (
              <DictationStopIcon active />
            ) : voiceBusy ? (
              <span className={styles.buttonSpinner} aria-hidden="true" />
            ) : (
              <svg
                className={styles.inputIcon}
                width={35}
                height={35}
                viewBox="0 0 35 35"
                aria-hidden="true"
              >
                <use href="/icons/input-sprite.svg#ib-microphone" />
              </svg>
            )}
            <span
              className={styles.inputTooltip}
              data-input-tooltip
              role="tooltip"
            >
              {dictation.phase === "recording"
                ? "Stop and edit"
                : dictation.phase === "requesting"
                  ? "Cancel"
                  : "Dictate"}
            </span>
          </button>

          {waveVisible || dictation.recording ? (
            <button
              type="button"
              className={`${styles.iconWrapper2} ${styles.controlButton} ${styles.voiceSend}`}
              disabled={
                dictation.phase === "stopping" ||
                dictation.phase === "transcribing" ||
                sendDisabled ||
                isAiResponding ||
                isSending
              }
              aria-label="Send dictated message"
              onPointerEnter={(event) =>
                fitInputTooltipToViewport(event.currentTarget)
              }
              onFocus={(event) =>
                fitInputTooltipToViewport(event.currentTarget)
              }
              onClick={() => void finishDictation("send")}
            >
              <svg
                className={styles.sendIcon}
                width={35}
                height={35}
                viewBox="0 0 44 44"
                aria-hidden="true"
              >
                <use href="/icons/input-sprite.svg#ib-send" />
              </svg>
              <span
                className={styles.inputTooltip}
                data-input-tooltip
                role="tooltip"
              >
                Send dictated message
              </span>
            </button>
          ) : isAiResponding || isSending ? (
            <div
              className={styles.iconWrapper2}
              tabIndex={0}
              onPointerEnter={(event) =>
                fitInputTooltipToViewport(event.currentTarget)
              }
              onFocus={(event) =>
                fitInputTooltipToViewport(event.currentTarget)
              }
            >
              <svg
                className={styles.sendIcon}
                width={35}
                height={35}
                viewBox="0 0 44 44"
                role="img"
                aria-label={isSending ? "sending" : "generating"}
              >
                <use href="/icons/input-sprite.svg#ib-stop" />
              </svg>
              <span
                className={styles.inputTooltip}
                data-input-tooltip
                role="tooltip"
              >
                {isSending ? "Sending..." : "Stop answering"}
              </span>
            </div>
          ) : hasInput || images.length > 0 || files.length > 0 ? (
            <button
              type="button"
              className={`${styles.iconWrapper2} ${styles.controlButton}`}
              disabled={sendDisabled || voiceBusy}
              aria-label="Send message"
              onPointerEnter={(event) =>
                fitInputTooltipToViewport(event.currentTarget)
              }
              onFocus={(event) =>
                fitInputTooltipToViewport(event.currentTarget)
              }
              onClick={() => void handleSend()}
            >
              <svg
                className={styles.sendIcon}
                width={35}
                height={35}
                viewBox="0 0 44 44"
                aria-hidden="true"
              >
                <use href="/icons/input-sprite.svg#ib-send" />
              </svg>
              <span
                className={styles.inputTooltip}
                data-input-tooltip
                role="tooltip"
              >
                {sendDisabled ? "Preparing chat..." : "Send message"}
              </span>
            </button>
          ) : null}
        </div>

        <span className={styles.measure} ref={measureRef} aria-hidden="true" />
      </div>

      {voiceBusy && (
        <div className={styles.dictationStatus} role="status">
          <span>
            {dictation.phase === "requesting"
              ? "Preparing microphone…"
              : dictation.phase === "recording"
                ? "Listening"
                : "Transcribing…"}
          </span>
          {dictation.phase === "recording" && (
            <span className={styles.recordingTime} aria-hidden="true">
              {Math.floor(elapsedSeconds / 60)}:
              {String(elapsedSeconds % 60).padStart(2, "0")}
            </span>
          )}
          <button type="button" onClick={cancelDictation}>
            Cancel
          </button>
        </div>
      )}
      {(dictation.error || voiceNotice?.scope === dictationScope) && (
        <div className={styles.dictationError}>
          <p role="alert">{dictation.error || voiceNotice?.message}</p>
          {dictation.recording && (
            <div className={styles.recordingActions}>
              <button
                type="button"
                onClick={() => void finishDictation("edit")}
              >
                Retry transcription
              </button>
              <button type="button" onClick={saveRecording}>
                Save audio
              </button>
              <button type="button" onClick={cancelDictation}>
                Discard recording
              </button>
            </div>
          )}
        </div>
      )}

      {isComingSoon && (
        <div className={styles.comingSoonOverlay}>
          <div className={styles.comingSoonBadge}>
            <span className={styles.comingSoonDot} />
            <span className={styles.comingSoonTitle}>
              This model is coming soon.
            </span>
            <span className={styles.comingSoonHint}>
              Choose another model to continue.
            </span>
          </div>
        </div>
      )}

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
