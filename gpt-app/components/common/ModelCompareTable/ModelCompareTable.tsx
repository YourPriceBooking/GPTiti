"use client";

import Link from "next/link";

import { useSelectModel } from "@/hooks/useSelectModel";

type TagItem = { label: string; color: "orange" | "red" | "blue" };
type Tag = TagItem[];

type Row =
  | {
      type: "model";
      model: string;
      bestFor: string;
      speed: string;
      reasoning: string;
      cost: string;
      slug: string;
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
      slug: string;
      tag?: Tag;
    };

const TAG_COLORS: Record<TagItem["color"], string> = {
  orange: "bg-orange-100 text-orange-700",
  red: "bg-red-100 text-red-700",
  blue: "bg-blue-100 text-blue-700",
};

const rows: Row[] = [
  {
    type: "model",
    model: "gpt-5.4-mini",
    bestFor: "Best balance",
    speed: "⚡️⚡️⚡️⚡️",
    reasoning: "⭐️⭐️⭐️⭐️",
    cost: "💲💲💲",
    slug: "gpt-5-4-mini",
    highlight: true,
    tag: [{ label: "Best value", color: "orange" }],
  },
  {
    type: "model",
    model: "gpt-5.4",
    bestFor: "High performance",
    speed: "⚡️⚡️⚡️",
    reasoning: "⭐️⭐️⭐️⭐️⭐️",
    cost: "💲💲💲💲",
    slug: "gpt-5-4",
    tag: [{ label: "Powerful", color: "orange" }],
  },
  {
    type: "model",
    model: "gpt-5.5",
    bestFor: "Advanced work",
    speed: "⚡️⚡️",
    reasoning: "⭐️⭐️⭐️⭐️⭐️",
    cost: "💲💲💲💲💲",
    slug: "gpt-5-5",
    tag: [
      { label: "New", color: "red" },
      { label: "Premium", color: "orange" },
    ],
  },
];

export default function ModelCompareTable() {
  const handleModelClick = useSelectModel();
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
                  <td
                    colSpan={5}
                    className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide"
                  >
                    {row.label}
                  </td>
                </tr>
              );
            }

            if (row.type === "tool") {
              return (
                <tr
                  key={i}
                  onClick={() => handleModelClick(row.name)}
                  className="group cursor-pointer transition-colors hover:bg-blue-50"
                >
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {row.name}
                      {row.tag?.map((t) => (
                        <span
                          key={t.label}
                          className={`inline-block text-xs font-semibold px-1.5 py-0.5 rounded ${TAG_COLORS[t.color]}`}
                        >
                          {t.label}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/ai-models-guide/${row.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-2 inline-block text-xs font-medium text-blue-600 hover:underline opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                    >
                      Read more →
                    </Link>
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
                className={`group cursor-pointer transition-colors hover:bg-blue-50 ${row.highlight ? "bg-orange-50" : ""}`}
              >
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {row.model}
                    {row.tag?.map((t) => (
                      <span
                        key={t.label}
                        className={`inline-block text-xs font-semibold px-1.5 py-0.5 rounded ${TAG_COLORS[t.color]}`}
                      >
                        {t.label}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/ai-models-guide/${row.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-1 inline-block text-xs font-medium text-blue-600 hover:underline opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                  >
                    Read more →
                  </Link>
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
