import { useState } from "react";
import styles from "./DeleteModalWindow.module.css";
import ConfirmModalWindow from "../ConfirmModalWindow/ConfirmModalWindow";

type DeleteModalWindowProps = {
  onCancel: () => void;
  onConfirm: (deleteFiles: boolean, deleteChats?: boolean) => void;
  type?: "chat" | "project";
};

export default function DeleteModalWindow({
  onCancel,
  onConfirm,
  type = "chat",
}: DeleteModalWindowProps) {
  const [deleteChats, setDeleteChats] = useState(true);
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
      onConfirm={() => onConfirm(deleteFiles && (type === "chat" || deleteChats), type === "project" && deleteChats)}
    >
      <div className={styles.option}>
        {type === "project" && <label className={styles.label}>
          <input type="checkbox" checked={deleteChats} onChange={e => { setDeleteChats(e.target.checked); if (!e.target.checked) setDeleteFiles(false); }} />
          <span>Also delete all chats in this project</span>
        </label>}
        <label className={styles.label}>
          <input type="checkbox" checked={deleteFiles} disabled={type === "project" && !deleteChats} onChange={e => setDeleteFiles(e.target.checked)} aria-describedby="delete-chat-files-warning" />
          <span>Also delete related files from the library</span>
        </label>
        <p id="delete-chat-files-warning" className={styles.warning}>
          {type === "project" && !deleteChats ? "Chats will move to your general chat list. Files will remain in your library." : deleteFiles ? "Includes uploaded, generated and reused files. They will also become unavailable in other chats that use them. Other chats’ messages will remain." : "Files will remain in your library and other chats."}
        </p>
      </div>
    </ConfirmModalWindow>
  );
}
