import { test } from "node:test";
import assert from "node:assert/strict";
import {
  activityDescription,
  historyDays,
  paymentLabel,
  uniqueActivity,
} from "../lib/tokenHistory";
import type { HistoryActivity, HistoryPage } from "../types/tokenHistory.types";
const activity = (id: string, day: string): HistoryActivity => ({
  id,
  day,
  at: `${day}T12:00:00.000Z`,
  amount: -500,
  type: "usage",
  kind: "chat_charge",
  status: "confirmed",
  model: null,
  conversationId: null,
  chat: null,
  peer: null,
  payment: null,
  bonusReason: null,
  balanceAfter: 1000,
  balanceVersion: 2,
  detailsAvailable: false,
});
test("Detailed pagination keeps one row per real operation and uses server day grouping", () => {
  const first = activity("b", "2026-10-11");
  const second = activity("a", "2026-10-11");
  const older = activity("c", "2026-10-10");
  const pages: HistoryPage[] = [
    {
      mode: "detailed",
      timeZone: "Pacific/Auckland",
      items: [first, second],
      nextCursor: "next",
    },
    {
      mode: "detailed",
      timeZone: "Pacific/Auckland",
      items: [second, older],
      nextCursor: null,
    },
  ];
  const days = historyDays(pages);
  assert.deepEqual(
    days.map((day) => day.day),
    ["2026-10-11", "2026-10-10"],
  );
  assert.deepEqual(
    days[0].activity.map((row) => row.id),
    ["b", "a"],
  );
  assert.equal(days.flatMap((day) => day.activity).length, 3);
  assert.equal(pages[0].mode === "detailed" && pages[0].items.length, 2);
  assert.equal(uniqueActivity([first, second, first]).length, 2);
});
test("General daily summaries keep the full server totals instead of loaded charge rows", () => {
  const pages: HistoryPage[] = [
    {
      mode: "general",
      timeZone: "Europe/Kyiv",
      nextCursor: null,
      days: [
        {
          day: "2026-10-11",
          activity: [],
          operationCount: 200,
          activityQuery: {
            mode: "detailed",
            type: "nonusage",
            timeZone: "Europe/Kyiv",
          },
          nextActivityCursor: "more",
          usage: {
            amount: -40000,
            chargeCount: 150,
            modelCount: 7,
            unknownModelCharges: 2,
          },
        },
      ],
    },
  ];
  assert.equal(historyDays(pages)[0].general?.usage?.amount, -40000);
  assert.equal(historyDays(pages)[0].general?.usage?.chargeCount, 150);
});
test("card amounts use their actual currency units including Stripe exceptions", () => {
  const money = (amountMinor: number, currency: string) =>
    paymentLabel({ id: "p", amountMinor, currency });
  assert.equal(money(199, "usd"), "$1.99");
  assert.equal(money(199, "eur"), "€1.99");
  assert.equal(money(500, "jpy"), "¥500");
  assert.equal(money(1250, "kwd"), "KWD 1.250");
  assert.equal(money(500, "isk"), "ISK 5");
  assert.equal(money(500, "ugx"), "UGX 5");
  assert.equal(paymentLabel(null), null);
  assert.equal(
    paymentLabel({ id: null, amountMinor: null, currency: "usd" }),
    null,
  );
  assert.equal(
    paymentLabel({ id: null, amountMinor: 100, currency: null }),
    null,
  );
});
test("missing metadata never invents payment prices, model names or chat names", () => {
  assert.equal(
    activityDescription({ ...activity("a", "2026-10-11"), type: "purchase" }),
    "Card payment",
  );
  assert.equal(
    activityDescription(activity("a", "2026-10-11")),
    "Model details unavailable",
  );
  assert.equal(
    activityDescription({
      ...activity("a", "2026-10-11"),
      type: "bonus",
      bonusReason: "registration",
    }),
    "Welcome bonus",
  );
  assert.equal(
    activityDescription({ ...activity("a", "2026-10-11"), type: "refund" }),
    "Payment refunded",
  );
});

test("refund rows do not mislabel the original purchase price as a cash refund", () => {
  assert.equal(
    activityDescription({
      ...activity("r", "2026-10-11"),
      type: "refund",
      payment: { id: "p", amountMinor: 199, currency: "usd" },
    }),
    "Payment refunded",
  );
});
