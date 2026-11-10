import type { ModelType, ModelConfig } from "@/types/types";
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
};

export const DEFAULT_MODEL = "gpt-5.4-mini";
export const DEFAULT_MODEL_GROUP: ModelType = "gpt-5.4";

export const isSelectableModel = (model: string): boolean =>
  Object.values(modelConfig).some(({ list }) =>
    list.some(({ title }) => title === model),
  );
