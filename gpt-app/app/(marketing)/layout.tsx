import SharedLayoutMarketing from "@/components/SharedLayout/SharedLayoutMarketing";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SharedLayoutMarketing>{children}</SharedLayoutMarketing>;
}
