import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import AIModelSlugPage from "@/components/AIModelGuide/AIModelSlugPage";
import Gpt54 from "@/components/AIModelGuide/models/Gpt54";
import Gpt54Mini from "@/components/AIModelGuide/models/Gpt54Mini";
import Gpt51 from "@/components/AIModelGuide/models/Gpt51";
import Gpt51Mini from "@/components/AIModelGuide/models/Gpt51Mini";
import Gpt51Realtime from "@/components/AIModelGuide/models/Gpt51Realtime";
import Gpt4o from "@/components/AIModelGuide/models/Gpt4o";
import Gpt4oMini from "@/components/AIModelGuide/models/Gpt4oMini";
import Gpt4oRealtime from "@/components/AIModelGuide/models/Gpt4oRealtime";
import O1 from "@/components/AIModelGuide/models/O1";
import O1Mini from "@/components/AIModelGuide/models/O1Mini";
import O3Mini from "@/components/AIModelGuide/models/O3Mini";
import CompareGpt54VsO1 from "@/components/AIModelGuide/models/CompareGpt54VsO1";
import CompareGpt54MiniVsGpt4oMini from "@/components/AIModelGuide/models/CompareGpt54MiniVsGpt4oMini";
import CompareGpt4oVsGpt51 from "@/components/AIModelGuide/models/CompareGpt4oVsGpt51";
import CompareO1VsO3Mini from "@/components/AIModelGuide/models/CompareO1VsO3Mini";
import type { ReactNode } from "react";

type Props = { params: Promise<{ slug: string }> };

type ModelEntry = {
  title: string;
  content: ReactNode;
  meta: { title: string; desc: string };
};

