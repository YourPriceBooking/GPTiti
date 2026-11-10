import type { ReactNode } from "react";

import { notFound } from "next/navigation";

import AIModelSlugPage from "@/components/AIModelGuide/AIModelSlugPage";
import Gpt54 from "@/components/AIModelGuide/models/Gpt54";
import Gpt54Mini from "@/components/AIModelGuide/models/Gpt54Mini";
import BestAiModelForChat from "@/components/AIModelGuide/models/BestAiModelForChat";
import Gpt55 from "@/components/AIModelGuide/models/Gpt55";
import CompareGpt55VsGpt54 from "@/components/AIModelGuide/models/CompareGpt55VsGpt54";

import { buildMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ slug: string }> };

type ModelEntry = {
  title: string;
  content: ReactNode;
  meta: { title: string; desc: string };
  model?: string;
};

const modelData: Record<string, ModelEntry> = {
  "gpt-5-5": {
    title: "GPT-5.5 AI Model — Premium Intelligence for Advanced Work",
    content: <Gpt55 />,
    model: "gpt-5.5",
    meta: {
      title: "GPT-5.5 — Premium AI Model for Advanced Work | GPTiti",
      desc: "GPT-5.5 is a premium AI model for advanced reasoning, coding, analysis, writing, and professional work. Learn when to use GPT-5.5, its pros, cons, token cost, and best alternatives.",
    },
  },
  "gpt-5-4": {
    title: "GPT-5.4 AI Model — Maximum Performance",
    content: <Gpt54 />,
    model: "gpt-5.4",
    meta: {
      title: "GPT-5.4 — Most Powerful AI Model for Complex Tasks | GPTiti",
      desc: "GPT-5.4 is the most powerful AI model for coding, content, and complex tasks. Perfect for professionals who need top-level performance and accuracy.",
    },
  },
  "gpt-5-4-mini": {
    title: "GPT-5.4-mini AI Model — Best Balance",
    content: <Gpt54Mini />,
    model: "gpt-5.4-mini",
    meta: {
      title: "GPT-5.4-mini — Best AI Model for Chat, Writing & Coding | GPTiti",
      desc: "GPT-5.4-mini is the best AI model for chat, writing, and coding. It offers the perfect balance of cost and quality. Get ~75 messages with 10,000 tokens.",
    },
  },
  "compare-gpt-5-5-vs-gpt-5-4": {
    title: "GPT-5.5 vs GPT-5.4 — Which AI Model Should You Choose?",
    content: <CompareGpt55VsGpt54 />,
    model: "gpt-5.5",
    meta: {
      title: "GPT-5.5 vs GPT-5.4 — Which AI Model Should You Choose? | GPTiti",
      desc: "Compare GPT-5.5 vs GPT-5.4 in GPTiti. Learn the difference in quality, reasoning, coding, speed, cost, token usage, best use cases, pros and cons.",
    },
  },
  "best-ai-model-for-chat": {
    title: "Best AI Model for Chat — Which One Should You Use?",
    content: <BestAiModelForChat />,
    meta: {
      title: "Best AI Model for Chat — Compare GPT Models | GPTiti",
      desc: "Find the best AI model for chat. Compare GPT-5.4-mini, GPT-5.4, and GPT-5.5 based on cost, speed, and quality.",
    },
  },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(modelData).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const data = modelData[slug];
  if (!data) notFound();
  return buildMetadata(data.meta.title, data.meta.desc);
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;
  const data = modelData[slug];
  if (!data) notFound();

  return (
    <AIModelSlugPage
      title={data.title}
      content={data.content}
      model={data.model}
    />
  );
}
