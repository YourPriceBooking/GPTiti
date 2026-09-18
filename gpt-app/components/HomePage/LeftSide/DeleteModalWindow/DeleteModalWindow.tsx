import ConfirmModalWindow from "../ConfirmModalWindow/ConfirmModalWindow";

type DeleteModalWindowProps = {
  onCancel: () => void;
  onConfirm: () => void;
  type?: "chat" | "project";
};

export default function DeleteModalWindow({
  onCancel,
  onConfirm,
  type = "chat",
}: DeleteModalWindowProps) {
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
      onConfirm={onConfirm}
    />
  );
}
