"use client";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoginModal from "@/components/HomePage/common/LoginModal/LoginModal";
import { useAppSelector } from "@/redux/hooks";
import { selectIsLoggedIn } from "@/redux/auth/selectors";
import { selectBalance, selectBalanceReady } from "@/redux/tokens/selectors";
import { clearTokenHistoryDraft } from "@/lib/tokenHistoryDraft";
import { formatActivity } from "@/lib/formatActivity";
import {
  createPreview,
  groupActivity,
  isCharge,
  localDay,
  type Activity,
} from "@/lib/tokenHistoryPreview";
import HistoryDateField from "./HistoryDateField";
import styles from "./TokenHistoryPage.module.css";
const titles = {
  purchase: "TITI purchase",
  received: "Received TITI",
  sent: "Sent TITI",
  bonus: "Free bonus",
  usage: "Chat usage",
};
const subscribeTimeZone = () => () => {};
const getTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;
const numbers = new Intl.NumberFormat("en-US");
const amount = (v: number) =>
  `${v >= 0 ? "+" : "−"}${numbers.format(Math.abs(v))} TITI`;
function Icon({ kind }: { kind: string }) {
  const paths: Record<string, string> = {
    purchase: "M3 7h18v12H3z M3 11h18 M6 15h4",
    received: "M12 3v18 M5 14l7 7 7-7",
    sent: "M5 19L19 5 M5 5h14v14",
    bonus:
      "M3 9h18v4H3z M5 13v8h14v-8 M12 9v12 M12 9C3 9 5 1 9 4l3 5c9 0 7-8 3-5z",
    request: "M4 12h16 M13 5l7 7-7 7",
    response: "M20 12H4 M11 5l-7 7 7 7",
    usage: "M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z",
  };
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[kind] || paths.usage} />
    </svg>
  );
}
export default function TokenHistoryPage() {
  const router = useRouter();
  const loggedIn = useAppSelector(selectIsLoggedIn);
  const balance = useAppSelector(selectBalance);
  const balanceReady = useAppSelector(selectBalanceReady);
  const timeZone = useSyncExternalStore(
    subscribeTimeZone,
    getTimeZone,
    () => "",
  );
  const [loginOpen, setLoginOpen] = useState(false);
  const [sample, setSample] = useState(false);
  const [mode, setMode] = useState<"general" | "detailed">("general");
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [entries, setEntries] = useState<Activity[]>([]);
  const [selected, setSelected] = useState<Activity | null>(null);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    if (!loggedIn) clearTokenHistoryDraft();
  }, [loggedIn]);
  const visible = useMemo(
    () =>
      entries.filter(
        (a) =>
          (filter === "all" ||
            (filter === "usage" ? isCharge(a) : a.type === filter)) &&
          (!from || localDay(a.at) >= from) &&
          (!to || localDay(a.at) <= to),
      ),
    [entries, filter, from, to],
  );
  const groups = groupActivity(visible);
  const periodEntries = entries.filter(
    (entry) =>
      (!from || localDay(entry.at) >= from) &&
      (!to || localDay(entry.at) <= to),
  );
  const incoming = periodEntries.reduce(
    (sum, entry) => sum + Math.max(0, entry.amount),
    0,
  );
  const outgoing = periodEntries.reduce(
    (sum, entry) => sum + Math.min(0, entry.amount),
    0,
  );
  const netChange = incoming + outgoing;
  const resetFilters = () => {
    setFilter("all");
    setFrom("");
    setTo("");
  };
  const toggleSample = () => {
    const next = !sample;
    setSample(next);
    setEntries(next ? createPreview() : []);
    setSelected(null);
    setExpandedDays(new Set());
    setNotice("");
    resetFilters();
  };
  const description = (a: Activity) =>
    a.type === "purchase"
      ? `${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(a.price || 0)} · Card payment`
      : a.peer
        ? `${a.type === "sent" ? "To" : "From"} ${a.peer}`
        : a.type === "bonus"
          ? "Weekly reward"
          : `${a.model} · ${a.chat}`;
  const renderActivity = (a: Activity) => (
    <button
      key={a.id}
      className={styles.row}
      onClick={() => setSelected(selected?.id === a.id ? null : a)}
      aria-expanded={selected?.id === a.id}
    >
      <span
        className={`${styles.icon} ${styles[a.type === "bonus" ? "bonusIcon" : a.type]}`}
      >
        <Icon kind={a.type} />
      </span>
      <span className={styles.rowText}>
        <b>{titles[a.type]}</b>
        <span>{description(a)}</span>
      </span>
      <time dateTime={a.at} title={formatActivity(a.at) || undefined}>
        {new Date(a.at).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </time>
      <strong className={a.amount > 0 ? styles.positive : styles.negative}>
        {amount(a.amount)}
      </strong>
      <span className={styles.chevron}>›</span>
      {selected?.id === a.id && (
        <span className={styles.details}>
          <span>{new Date(a.at).toLocaleString("en-GB")} · Local time</span>
          <span>Sample operation · {a.id}</span>
          {isCharge(a) && (
            <span>
              Chat: {a.chat}. Demo chats are not linked to your account.
            </span>
          )}
        </span>
      )}
    </button>
  );
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <nav className={styles.nav} aria-label="Token history navigation">
          <button
            className={styles.back}
            onClick={() =>
              window.history.length > 1 ? router.back() : router.replace("/")
            }
          >
            ← Back to chat
          </button>
          <Link href="/" className={styles.logo}>
            GPTiti
          </Link>
        </nav>
        <header className={styles.header}>
          <div>
            <h1>Token history</h1>
            <p>Your TITI, every move.</p>
          </div>
          <button
            className={styles.preview}
            aria-pressed={sample}
            onClick={toggleSample}
          >
            {sample ? "◉ Sample activity" : "○ Empty account"}
            <span>Switch preview</span>
          </button>
        </header>
        <section
          className={styles.balance}
          aria-label="Current balance and period activity"
        >
          <div className={styles.balanceMain}>
            <span className={styles.label}>Current balance</span>
            <strong
              className={
                loggedIn && balanceReady
                  ? styles.balanceValue
                  : styles.balanceStatus
              }
              aria-live="polite"
              data-current-balance
            >
              {loggedIn ? (
                balanceReady ? (
                  <>
                    {numbers.format(balance)} <span>TITI</span>
                  </>
                ) : (
                  "Syncing…"
                )
              ) : (
                "Sign in to see your balance"
              )}
            </strong>
            {!loggedIn && (
              <button
                className={styles.textButton}
                onClick={() => setLoginOpen(true)}
              >
                Sign in →
              </button>
            )}
            <div className={styles.totals} aria-label="Selected period totals">
              <span>
                In <b>{incoming ? amount(incoming) : "0 TITI"}</b>
              </span>
              <span>
                Out <b>{outgoing ? amount(outgoing) : "0 TITI"}</b>
              </span>
            </div>
            <div className={styles.netChange}>
              <span>Net change</span>
              <b>{netChange ? amount(netChange) : "0 TITI"}</b>
              <span className={styles.periodLabel}>Selected period</span>
            </div>
          </div>
          <div className={styles.actions}>
            <Link className={styles.primary} href="/top-up-your-tokens">
              Top up
            </Link>
            <button
              className={styles.secondary}
              disabled={!loggedIn || !balanceReady || balance <= 0}
              onClick={() =>
                setNotice(
                  "Sample preview: no TITI was sent. Transfers will be connected when history is available.",
                )
              }
            >
              Send TITI
            </button>
          </div>
        </section>
        {sample && entries.some((a) => a.id === "claimed-preview") && (
          <section className={styles.bonus}>
            <span className={`${styles.icon} ${styles.bonusIcon}`}>
              <Icon kind="bonus" />
            </span>
            <div>
              <span className={styles.eyebrow}>YOUR WEEKLY GIFT</span>
              <h2>10,000 TITI claimed</h2>
              <p>
                Next sample bonus:{" "}
                {new Date(
                  new Date(entries[0].at).getTime() + 7 * 86400000,
                ).toLocaleString("en-GB")}
              </p>
            </div>
            <button className={styles.secondary} disabled>
              Bonus claimed
            </button>
          </section>
        )}
        {!sample && (
          <section className={styles.bonus}>
            <span className={`${styles.icon} ${styles.bonusIcon}`}>
              <Icon kind="bonus" />
            </span>
            <div>
              <span className={styles.eyebrow}>A LITTLE GIFT. EVERY WEEK.</span>
              <h2>10,000 TITI, on us.</h2>
              <p>
                Get 10,000 free TITI every week. Make room for your next idea.
              </p>
            </div>
            <button
              className={styles.primary}
              onClick={() => {
                setSample(true);
                setEntries([
                  {
                    id: "claimed-preview",
                    type: "bonus",
                    at: new Date().toISOString(),
                    amount: 10000,
                  },
                ]);
                setNotice(
                  "Sample bonus added. Your actual account balance has not changed.",
                );
              }}
            >
              Claim 10,000 TITI
            </button>
          </section>
        )}
        <div className={styles.toolbar}>
          <div
            className={styles.segment}
            role="group"
            aria-label="History view"
          >
            {(["general", "detailed"] as const).map((v) => (
              <button
                key={v}
                aria-pressed={mode === v}
                onClick={() => setMode(v)}
              >
                {v === "general" ? "General" : "Detailed"}
              </button>
            ))}
          </div>
          <label className={styles.filter}>
            <span className={styles.srOnly}>Activity type</span>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All activity</option>
              <option value="purchase">Purchases</option>
              <option value="bonus">Free bonuses</option>
              <option value="received">Received TITI</option>
              <option value="sent">Sent TITI</option>
              <option value="usage">Model usage</option>
            </select>
          </label>
          <div className={styles.dates}>
            <HistoryDateField
              label="From"
              value={from}
              max={to}
              onChange={setFrom}
            />
            <HistoryDateField
              label="To"
              value={to}
              min={from}
              onChange={setTo}
              alignRight
            />
            {(from || to || filter !== "all") && (
              <button className={styles.textButton} onClick={resetFilters}>
                Reset
              </button>
            )}
          </div>
        </div>
        <div className={styles.caption}>
          <span>
            {mode === "general"
              ? "Model charges grouped by day."
              : "Each request and response, one total."}
          </span>
          <span>
            Local time · {timeZone || "Your time zone"} · Sample activity
          </span>
        </div>
        {notice && (
          <div role="status" className={styles.notice}>
            {notice}
            <button
              aria-label="Dismiss notification"
              onClick={() => setNotice("")}
            >
              ×
            </button>
          </div>
        )}
        <div aria-live="polite">
          {!groups.length ? (
            <section className={styles.empty}>
              <span className={`${styles.icon} ${styles.usage}`}>
                <Icon kind="usage" />
              </span>
              <h2>
                {entries.length
                  ? "No matching activity"
                  : "Your story starts here"}
              </h2>
              <p>
                {entries.length
                  ? "Try a different date or activity filter."
                  : "Your bonuses, purchases, transfers and model usage will appear here."}
              </p>
              {entries.length ? (
                <button className={styles.textButton} onClick={resetFilters}>
                  Clear filters →
                </button>
              ) : (
                <span>One place for every TITI.</span>
              )}
            </section>
          ) : (
            groups.map(([day, items]) => {
              const charges = items.filter(isCharge);
              const rows =
                mode === "general" ? items.filter((a) => !isCharge(a)) : items;
              return (
                <section className={styles.day} key={day} aria-label={day}>
                  <h2>
                    {new Date(`${day}T12:00:00`).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </h2>
                  {rows.map(renderActivity)}
                  {mode === "general" && charges.length > 0 && (
                    <button
                      className={`${styles.row} ${styles.daily}`}
                      aria-expanded={expandedDays.has(day)}
                      aria-controls={`charges-${day}`}
                      onClick={() => {
                        setExpandedDays((current) => {
                          const next = new Set(current);
                          if (next.has(day)) next.delete(day);
                          else next.add(day);
                          return next;
                        });
                      }}
                    >
                      <span className={`${styles.icon} ${styles.usage}`}>
                        <Icon kind="usage" />
                      </span>
                      <span className={styles.rowText}>
                        <b>Model usage</b>
                        <span>
                          {charges.length} charges ·{" "}
                          {new Set(charges.map((a) => a.model)).size} models
                        </span>
                      </span>
                      <span className={styles.dailyLabel}>Daily total</span>
                      <strong>
                        {amount(charges.reduce((s, a) => s + a.amount, 0))}
                        <span className={styles.viewCharges}>
                          {expandedDays.has(day)
                            ? "Close details ↑"
                            : "View charges →"}
                        </span>
                      </strong>
                      <span className={styles.chevron}>›</span>
                    </button>
                  )}
                  {mode === "general" &&
                    charges.length > 0 &&
                    expandedDays.has(day) && (
                      <div
                        id={`charges-${day}`}
                        role="region"
                        aria-label={`Model charges for ${day}`}
                      >
                        {charges.map(renderActivity)}
                      </div>
                    )}
                </section>
              );
            })
          )}
        </div>
        {!!groups.length && (
          <p className={styles.end}>End of sample activity</p>
        )}
        <p className={styles.footer}>
          Preview only. Sample actions never change your account balance.
        </p>
      </div>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </main>
  );
}
