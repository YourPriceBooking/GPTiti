import type { HistoryActivity, HistoryPage } from "../types/tokenHistory.types";

export function uniqueActivity(items: HistoryActivity[]) {
  const byId = new Map(items.map((item) => [item.id, item]));
  return [...byId.values()].sort(
    (a, b) => b.at.localeCompare(a.at) || b.id.localeCompare(a.id),
  );
}
export function historyDays(pages: HistoryPage[]) {
  const days = new Map<
    string,
    {
      day: string;
      activity: HistoryActivity[];
      general?: import("../types/tokenHistory.types").HistoryDay;
    }
  >();
  for (const page of pages) {
    if (page.mode === "general") {
      for (const day of page.days)
        days.set(day.day, {
          day: day.day,
          activity: day.activity,
          general: day,
        });
    } else {
      for (const item of page.items) {
        const day = days.get(item.day) || { day: item.day, activity: [] };
        day.activity.push(item);
        days.set(item.day, day);
      }
    }
  }
  return [...days.values()]
    .sort((a, b) => b.day.localeCompare(a.day))
    .map((day) => ({ ...day, activity: uniqueActivity(day.activity) }));
}
export function paymentLabel(
  payment: HistoryActivity["payment"],
): string | null {
  if (
    !payment ||
    payment.amountMinor === null ||
    !Number.isSafeInteger(payment.amountMinor) ||
    !payment.currency ||
    !/^[a-z]{3}$/i.test(payment.currency)
  )
    return null;
  try {
    const currency = payment.currency.toUpperCase();
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    });
    // Stripe's ISK/UGX charge amounts use two decimal units for compatibility.
    // https://docs.stripe.com/currencies#special-cases
    const exponent = ["ISK", "UGX"].includes(currency)
      ? 2
      : formatter.resolvedOptions().maximumFractionDigits;
    if (exponent === undefined) return null;
    return formatter.format(payment.amountMinor / 10 ** exponent);
  } catch {
    return null;
  }
}
export function activityDescription(activity: HistoryActivity) {
  if (activity.type === "purchase")
    return [paymentLabel(activity.payment), "Card payment"]
      .filter(Boolean)
      .join(" · ");
  // Refund context carries the original purchase price, not a cash-refund amount.
  if (activity.type === "refund") return "Payment refunded";
  if (activity.type === "bonus")
    return activity.bonusReason === "registration"
      ? "Welcome bonus"
      : "Weekly reward";
  if (activity.type === "sent" || activity.type === "received")
    return activity.peer
      ? `${activity.type === "sent" ? "To" : "From"} ${activity.peer}`
      : "Token transfer";
  if (activity.type === "usage")
    return [activity.model || "Model details unavailable", activity.chat]
      .filter(Boolean)
      .join(" · ");
  return "Balance adjustment";
}

export function localDay(date: string | Date) {
  const value = new Date(date);
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
}
