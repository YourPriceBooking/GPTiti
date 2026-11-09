import LibrarySession from "@/components/Files/LibrarySession";
import SharedLayoutChat from "@/components/SharedLayout/SharedLayoutChat";
import { SocketProvider } from "@/context/SocketContext";
import BalanceSync from "@/components/BalanceSync/BalanceSync";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SocketProvider>
      <BalanceSync />
      <LibrarySession />
      <SharedLayoutChat>{children}</SharedLayoutChat>
    </SocketProvider>
  );
}
