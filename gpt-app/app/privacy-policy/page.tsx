import { buildMetadata } from "@/lib/metadata";
import PrivacyPolicy from "@/components/PrivacyPolicy/PrivacyPolicy";

export const metadata = buildMetadata(
  "Privacy Policy | GPTiti — Data Protection & User Privacy",
  "Learn how GPTiti collects, uses, and protects your data. No cookies tracking, secure Google login, and full control over your chats and information.",
);

export default function PrivacyPage() {
  return <PrivacyPolicy />;
}
