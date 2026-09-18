import ConfirmModalWindow from "./ConfirmModalWindow";

export type ChatAction = "archive" | "move" | "remove";

export type PendingChatAction = { action: ChatAction; chatId: string };

const CONTENT = {
  archive: {
    icon: "/icons/archive-modal.svg",
    title: "Archive this chat?",
    lines: [
      "This chat will be moved to Archived chats.",
      "You can restore it anytime.",
    ],
    confirmLabel: "Archive",
  },
  move: {
    icon: "/icons/move-modal.svg",
    title: "Move to project?",
    lines: [
      "Choose a project to keep this chat",
      "and related work together.",
    ],
    confirmLabel: "Choose project",
  },
  remove: {
    icon: "/icons/remove-modal.svg",
    title: "Remove from project?",
    lines: [
      "This chat will return to your chat list.",
      "Its messages will remain unchanged.",
    ],
    confirmLabel: "Remove",
  },
};

type ChatActionModalProps = {
  action: ChatAction;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ChatActionModal({
  action,
  onCancel,
  onConfirm,
}: ChatActionModalProps) {
  return (
    <ConfirmModalWindow
      variant={action}
      {...CONTENT[action]}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
