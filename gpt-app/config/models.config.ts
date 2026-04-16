import { ModelType, ModelConfig } from "@/types/types";
export const TOKENS_SUFFIX = "tokens*";
export const modelConfig: Record<ModelType, ModelConfig> = {
  "GPT-4o": {
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

  "GPT-5.1": {
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

  "GPT-5.4": {
    list: [
      {
        title: "gpt-5.4",
        tokens: 1000,
        desc: "Most. Powerful.",
        tooltip: {
          title: "GPT-5.4",
          intro: "Most powerful model yet.",
          pros: ["Top-tier reasoning", "Best quality output"],
          cons: ["Slower", "Higher cost"],
        },
      },
      {
        title: "gpt-5.4-mini",
        tokens: 200,
        desc: "Best. Balance.",
        tooltip: {
          title: "GPT-5.4 mini",
          intro: "Balanced speed and power.",
          pros: ["Fast", "Balanced cost"],
          cons: ["Less depth than full 5.4"],
        },
      },
    ],
  },
};
