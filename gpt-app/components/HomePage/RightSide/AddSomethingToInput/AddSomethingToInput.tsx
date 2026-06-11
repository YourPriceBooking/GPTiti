import { useRef } from "react";
import styles from "./AddSomethingToInput.module.css";
import Image from "next/image";

const FILE_ACCEPT = ".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.md,.json,.ppt,.pptx";

export default function AddSomethingToInput({
  onImageSelect,
  onImageBlocked,
  isImageBlocked = false,
  onFileSelect,
  onFileBlocked,
  isFileBlocked = false,
}: {
  onImageSelect: (files: File[]) => void;
  onImageBlocked?: () => void;
  isImageBlocked?: boolean;
  onFileSelect: (files: File[]) => void;
  onFileBlocked?: () => void;
  isFileBlocked?: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    if (isImageBlocked) {
      onImageBlocked?.();
      return;
    }
    fileInputRef.current?.click();
  };

  const handleDocClick = () => {
    if (isFileBlocked) {
      onFileBlocked?.();
      return;
    }
    docInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    onImageSelect(files);
    e.target.value = "";
  };

  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    onFileSelect(files);
    e.target.value = "";
  };

  return (
    <div className={styles.addSomethingToInputContainer}>
      <div className={styles.addSomethingToInput}>
        {/* input для зображення */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        {/* input для файлів */}
        <input
          ref={docInputRef}
          type="file"
          accept={FILE_ACCEPT}
          multiple
          style={{ display: "none" }}
          onChange={handleDocChange}
        />
        <div className={styles.InfoContainer} onClick={handleDocClick}>
          <Image
            className={styles.InfoContainerIcon}
            width={14}
            height={14}
            src="/icons/file.png"
            alt="add file"
          />
          <div>
            <p className={styles.InfoContainerParagraph}>Add files</p>
            <span className={styles.InfoContainerSpan}>
              PDFs, Word, Excel, text, code
            </span>
          </div>
        </div>
        <div className={styles.InfoContainer} onClick={handleImageClick}>
          <Image
            className={styles.InfoContainerIcon}
            width={14}
            height={14}
            src="/icons/image1.png"
            alt="add image"
          />
          <div>
            <p className={styles.InfoContainerParagraph}>Add image</p>
            <span className={styles.InfoContainerSpan}>
              Screenshots or photos
            </span>
          </div>
        </div>
      </div>
      <div className={styles.addSomethingToInputSpanContainer}>
        <span className={styles.addSomethingToInputSpan}>
          Pricing depends on model content size{" "}
        </span>
      </div>
    </div>
  );
}
