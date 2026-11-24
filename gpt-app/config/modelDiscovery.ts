// Display metadata only. Sending uses the exact API modelId, never a label or a preview ID.
export type DiscoveryGroup = "Chat" | "Images" | "Realtime" | "Voice to text" | "Custom";
export type ModelCard = {
  id: string; name: string; group: DiscoveryGroup; icon: string; accent: string;
  subtitle: string; detail: string; demoTokens?: number; guide?: string;
};
export const discoveryGroups: DiscoveryGroup[] = ["Chat", "Images", "Realtime", "Voice to text", "Custom"];
export const modelCards: ModelCard[] = [
  { id: "gpt-5.4-mini", name: "GPT-5.4 Mini", group: "Chat", icon: "mini", accent: "#307266", subtitle: "Quick tasks", detail: "For short questions, light edits and quick summaries.", guide: "gpt-5-4-mini" },
  { id: "gpt-6.2-sol", name: "GPT-6.2 Sol", group: "Chat", icon: "sol", accent: "#9B5717", subtitle: "Everyday work", detail: "Draft, plan and work through everyday questions.", demoTokens: 750 },
  { id: "gpt-6.2-astra", name: "GPT-6.2 Astra", group: "Chat", icon: "astra", accent: "#70539A", subtitle: "Deep work", detail: "Explore complex questions and compare trade-offs.", demoTokens: 1800 },
  { id: "gpt-6-luna", name: "GPT-6 Luna", group: "Chat", icon: "luna", accent: "#197B91", subtitle: "Quick replies", detail: "For short exchanges, paraphrasing and translation.", demoTokens: 100 },
  { id: "gpt-6.1-terra", name: "GPT-6.1 Terra", group: "Chat", icon: "terra", accent: "#815C4C", subtitle: "Document editing", detail: "Revise documents and organize longer passages.", demoTokens: 350 },
  { id: "gpt-6.1-sol", name: "GPT-6.1 Sol", group: "Chat", icon: "sol", accent: "#AB5140", subtitle: "Writing help", detail: "Turn an outline into a draft and polish the result.", demoTokens: 600 },
  { id: "gpt-6-astra", name: "GPT-6 Astra", group: "Chat", icon: "astra", accent: "#9A3966", subtitle: "Problem solving", detail: "Break a problem into steps and check assumptions.", demoTokens: 1200 },
  { id: "gpt-5.4", name: "GPT-5.4", group: "Chat", icon: "base", accent: "#46803B", subtitle: "Complex tasks", detail: "For technical questions, structured analysis and code.", guide: "gpt-5-4" },
  { id: "gpt-5.5", name: "GPT-5.5", group: "Chat", icon: "base", accent: "#325E94", subtitle: "Advanced coding", detail: "Review code, refine a design or follow a complex argument.", guide: "gpt-5-5" },
  { id: "preview-image", name: "Image model", group: "Images", icon: "images", accent: "#93465C", subtitle: "Image creation", detail: "A planned mode for creating an image from a description.", demoTokens: 1500 },
  { id: "preview-realtime", name: "Realtime model", group: "Realtime", icon: "realtime", accent: "#476C90", subtitle: "Live conversation", detail: "A planned mode for live two-way voice conversations.", demoTokens: 900 },
  { id: "dictation", name: "Whisper", group: "Voice to text", icon: "voice", accent: "#346D7D", subtitle: "Voice dictation", detail: "Dictate into your draft and review it before sending. Your chat model stays selected.", demoTokens: 60 },
  ...["#675482", "#805D30", "#456777"].map((accent, i): ModelCard => ({
    id: `preview-custom-${i + 1}`, name: `Кастомна модель ${i + 1}`, group: "Custom", icon: "custom", accent,
    subtitle: "Specialized assistant", detail: "Reserved for a future task-specific assistant.", demoTokens: [400, 550, 700][i],
  })),
];
export const findModelCard = (id: string) => modelCards.find(card => card.id === id);
export function enabledChatIds(payload: unknown): string[] {
  if (!payload || typeof payload !== "object" || !("success" in payload) || payload.success !== true ||
      !("chatModels" in payload) || !Array.isArray(payload.chatModels)) throw new Error("Invalid chat catalog");
  const enabled = new Set(payload.chatModels.filter(row => row?.enabled === true).map(row => row.modelId));
  return modelCards.filter(card => card.group === "Chat" && enabled.has(card.id)).map(card => card.id);
}
