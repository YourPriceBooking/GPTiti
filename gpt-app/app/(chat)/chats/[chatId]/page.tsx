"use client";

import { useParams } from "next/navigation";

import AppShell from "../../_home/AppShell";
import ChatView from "../../_home/ChatView";
// import NotFound from "../../_home/NotFound";

export default function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();

  // а AppShell повертає користувача на початкову сторінку:
  // {(ctrl) =>
  //   ctrl.activeChat || !ctrl.chatsLoaded ? (
  //     <ChatView ctrl={ctrl} showBreadcrumbs />
  //   ) : (
  //     <NotFound title="Chat not found" />
  //   )
  // }
  return (
    <AppShell chatId={chatId} chatLayout requireAuth>
      {(ctrl) => <ChatView ctrl={ctrl} showBreadcrumbs />}
    </AppShell>
  );
}
