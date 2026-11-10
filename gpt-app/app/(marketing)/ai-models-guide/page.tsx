import AIModelGuide from "@/components/AIModelGuide/AIModelGuide";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata(
  "AI Models Guide — Compare GPT Models | GPTiti",
  "Compare GPT-5.4-mini, GPT-5.4, and GPT-5.5 on GPTiti. Find the right AI model for chat, coding, and reasoning.",
);

export default function AiModelsGuidePage() {
  return <AIModelGuide />;
}
