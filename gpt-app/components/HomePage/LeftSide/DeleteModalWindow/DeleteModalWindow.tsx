import { useState } from "react";
import styles from "./DeleteModalWindow.module.css";
import ConfirmModalWindow from "../ConfirmModalWindow/ConfirmModalWindow";

type DeleteModalWindowProps = {
  onCancel: () => void;
  onConfirm: (deleteFiles: boolean) => void;
  type?: "chat" | "project";
};

export default function DeleteModalWindow({
  onCancel,
  onConfirm,
  type = "chat",
}: DeleteModalWindowProps) {
  const [deleteFiles, setDeleteFiles] = useState(true);
  return (
    <ConfirmModalWindow
      variant="delete"
      icon="/icons/delete-modal.svg"
      title={`Delete this ${type}?`}
      lines={[
        "This action can't be undone.",
        `The ${type} will be permanently removed.`,
      ]}
      confirmLabel="Delete"
      onCancel={onCancel}
      onConfirm={() => onConfirm(type === "chat" && deleteFiles)}
    >
      {type === "chat" && <div className={styles.option}>
        <label className={styles.label}>
          <input type="checkbox" checked={deleteFiles} onChange={e => setDeleteFiles(e.target.checked)} aria-describedby="delete-chat-files-warning" />
          <span>Also delete all files linked to this chat from the library</span>
        </label>
        <p id="delete-chat-files-warning" className={styles.warning}>
          {deleteFiles ? "Includes uploaded, generated and reused files. They will also become unavailable in other chats that use them. Other chats’ messages will remain." : "Files will remain in your library and other chats."}
        </p>
      </div>}
    </ConfirmModalWindow>
  );
}
