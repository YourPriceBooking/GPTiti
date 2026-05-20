export type FlowType =
  | "premium"
  | "balanced"
  | "reasoning"
  | "realtime"
  | "tools";

export type FlowButton = {
  label: string;
  desc: string;
  template: string;
  /** Symbol id inside /icons/flow-sprite.svg (e.g. "analyze-deeply").
   *  Swap a button's icon by editing that <symbol> in the sprite. */
  icon: string;
};

export type ModelFlow = {
  type: FlowType;
  header: string;
  subtitle: string;
  buttons: FlowButton[];
  examples: string[];
};

const flows: Record<FlowType, ModelFlow> = {
  premium: {
    type: "premium",
    header: "What advanced task do you want to solve?",
    subtitle:
      "Best for reasoning, coding, analysis, writing, and serious work.",
    buttons: [
      {
        label: "Analyze deeply",
        desc: "Complex tasks, decisions, strategy.",
        template:
          "Analyze this in depth. Cover key factors, trade-offs, risks, and a clear recommendation:",
        icon: "analyze-deeply",
      },
      {
        label: "Code review",
        desc: "Find bugs, improve logic.",
        template:
          "Review this code. Find bugs, edge cases, and suggest improvements to logic and readability:",
        icon: "code-review",
      },
      {
        label: "Write premium content",
        desc: "SEO, landing pages, emails.",
        template:
          "Write high-quality, persuasive content for this. Optimize for clarity, tone, and SEO:",
        icon: "write-premium-content",
      },
      {
        label: "Plan project",
        desc: "Steps, risks, roadmap.",
        template:
          "Create a detailed project plan with steps, milestones, risks, and a roadmap for:",
        icon: "plan-project",
      },
      {
        label: "Compare options",
        desc: "Pros, cons, best choice.",
        template:
          "Compare these options. List pros, cons, trade-offs, and recommend the best choice:",
        icon: "compare-options",
      },
      {
        label: "Improve business idea",
        desc: "Pricing, positioning, strategy.",
        template:
          "Improve this business idea. Suggest pricing, positioning, and a go-to-market strategy:",
        icon: "improve-business-idea",
      },
    ],
    examples: [
      "Analyze this business idea…",
      "Review this code…",
      "Create a premium SEO page…",
      "Compare these options…",
    ],
  },

  balanced: {
    type: "balanced",
    header: "What do you want to do faster?",
    subtitle:
      "Great for everyday AI tasks, writing, summaries, and quick help.",
    buttons: [
      {
        label: "Summarize",
        desc: "Get a short clean summary.",
        template: "Summarize the following text into clear bullet points:",
        icon: "summarize",
      },
      {
        label: "Write / Improve",
        desc: "Rewrite, fix tone, make it clearer.",
        template:
          "Rewrite this to sound clearer and more professional (keep the meaning):",
        icon: "write-improve",
      },
      {
        label: "Translate",
        desc: "Any language, preserving meaning.",
        template: "Translate this to English. Keep the tone and formatting:",
        icon: "translate",
      },
      {
        label: "Brainstorm",
        desc: "Ideas, names, concepts.",
        template: "Give me 15 creative ideas for:",
        icon: "brainstorm",
      },
      {
        label: "Create content",
        desc: "Posts, emails, product text.",
        template: "Write engaging content for this (post, email, or product text):",
        icon: "create-content",
      },
      {
        label: "Explain simply",
        desc: "Understand anything faster.",
        template: "Explain this in simple terms anyone can understand:",
        icon: "explain-simply",
      },
    ],
    examples: [
      "Summarize this article…",
      "Make this more professional…",
      "Write a short email…",
      "Translate this text…",
    ],
  },

  reasoning: {
    type: "reasoning",
    header: "What complex problem should we reason through?",
    subtitle:
      "Built for deep thinking, logic, planning, and step-by-step reasoning.",
    buttons: [
      {
        label: "Solve step by step",
        desc: "Hard logic, math, reasoning.",
        template: "Solve this step by step. Show your reasoning clearly:",
        icon: "solve-step-by-step",
      },
      {
        label: "Find the mistake",
        desc: "Check logic or calculations.",
        template:
          "Find the mistake in this logic or calculation and explain why:",
        icon: "find-the-mistake",
      },
      {
        label: "Make a decision",
        desc: "Compare trade-offs carefully.",
        template:
          "Help me make this decision. Compare the trade-offs carefully and recommend:",
        icon: "make-a-decision",
      },
      {
        label: "Build a plan",
        desc: "Constraints, risks, sequence.",
        template:
          "Build a plan with constraints, risks, and the right sequence of steps for:",
        icon: "build-a-plan",
      },
      {
        label: "Analyze problem",
        desc: "Break down complex questions.",
        template:
          "Break down this complex problem into clear parts and analyze each:",
        icon: "analyze-problem",
      },
      {
        label: "Check assumptions",
        desc: "Validate logic before acting.",
        template:
          "Validate the assumptions behind this before acting. Point out weak ones:",
        icon: "check-assumptions",
      },
    ],
    examples: [
      "Solve this step by step…",
      "Find the flaw in this logic…",
      "Build a decision tree…",
      "Check my assumptions…",
    ],
  },

  realtime: {
    type: "realtime",
    header: "What do you want to talk about?",
    subtitle:
      "Best for live voice conversations, practice, and instant feedback.",
    buttons: [
      {
        label: "Live conversation",
        desc: "Talk naturally with AI.",
        template: "Let's have a natural live conversation about:",
        icon: "live-conversation",
      },
      {
        label: "Practice speaking",
        desc: "Language, interview, pitch.",
        template:
          "Help me practice speaking for this (language, interview, or pitch):",
        icon: "practice-speaking",
      },
      {
        label: "Voice assistant",
        desc: "Ask and answer hands-free.",
        template: "Act as my hands-free voice assistant and help with:",
        icon: "voice-assistant",
      },
      {
        label: "Role practice",
        desc: "Sales, support, tutoring.",
        template:
          "Let's roleplay this scenario (sales, support, or tutoring):",
        icon: "role-practice",
      },
      {
        label: "Instant feedback",
        desc: "Improve speech or answers.",
        template:
          "Give me instant feedback to improve my speech or answers on:",
        icon: "instant-feedback",
      },
      {
        label: "Quick voice notes",
        desc: "Turn ideas into actions.",
        template: "Turn these quick voice notes into clear actions:",
        icon: "quick-voice-notes",
      },
    ],
    examples: [
      "Practice an interview…",
      "Help me speak better…",
      "Turn this idea into a plan…",
      "Roleplay a sales call…",
    ],
  },

  tools: {
    type: "tools",
    header: "What AI tool do you want to use?",
    subtitle: "Search, speak, listen, and create images with GPTiti tools.",
    buttons: [
      {
        label: "Smart Search",
        desc: "Search your data with AI.",
        template: "Search my data with AI for:",
        icon: "smart-search",
      },
      {
        label: "Voice → Text",
        desc: "Speak. Get text instantly.",
        template: "Convert this voice recording into accurate text:",
        icon: "voice-to-text",
      },
      {
        label: "Text → Voice",
        desc: "Turn text into natural voice.",
        template: "Turn this text into natural-sounding voice:",
        icon: "text-to-voice",
      },
      {
        label: "Image → Create HD",
        desc: "Best quality images.",
        template: "Create a high-quality HD image of:",
        icon: "image-create-hd",
      },
      {
        label: "Image → Create Fast",
        desc: "Fast & cheaper images.",
        template: "Quickly generate an image of:",
        icon: "image-create-fast",
      },
      {
        label: "Analyze content",
        desc: "Use files, images, or text.",
        template:
          "Analyze this content (file, image, or text) and summarize the key points:",
        icon: "analyze-content",
      },
    ],
    examples: [
      "Search my data…",
      "Convert voice to text…",
      "Create an image…",
      "Turn this text into voice…",
    ],
  },
};

/** Maps every selectable model / tool to its flow. */
const MODEL_TO_FLOW: Record<string, FlowType> = {
  // Premium GPT-5
  "gpt-5.5": "premium",
  "gpt-5.4": "premium",
  "gpt-5.1": "premium",
  // Mini / Balanced
  "gpt-5.4-mini": "balanced",
  "gpt-5.1-mini": "balanced",
  "gpt-4o-mini": "balanced",
  "gpt-4o": "balanced",
  // O-Series Reasoning
  o1: "reasoning",
  "o1-mini": "reasoning",
  "o3-mini": "reasoning",
  // Realtime / Voice
  "gpt-4o-realtime": "realtime",
  "gpt-5.1-realtime": "realtime",
  // AI Tools
  "Smart Search": "tools",
  "Voice → Text": "tools",
  "Text → Voice": "tools",
  "Image → Create HD": "tools",
  "Image → Create Fast": "tools",
};

const DEFAULT_FLOW: FlowType = "balanced";

export function getFlowType(selectedModel: string): FlowType {
  return MODEL_TO_FLOW[selectedModel] ?? DEFAULT_FLOW;
}

export function getModelFlow(selectedModel: string): ModelFlow {
  return flows[getFlowType(selectedModel)];
}
