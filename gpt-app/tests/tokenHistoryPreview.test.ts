import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createPreview,
  groupActivity,
  isCharge,
  localDay,
} from "../lib/tokenHistoryPreview";

test("preview includes all six types and 32 separately billed request/response charges", () => {
  const entries = createPreview(new Date(2026, 9, 11, 20));
  assert.equal(entries.length, 40);
  assert.equal(new Set(entries.map((a) => a.id)).size, 40);
  assert.equal(new Set(entries.map((a) => a.type)).size, 6);
  assert.equal(entries.filter(isCharge).length, 32);
  assert.equal(new Set(entries.filter(isCharge).map((a) => a.model)).size, 7);
  assert.ok(
    entries.every((a) =>
      isCharge(a) || a.type === "sent" ? a.amount < 0 : a.amount > 0,
    ),
  );
});
test("local daily aggregation preserves detailed charge totals and retains non-charge operations", () => {
  const entries = createPreview(new Date(2026, 9, 11, 20));
  const days = groupActivity(entries);
  assert.equal(days.length, 2);
  for (const [day, items] of days) {
    assert.equal(items.filter(isCharge).length, 16);
    assert.equal(items.filter((a) => !isCharge(a)).length, 4);
    assert.ok(items.every((a) => localDay(a.at) === day));
  }
  assert.equal(
    days
      .flatMap(([, items]) => items.filter(isCharge))
      .reduce((s, a) => s + a.amount, 0),
    entries.filter(isCharge).reduce((s, a) => s + a.amount, 0),
  );
});
test("preview date construction survives month boundaries in local time", () => {
  const days = groupActivity(createPreview(new Date(2026, 0, 1, 20)));
  assert.deepEqual(
    days.map(([day]) => day),
    ["2026-01-01", "2025-12-31"],
  );
});
