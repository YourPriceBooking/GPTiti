"use client";

import { useRouter } from "next/navigation";
import { getModelGroupAndItem } from "@/functions/getModelGroupAndItem";

type Tag = { label: string; color: "orange" | "red" | "blue" };

type Row =
  | {
      type: "model";
      model: string;
      bestFor: string;
      speed: string;
      reasoning: string;
      cost: string;
      highlight?: boolean;
      tag?: Tag;
    }
  | { type: "divider"; label: string }
  | {
      type: "tool";
      name: string;
      bestFor: string;
      speed: string;
      reasoning: string;
      cost: string;
      tag?: Tag;
    };

const TAG_COLORS: Record<Tag["color"], string> = {
  orange: "bg-orange-100 text-orange-700",
  red: "bg-red-100 text-red-700",
  blue: "bg-blue-100 text-blue-700",
};

const rows: Row[] = [
  { type: "model", model: "gpt-4o-mini",      bestFor: "Cheap chat",         speed: "⚡️⚡️⚡️⚡️⚡️", reasoning: "⭐️",          cost: "💲" },
  { type: "model", model: "gpt-4o",            bestFor: "General tasks",      speed: "⚡️⚡️⚡️⚡️",    reasoning: "⭐️⭐️",        cost: "💲💲" },
  { type: "model", model: "gpt-4o-realtime",   bestFor: "Live chat / voice",  speed: "⚡️⚡️⚡️⚡️⚡️", reasoning: "⭐️",          cost: "💲💲💲" },
  { type: "model", model: "gpt-5.4-mini",      bestFor: "Best balance",       speed: "⚡️⚡️⚡️⚡️",    reasoning: "⭐️⭐️⭐️⭐️",    cost: "💲💲💲",  highlight: true, tag: { label: "Best value", color: "orange" } },
  { type: "model", model: "gpt-5.1-mini",      bestFor: "Balanced usage",     speed: "⚡️⚡️⚡️⚡️",    reasoning: "⭐️⭐️⭐️",      cost: "💲💲" },
  { type: "model", model: "gpt-5.1",           bestFor: "Work & content",     speed: "⚡️⚡️⚡️",       reasoning: "⭐️⭐️⭐️⭐️",    cost: "💲💲💲" },
  { type: "model", model: "gpt-5.1-realtime",  bestFor: "Premium live AI",    speed: "⚡️⚡️⚡️⚡️⚡️", reasoning: "⭐️⭐️",        cost: "💲💲💲💲" },
  { type: "model", model: "gpt-5.4",           bestFor: "Top performance",    speed: "⚡️⚡️⚡️",       reasoning: "⭐️⭐️⭐️⭐️⭐️",  cost: "💲💲💲💲", tag: { label: "Top", color: "red" } },
  { type: "model", model: "o3-mini",           bestFor: "Budget reasoning",   speed: "⚡️⚡️⚡️⚡️",    reasoning: "⭐️⭐️⭐️",      cost: "💲💲" },
  { type: "model", model: "o1-mini",           bestFor: "Affordable reasoning",speed: "⚡️⚡️⚡️",      reasoning: "⭐️⭐️⭐️⭐️",    cost: "💲💲💲" },
  { type: "model", model: "o1",                bestFor: "Deep reasoning",     speed: "⚡️⚡️",          reasoning: "⭐️⭐️⭐️⭐️⭐️",  cost: "💲💲💲💲💲", tag: { label: "Reasoning", color: "orange" } },
  { type: "divider", label: "AI Tools" },
  { type: "tool", name: "Smart Search",  bestFor: "Search your data with AI", speed: "⚡️⚡️⚡️⚡️",    reasoning: "⭐️⭐️⭐️", cost: "💲",    tag: { label: "Soon", color: "orange" } },
  { type: "tool", name: "Voice to Text", bestFor: "Convert speech to text",   speed: "⚡️⚡️⚡️⚡️⚡️", reasoning: "⭐️",        cost: "💲💲",  tag: { label: "Soon", color: "orange" } },
  { type: "tool", name: "Text to Speech",bestFor: "Generate AI voice",        speed: "⚡️⚡️⚡️⚡️",    reasoning: "⭐️",        cost: "💲💲",  tag: { label: "Soon", color: "orange" } },
];

export default function ModelCompareTable() {
  const router = useRouter();

  const handleModelClick = (model: string) => {
    const found = getModelGroupAndItem(model);
    if (!found) return;
    localStorage.setItem("selectedModel", model);
    localStorage.setItem("selectedModelGroup", found.group);
    router.push("/");
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
            <th className="px-4 py-3 font-semibold">Model</th>
            <th className="px-4 py-3 font-semibold">Best for</th>
            <th className="px-4 py-3 font-semibold">Speed</th>
            <th className="px-4 py-3 font-semibold">Reasoning</th>
            <th className="px-4 py-3 font-semibold">Cost</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row, i) => {
            if (row.type === "divider") {
              return (
                <tr key={i} className="bg-gray-50">
                  <td colSpan={5} className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {row.label}
                  </td>
                </tr>
              );
            }

            if (row.type === "tool") {
              return (
                <tr key={i} className="cursor-pointer transition-colors hover:bg-blue-50">
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                    {row.name}
                    {row.tag && (
                      <span className={`ml-2 inline-block text-xs font-semibold px-1.5 py-0.5 rounded ${TAG_COLORS[row.tag.color]}`}>
                        {row.tag.label}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{row.bestFor}</td>
                  <td className="px-4 py-3">{row.speed}</td>
                  <td className="px-4 py-3">{row.reasoning}</td>
                  <td className="px-4 py-3">{row.cost}</td>
                </tr>
              );
            }

            return (
              <tr
                key={i}
                onClick={() => handleModelClick(row.model)}
                className={`cursor-pointer transition-colors hover:bg-blue-50 ${row.highlight ? "bg-orange-50" : ""}`}
              >
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                  {row.model}
                  {row.tag && (
                    <span className={`ml-2 inline-block text-xs font-semibold px-1.5 py-0.5 rounded ${TAG_COLORS[row.tag.color]}`}>
                      {row.tag.label}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">{row.bestFor}</td>
                <td className="px-4 py-3">{row.speed}</td>
                <td className="px-4 py-3">{row.reasoning}</td>
                <td className="px-4 py-3">{row.cost}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
