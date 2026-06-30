import { ModelType, ModelConfig } from "@/types/types";
export const TOKENS_SUFFIX = "tokens*";
export const modelConfig: Record<ModelType, ModelConfig> = {
  "gpt-5.4": {
    list: [
      {
        title: "gpt-5.4",
        tokens: 1000,
        desc: "Most. Powerful.",
        tooltip: {
          title: "GPT-5.4",
          intro: "Next-level intelligence.",
          pros: ["Most powerful", "Best reasoning"],
          cons: ["Expensive usage"],
        },
      },
      {
        title: "gpt-5.4-mini",
        tokens: 200,
        desc: "Best. Balance.",
        tooltip: {
          title: "GPT-5.4 mini",
          intro: "Best balance of power.",
          pros: ["Fast", "Cost-efficient"],
          cons: ["Slightly less powerful than full model"],
        },
      },
    ],
  },

  "gpt-5.5": {
    list: [
      {
        title: "gpt-5.5",
        tokens: 3000,
        desc: "Sharper answers. Better coding. More consistent outputs. Great for advanced work, long prompts and high-value tasks.",
        tooltip: {
          title: "GPT-5.5",
          intro: "Advanced intelligence. Sharper answers for serious work.",
          pros: [
            "Excellent reasoning",
            "Better coding and writing",
            "More consistent results",
          ],
          cons: ["Premium cost", "Not needed for simple chat"],
        },
      },
    ],
  },

  "AI tools": {
    list: [
      {
        title: "Smart Search",
        tokens: 200,
        desc: "Smart Search [AI]",
        subDesc: "Search your data instantly",
        tooltip: {
          title: "Smart Search",
          intro: "Find answers instantly. Search your data with AI context.",
          pros: ["Fast and relevant results", "Works with your data"],
          cons: ["Depends on data quality", "Limited without context"],
        },
      },
      {
        title: "Image → Create HD",
        tokens: 12000,
        amount: "1 image",
        desc: "Best quality images",
        subDesc: "(gpt-image-1)",
        tooltip: {
          title: "Image → Create HD",
          intro: "High-definition image generation.",
          pros: ["Best visual quality", "Detailed output"],
          cons: ["Higher cost", "Slower"],
        },
      },
      {
        title: "Image → Create Fast",
        tokens: 4000,
        amount: "1 image",
        desc: "Fast & Cheap",
        subDesc: "(gpt-image-1-mini)",
        tooltip: {
          title: "Image → Create Fast",
          intro: "Quick, affordable image generation.",
          pros: ["Fast", "Cost-efficient"],
          cons: ["Lower detail"],
        },
      },
      {
        title: "Voice → Text",
        tokens: 1800,
        amount: "1 min",
        desc: "Speak. Get text instantly.",
        tooltip: {
          title: "Voice → Text",
          intro:
            "Speak naturally. Get text instantly. Turn voice into accurate text.",
          pros: ["Fast and hands-free", "High accuracy"],
          cons: ["Affected by noise", "Needs clear speech"],
        },
      },
      {
        title: "Text → Voice",
        tokens: 6000,
        amount: "1 min",
        desc: "Turn text into natural voice",
        tooltip: {
          title: "Text → Speech",
          intro: "Listen instead of reading. Turn text into natural AI voice.",
          pros: ["Hands-free experience", "Instant audio output"],
          cons: ["Less emotional than human", "Higher cost"],
        },
      },
    ],
  },

  "gpt-5.1": {
    list: [
      {
        title: "gpt-5.1",
        tokens: 600,
        desc: "Reasoning, creativity, long context",
        tooltip: {
          title: "GPT-5.1",
          intro:
            "Think deeper. Go further. Handles complex reasoning and long context.",
          pros: ["Exceptional reasoning", "Best quality output"],
          cons: ["Slower", "Higher cost"],
        },
      },
      {
        title: "gpt-5.1-mini",
        tokens: 110,
        desc: "Fast & cost-efficient",
        tooltip: {
          title: "GPT-5.1 mini",
          intro: "Fast. Smart. Efficient.",
          pros: ["Very fast", "Cost-efficient"],
          cons: ["Less reasoning"],
        },
      },
      {
        title: "gpt-5.1-realtime",
        tokens: 600,
        desc: "Voice + stream reasoning",
        tooltip: {
          title: "GPT-5.1 realtime",
          intro: "Talk. Think. Respond instantly.",
          pros: ["Real-time responses", "Voice ready"],
          cons: ["Less depth"],
        },
      },
    ],
  },

  "0-Series": {
    list: [
      {
        title: "o1",
        tokens: 3800,
        desc: "Advanced deliberate reasoning",
        tooltip: {
          title: "o1",
          intro: "Built to think.",
          pros: ["Deep logic", "High accuracy"],
          cons: ["Slower", "Expensive"],
        },
      },
      {
        title: "o1-mini",
        tokens: 750,
        desc: "Optimized small thinking model",
        tooltip: {
          title: "o1 mini",
          intro: "Smart thinking, simplified.",
          pros: ["Faster", "Balanced"],
          cons: ["Less powerful"],
        },
      },
      {
        title: "o3-mini",
        tokens: 280,
        desc: "High-IQ tiny model",
        tooltip: {
          title: "o3 mini",
          intro: "Tiny. Sharp. Fast.",
          pros: ["Lightweight", "Quick logic"],
          cons: ["Limited depth"],
        },
      },
    ],
  },

  "gpt-4o": {
    list: [
      {
        title: "gpt-4o",
        tokens: 500,
        desc: "Fast. Affordable. Powerful.",
        tooltip: {
          title: "GPT-4o",
          intro: "Power meets speed.",
          pros: ["Fast", "Versatile"],
          cons: ["Less deep reasoning"],
        },
      },
      {
        title: "gpt-4o-mini",
        tokens: 38,
        desc: "Smart. Efficient. Budget-friendly.",
        tooltip: {
          title: "GPT-4o mini",
          intro: "Small. Capable. Ready.",
          pros: ["Extremely fast", "Low cost"],
          cons: ["Limited reasoning"],
        },
      },
      {
        title: "gpt-4o-realtime",
        tokens: 1250,
        desc: "Stream chat. Interactive.",
        tooltip: {
          title: "GPT-4o realtime",
          intro: "Live. Reactive. Instant.",
          pros: ["Real-time interaction"],
          cons: ["Less detailed"],
        },
      },
    ],
  },
};

export const COMING_SOON_MODELS = new Set<string>([
  ...modelConfig["AI tools"].list.map((item) => item.title),
  "gpt-5.1-mini",
  "gpt-5.1-realtime",
  "o1-mini",
  "gpt-4o-realtime",
]);

export const isModelComingSoon = (model: string): boolean =>
  COMING_SOON_MODELS.has(model);
