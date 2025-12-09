import { ModelType, ModelConfig } from "@/types/types";
export const TOKENS_SUFFIX = 'tokens*';
export const modelConfig: Record<ModelType, ModelConfig> = {
  'GPT-4o': {
    list: [
      { title: 'gpt-4o', tokens: 500, desc: 'Fast. Affordable. Powerful.' },
      { title: 'gpt-4o-mini', tokens: 38, desc: 'Smart. Efficient. Budget-friendly.' },
      { title: 'gpt-4o-realtime', tokens: 1250, desc: 'Stream chat. Interactive.' }
    ]
  },

  'GPT-5.1': {
    list: [
      { title: 'gpt-5.1', tokens: 600, desc: 'Reasoning, creativity, long context' },
      { title: 'gpt-5.1-mini', tokens: 110, desc: 'Fast & cost-efficient' },
      { title: 'gpt-5.1-realtime', tokens: 600, desc: 'Voice + stream reasoning' },
    ]
  },

  '0-Series': {
    list: [
      { title: 'o1', tokens: 3800, desc: 'Advanced deliberate reasoning' },
      { title: 'o1-mini', tokens: 750, desc: 'Optimized small thinking model' },
      { title: 'o3-mini', tokens: 280, desc: 'High-IQ tiny model' },
    ]
  }
};