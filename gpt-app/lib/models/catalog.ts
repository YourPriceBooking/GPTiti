import type { ModelLimits } from "../../config/modelLimits.config";
import type { ModelItem } from "../../types/types";
export type CatalogModel = ModelItem & {
  label: string;
  groupId: string;
  default: boolean;
  order: number;
  minRole: string;
  limits: ModelLimits;
};
const object = (v: unknown): Record<string, unknown> =>
  v && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : {};
const text = (v: unknown, fallback = "") =>
  typeof v === "string" ? v : fallback;
const strings = (v: unknown) =>
  Array.isArray(v) ? v.filter((s): s is string => typeof s === "string") : [];
export function readModelCatalog(value: unknown): CatalogModel[] {
  const root = object(value);
  if (root.success !== true || !Array.isArray(root.chatModels))
    throw Error("Invalid model catalog");
  const seen = new Set<string>();
  return root.chatModels
    .flatMap((raw) => {
      const m = object(raw);
      if (m.enabled !== true || (m.type !== undefined && m.type !== "model"))
        return [];
      const id = text(m.modelId);
      if (!id || id.length > 200 || seen.has(id))
        throw Error("Invalid or duplicate model ID");
      seen.add(id);
      const l = object(m.limits);
      for (const key of [
        "maxImages",
        "maxImageSizeMb",
        "maxFiles",
        "maxFileSizeMb",
        "maxLinks",
        "maxTextChars",
      ]) {
        if (key === "maxTextChars" && l[key] === null) continue;
        if (
          typeof l[key] !== "number" ||
          !Number.isFinite(l[key]) ||
          (l[key] as number) < 0
        )
          throw Error("Missing model limits");
      }
      const content = object(m.content),
        tooltip = object(content.tooltip),
        label = text(m.label, id);
      return [
        {
          title: id,
          label,
          groupId: text(m.groupId) || label,
          default: m.default === true,
          order:
            typeof m.order === "number" && Number.isFinite(m.order)
              ? m.order
              : 9999,
          minRole: text(m.minRole, "user"),
          tokens:
            typeof m.tokens === "number" &&
            Number.isFinite(m.tokens) &&
            m.tokens >= 0
              ? m.tokens
              : null,
          desc: text(content.desc),
          subDesc: text(content.subDesc),
          amount: text(m.amount),
          unit: text(m.unit),
          tooltip: {
            title: text(tooltip.title, label),
            intro: text(tooltip.intro),
            pros: strings(tooltip.pros),
            cons: strings(tooltip.cons),
          },
          limits: l as ModelLimits,
        },
      ];
    })
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}
export const visibleModels = (models: CatalogModel[], role = "user") =>
  models.filter(
    (m) => m.minRole === "user" || m.minRole === role || role === "admin",
  );
export const groupModels = (models: CatalogModel[]) =>
  Object.fromEntries(
    [...new Set(models.map((m) => m.groupId))].map((group) => [
      group,
      { list: models.filter((m) => m.groupId === group) },
    ]),
  );