const modelData: Record<string, ModelEntry> = {
  "gpt-5-4": {
    title: "GPT-5.4 AI Model — Maximum Performance",
    content: <Gpt54 />,
    meta: {
      title: "GPT-5.4 — Most Powerful AI Model for Complex Tasks | GPTiti",
      desc: "GPT-5.4 is the most powerful AI model for coding, content, and complex tasks. Perfect for professionals who need top-level performance and accuracy.",
    },
  },
  "gpt-5-4-mini": {
    title: "GPT-5.4-mini AI Model — Best Balance",
    content: <Gpt54Mini />,
    meta: {
      title: "GPT-5.4-mini — Best AI Model for Chat, Writing & Coding | GPTiti",
      desc: "GPT-5.4-mini is the best AI model for chat, writing, and coding. It offers the perfect balance of cost and quality. Get ~75 messages with 10,000 tokens.",
    },
  },
  "gpt-5-1": {
    title: "GPT-5.1 AI Model — Advanced Performance",
    content: <Gpt51 />,
    meta: {
      title: "GPT-5.1 — Advanced AI Model for Work, Coding & Content | GPTiti",
      desc: "GPT-5.1 is a powerful AI model for writing, coding, and business tasks. Better performance than mid-tier models with balanced cost and quality.",
    },
  },
  // "gpt-5-1-mini": {
  //   title: "GPT-5.1-mini",
  //   // content: <Gpt51Mini />,
  //   meta: {
  //     title: "GPT-5.4 — Most Powerful AI Model for Complex Tasks | GPTiti",
  //     desc: "GPT-5.4 is the most powerful AI model for coding, content, and complex tasks. Perfect for professionals who need top-level performance and accuracy.",
  //   },
  // },
  "gpt-5-1-realtime": {
    title: "GPT-5.1 Realtime — Live AI Interaction",
    content: <Gpt51Realtime />,
    meta: {
      title:
        "GPT-5.1 Realtime — Live AI Model for Voice & Instant Chat | GPTiti",
      desc: "GPT-5.1-realtime is a real-time AI model for voice chat and instant interaction. Perfect for live assistants and streaming AI experiences.",
    },
  },
  "gpt-4o": {
    title: "GPT-4o AI Model",
    content: <Gpt4o />,
    meta: {
      title: "GPT-4o — Fast & Powerful AI Model for Chat & Writing | GPTiti",
      desc: "GPT-4o is a fast and powerful AI model for chat, writing, and everyday tasks. Better quality than basic models with balanced cost and performance.",
    },
  },
  "gpt-4o-mini": {
    title: "GPT-4o-mini AI Model — Fast & Affordable",
    content: <Gpt4oMini />,
    meta: {
      title: "GPT-4o-mini — Fast & Cheap AI Model for Chat | GPTiti",
      desc: "GPT-4o-mini is a fast and affordable AI model for everyday chat, writing, and simple tasks. Get up to 260 messages with 10,000 tokens.",
    },
  },
  "gpt-4o-realtime": {
    title: "GPT-4o Realtime — Fast Live AI",
    content: <Gpt4oRealtime />,
    meta: {
      title:
        "GPT-4o Realtime — Fast & Affordable AI for Voice & Live Chat | GPTiti",
      desc: "GPT-4o-realtime is a fast and affordable AI model for voice chat and real-time interaction. Ideal for live assistants and interactive apps.",
    },
  },
  // o1: {
  //   title: "O1",
  //   // content: <O1 />,
  //   meta: {
  //     title: "O1 — Advanced Reasoning AI Model | GPTiti",
  //     desc: "O1 on GPTiti — advanced reasoning model ideal for math, science, coding, and complex problem solving.",
  //   },
  // },
  "o1-mini": {
    title: "O1-mini AI Model — Efficient Reasoning",
    content: <O1Mini />,
    meta: {
      title: "O1-mini — Affordable AI Model for Reasoning & Coding | GPTiti",
      desc: "O1-mini is a powerful AI model for reasoning, coding, and problem solving. Get strong logic and structured answers at a lower cost than O1.",
    },
  },
  // "o3-mini": {
  //   title: "O3-mini",
  // content: <O3Mini />,
  //   meta: {
  //     title: "O1-mini — Affordable AI Model for Reasoning & Coding | GPTiti",
  //     desc: "O1-mini is a powerful AI model for reasoning, coding, and problem solving. Get strong logic and structured answers at a lower cost than O1.",
  //   },
  // },
  // "compare-gpt-5-4-vs-o1": {
  //   title: "GPT-5.4 vs O1",
  //   // content: <CompareGpt54VsO1 />,
  //   meta: {
  //     title: "GPT-5.4 vs O1 — Model Comparison | GPTiti",
  //     desc: "Compare GPT-5.4 and O1 on GPTiti. See which model is better for your use case — content generation vs advanced reasoning.",
  //   },
  // },
  "compare-gpt-5-4-mini-vs-gpt-4o-mini": {
    title: "GPT-5.4-mini vs GPT-4o-mini — Which AI Model Should You Choose?",
    content: <CompareGpt54MiniVsGpt4oMini />,
    meta: {
      title: "GPT-5.4-mini vs GPT-4o-mini — Comparison | GPTiti",
      desc: "Compare GPT-5.4-mini vs GPT-4o-mini. Learn the difference in cost, quality, and performance to choose the best AI model for your needs.",
    },
  },
  // "compare-gpt-4o-vs-gpt-5-1": {
  //   title: "GPT-4o vs GPT-5.1",
  //   // content: <CompareGpt4oVsGpt51 />,
  //   meta: {
  //     title: "GPT-5.4-mini vs GPT-4o-mini — Which AI Model is Better? | GPTiti",
  //     desc: "Compare GPT-4o and GPT-5.1 on GPTiti. Understand the upgrade from GPT-4o to the GPT-5 generation.",
  //   },
  // },
  "compare-o1-vs-o3-mini": {
    title: "O1 vs O3-mini — Which AI Reasoning Model Should You Choose?",
    content: <CompareO1VsO3Mini />,
    meta: {
      title: "O1 vs O3-mini — Best AI Model for Reasoning? | GPTiti",
      desc: "Compare O1 vs O3-mini AI models. Learn which is better for reasoning, logic, and problem solving based on cost and performance.",
    },
  },
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const data = modelData[slug];
  if (!data) return {};
  return buildMetadata(data.meta.title, data.meta.desc);
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;
  const data = modelData[slug];
  if (!data) notFound();

  return <AIModelSlugPage title={data.title} content={data.content} />;
}
