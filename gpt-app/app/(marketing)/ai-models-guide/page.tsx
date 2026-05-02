import AIModelGuide from "@/components/AIModelGuide/AIModelGuide";
import { buildMetadata } from "@/lib/metadata";

const metadata = buildMetadata(
  "AI Models Guide — Compare GPT, O-Series & Realtime Models | GPTiti",
  "Explore and compare all AI models on GPTiti. Learn the differences between GPT-5, GPT-4o, O-series, and realtime models. Find the best AI for chat, coding, and reasoning.",
);

export default function AiModelsGuidePage() {
  return <AIModelGuide />;
}
