export type ActivityType =
  "purchase" | "received" | "sent" | "bonus" | "request" | "response";
export type Activity = {
  id: string;
  type: ActivityType;
  at: string;
  amount: number;
  model?: string;
  peer?: string;
  price?: number;
  chat?: string;
};
export const localDay = (at: string) => {
  const d = new Date(at);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
export const isCharge = (a: Activity) =>
  a.type === "request" || a.type === "response";
export function createPreview(now = new Date()): Activity[] {
  const models = [
    "gpt-4o-mini",
    "gpt-4o",
    "gpt-5.1",
    "o3-mini",
    "o1",
    "gpt-5.4-mini",
    "gpt-5.4",
  ];
  const entries: Activity[] = [];
  for (let day = 0; day < 2; day++) {
    const date = (h: number, m: number) => {
      const d = new Date(now);
      d.setDate(d.getDate() - day);
      d.setHours(h, m, 0, 0);
      return d.toISOString();
    };
    entries.push(
      {
        id: `purchase-${day}`,
        type: "purchase",
        at: date(18, 42),
        amount: 250000,
        price: 2,
      },
      {
        id: `received-${day}`,
        type: "received",
        at: date(17, 35),
        amount: 18000,
        peer: "anna@example.com",
      },
      { id: `bonus-${day}`, type: "bonus", at: date(16, 0), amount: 10000 },
      {
        id: `sent-${day}`,
        type: "sent",
        at: date(15, 55),
        amount: -12000,
        peer: "oleh@example.com",
      },
    );
    for (let i = 0; i < 16; i++)
      entries.push({
        id: `charge-${day}-${i}`,
        type: i % 2 ? "response" : "request",
        at: date(8 + Math.floor(i / 2), i % 2 ? 21 : 20),
        amount: -(120 + (i + day * 16) * 37),
        model: models[Math.floor(i / 2) % models.length],
        chat: [
          "Product launch",
          "Travel plans",
          "Research",
          "Writing assistant",
        ][Math.floor(i / 2) % 4],
      });
  }
  return entries.sort((a, b) => b.at.localeCompare(a.at));
}
export function groupActivity(entries: Activity[]) {
  const groups = new Map<string, Activity[]>();
  for (const entry of entries) {
    const day = localDay(entry.at);
    groups.set(day, [...(groups.get(day) || []), entry]);
  }
  return [...groups.entries()].sort(([a], [b]) => b.localeCompare(a));
}
