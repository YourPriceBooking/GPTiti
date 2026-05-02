import SharedLayoutChat from "@/components/SharedLayout/SharedLayoutChat";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return <SharedLayoutChat>{children}</SharedLayoutChat>;
}
