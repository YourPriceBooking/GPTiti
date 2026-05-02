import type { ReactNode } from "react";

import { notFound } from "next/navigation";

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
import BestAiModelForChat from "@/components/AIModelGuide/models/BestAiModelForChat";
import SmartSearch from "@/components/AIModelGuide/models/SmartSearch";
import CompareSmartSearchVsChat from "@/components/AIModelGuide/models/CompareSmartSearchVsChat";
import VoiceToText from "@/components/AIModelGuide/models/VoiceToText";
import CompareVoiceVsTextInput from "@/components/AIModelGuide/models/CompareVoiceVsTextInput";
import TextToSpeech from "@/components/AIModelGuide/models/TextToSpeech";
import CompareVoiceVsTextOutput from "@/components/AIModelGuide/models/CompareVoiceVsTextOutput";
import ImageCreateFast from "@/components/AIModelGuide/models/ImageCreateFast";
import ImageCreateHD from "@/components/AIModelGuide/models/ImageCreateHD";

import { buildMetadata } from "@/lib/metadata";

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
  "gpt-5-1-mini": {
    title: "GPT-5.1-mini AI Model — Smart & Affordable Performance",
    content: <Gpt51Mini />,
    meta: {
      title:
        "GPT-5.1-mini — Affordable AI Model with Strong Performance | GPTiti",
      desc: "GPT-5.1-mini is a balanced AI model with strong performance, better reasoning than basic models, and lower cost than GPT-5.1. Ideal for writing, coding, and daily work.",
    },
  },
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
  o1: {
    title: "O1 AI Model — Maximum Reasoning Power",
    content: <O1 />,
    meta: {
      title:
        "O1 — Most Powerful AI Model for Reasoning & Complex Problems | GPTiti",
      desc: "O1 is the most powerful reasoning AI model. Best for complex problems, advanced coding, and deep analysis. Use O1 when other models are not enough.",
    },
  },
  "o1-mini": {
    title: "O1-mini AI Model — Efficient Reasoning",
    content: <O1Mini />,
    meta: {
      title: "O1-mini — Affordable AI Model for Reasoning & Coding | GPTiti",
      desc: "O1-mini is a powerful AI model for reasoning, coding, and problem solving. Get strong logic and structured answers at a lower cost than O1.",
    },
  },
  "o3-mini": {
    title: "O3-mini AI Model — Affordable Reasoning Power",
    content: <O3Mini />,
    meta: {
      title:
        "O3-mini — Affordable AI Model for Reasoning & Structured Tasks | GPTiti",
      desc: "O3-mini is a cost-efficient AI model for reasoning, logic, and structured thinking. Best alternative to O1 for budget-friendly problem solving.",
    },
  },
  "compare-gpt-5-4-vs-o1": {
    title: "GPT-5.4 vs O1 — Which AI Model Should You Choose?",
    content: <CompareGpt54VsO1 />,
    meta: {
      title:
        "GPT-5.4 vs O1 — Which AI Model is Better for Your Tasks? | GPTiti",
      desc: "Compare GPT-5.4 vs O1. Learn which AI model is better for coding, reasoning, and complex tasks. Choose the right model based on cost, speed, and performance.",
    },
  },
  "compare-gpt-5-4-mini-vs-gpt-4o-mini": {
    title: "GPT-5.4-mini vs GPT-4o-mini — Which AI Model Should You Choose?",
    content: <CompareGpt54MiniVsGpt4oMini />,
    meta: {
      title: "GPT-5.4-mini vs GPT-4o-mini — Comparison | GPTiti",
      desc: "Compare GPT-5.4-mini vs GPT-4o-mini. Learn the difference in cost, quality, and performance to choose the best AI model for your needs.",
    },
  },
  "compare-gpt-4o-vs-gpt-5-1": {
    title: "GPT-4o vs GPT-5.1 — Which AI Model Should You Choose?",
    content: <CompareGpt4oVsGpt51 />,
    meta: {
      title: "GPT-4o vs GPT-5.1 — Which AI Model Should You Choose? | GPTiti",
      desc: "Compare GPT-4o vs GPT-5.1. Learn which AI model is better for chat, coding, and content based on performance, cost, and quality.",
    },
  },
  "compare-o1-vs-o3-mini": {
    title: "O1 vs O3-mini — Which AI Reasoning Model Should You Choose?",
    content: <CompareO1VsO3Mini />,
    meta: {
      title: "O1 vs O3-mini — Best AI Model for Reasoning? | GPTiti",
      desc: "Compare O1 vs O3-mini AI models. Learn which is better for reasoning, logic, and problem solving based on cost and performance.",
    },
  },
  "best-ai-model-for-chat": {
    title: "Best AI Model for Chat — Which One Should You Use?",
    content: <BestAiModelForChat />,
    meta: {
      title: "Best AI Model for Chat — Compare GPT Models | GPTiti",
      desc: "Find the best AI model for chat. Compare GPT-5.4, GPT-5.4-mini, GPT-4o-mini, and O1 based on cost, speed, and quality.",
    },
  },
  "smart-search": {
    title: "Smart Search AI — Search Your Data with AI",
    content: <SmartSearch />,
    meta: {
      title: "Smart Search AI — Search Your Data with AI | GPTiti",
      desc: "Smart Search AI lets you search documents, chats, and data using natural language. Powered by embeddings and GPT models for accurate results.",
    },
  },
  "compare-smart-search-vs-chat": {
    title: "Smart Search vs Chat AI — What’s the Difference?",
    content: <CompareSmartSearchVsChat />,
    meta: {
      title: "Smart Search vs Chat AI — What’s the Difference? | GPTiti",
      desc: "Compare Smart Search vs Chat AI. Learn how AI search works with embeddings vs GPT chat models and which is better for your use case.",
    },
  },
  "voice-to-text": {
    title: "Voice to Text AI — Convert Speech to Text Instantly",
    content: <VoiceToText />,
    meta: {
      title: "Voice to Text AI — Convert Speech to Text Instantly | GPTiti",
      desc: "Voice to Text AI converts speech into text instantly using advanced speech recognition models. Fast, accurate, and easy to use.",
    },
  },
  "compare-voice-vs-text-input": {
    title: "Voice vs Text Input — Which Is Better for AI?",
    content: <CompareVoiceVsTextInput />,
    meta: {
      title: "Voice vs Text Input — Which Is Better for AI? | GPTiti",
      desc: "Compare voice vs text input for AI. Learn which is faster, more accurate, and better for chat, productivity, and real-world use.",
    },
  },
  "text-to-speech": {
    title: "Text to Speech AI — Generate Realistic Voice from Text",
    content: <TextToSpeech />,
    meta: {
      title: "Text to Speech AI — Generate Realistic AI Voice | GPTiti",
      desc: "Text to Speech AI converts text into realistic voice. Learn how AI voice works, its advantages, and how it compares to human speech.",
    },
  },
  "compare-voice-vs-text-output": {
    title: "Voice vs Text Output — Listening vs Reading",
    content: <CompareVoiceVsTextOutput />,
    meta: {
      title:
        "Voice vs Text Output — Which Is Better for Learning & AI? | GPTiti",
      desc: "Compare voice vs text output. Is listening faster than reading? Learn which is better for productivity, learning, and AI interaction.",
    },
  },
  "image-create-hd": {
    title: "AI Image Generator (HD) — High Quality Text to Image AI",
    content: <ImageCreateHD />,
    meta: {
      title: "AI Image Generator HD — High Quality Text to Image AI | GPTiti",
      desc: "Create high-quality AI images with GPTiti. Generate detailed visuals, realistic scenes, and images with text using advanced AI image generation.",
    },
  },
  "image-create-fast": {
    title: "Fast AI Image Generator — Quick and Affordable Image Creation",
    content: <ImageCreateFast />,
    meta: {
      title:
        "Fast AI Image Generator — Cheap and быстрый Text to Image AI | GPTiti",
      desc: "Generate AI images fast and cheap with GPTiti. Create visuals instantly for drafts, ideas, and content using fast AI image generation.",
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
