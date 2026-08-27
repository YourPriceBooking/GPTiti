import SharedLayoutChat from "@/components/SharedLayout/SharedLayoutChat";
import { SocketProvider } from "@/context/SocketContext";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SocketProvider>
      <SharedLayoutChat>{children}</SharedLayoutChat>
    </SocketProvider>
  );
}
