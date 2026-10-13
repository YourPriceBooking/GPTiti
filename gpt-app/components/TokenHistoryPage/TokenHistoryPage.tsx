"use client";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoginModal from "@/components/HomePage/common/LoginModal/LoginModal";
import ActionTooltip from "@/components/common/ActionTooltip/ActionTooltip";
import SendTokensModal from "@/components/SendTokensButton/SendTokensModal";
import { api } from "@/helpers/api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectIsLoggedIn,
  selectAccessTokenReady,
  selectUser,
} from "@/redux/auth/selectors";
import {
  selectBalance,
  selectBalanceReady,
  selectReservedTokens,
  selectAvailableTokens,
  selectMaxTransferTokens,
  selectNextClaimTime,
  selectClaiming,
} from "@/redux/tokens/selectors";
import { claimTokens } from "@/redux/tokens/operations";
import { clearTokenHistoryDraft } from "@/lib/tokenHistoryDraft";
import { formatActivity } from "@/lib/formatActivity";
import {
  formatHistoryPeriod,
  activityDescription,
  historyDays,
  uniqueActivity,
} from "@/lib/tokenHistory";
import type {
  HistoryActivity,
  HistoryMode,
  HistoryFilter,
  HistoryQuery,
  HistoryDay,
  DetailedHistory,
} from "@/types/tokenHistory.types";
import { useHistoryPages } from "./useHistoryPages";
import HistoryDateField from "./HistoryDateField";
import styles from "./TokenHistoryPage.module.css";
const titles = {
  purchase: "TITI purchase",
  received: "Received TITI",
  sent: "Sent TITI",
  bonus: "Free bonus",
  usage: "Chat usage",
  refund: "Payment refund",
  adjustment: "Balance adjustment",
};
const subscribeTimeZone = () => () => {};
const getTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;
const numbers = new Intl.NumberFormat("en-US");
const amount = (value: number) =>
  value === 0
    ? "0 TITI"
    : `${value > 0 ? "+" : "−"}${numbers.format(Math.abs(value))} TITI`;
function Icon({ kind }: { kind: string }) {
  const paths: Record<string, string> = {
    purchase: "M3 7h18v12H3z M3 11h18 M6 15h4",
    refund: "M3 10a9 9 0 1 1 2 9 M3 4v6h6",
    adjustment: "M3 7h18 M3 17h18 M8 4v6 M16 14v6",
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
function ActivityRow({ activity }: { activity: HistoryActivity }) {
  const [open, setOpen] = useState(false);
  const iconKind = activity.type === "bonus" ? "bonusIcon" : activity.type;
  return (
    <div>
      <button
        className={styles.row}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span className={`${styles.icon} ${styles[iconKind]}`}>
          <Icon kind={activity.type} />
        </span>
        <span className={styles.rowText}>
          <b>{titles[activity.type]}</b>
          <span>{activityDescription(activity)}</span>
        </span>
        <time
          dateTime={activity.at}
          title={formatActivity(activity.at) || undefined}
        >
          {new Date(activity.at).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
        <strong
          className={activity.amount > 0 ? styles.positive : styles.negative}
        >
          {amount(activity.amount)}
        </strong>
        <span className={styles.chevron}>›</span>
        {open && (
          <span className={styles.details}>
            <span>
              {new Date(activity.at).toLocaleString("en-GB")} · Local time
            </span>
            <span>Operation · {activity.id}</span>
            <span>
              Balance after this operation:{" "}
              {numbers.format(activity.balanceAfter)} TITI
            </span>
            {activity.type === "usage" && !activity.detailsAvailable && (
              <span>
                Model and chat details are unavailable for this older charge.
              </span>
            )}
          </span>
        )}
      </button>
      {open && activity.conversationId && (
        <div className={styles.chatLink}>
          <Link href={`/chats/${encodeURIComponent(activity.conversationId)}`}>
            Open chat →
          </Link>
        </div>
      )}
    </div>
  );
}
function RequestError({ text, retry }: { text: string; retry: () => void }) {
  return (
    <div role="alert" className={styles.requestError}>
      <span>{text}</span>
      <button className={styles.textButton} onClick={retry}>
        Try again
      </button>
    </div>
  );
}
type Controls = {
  nextCursor: string | null;
  loadingMore: boolean;
  moreError?: string;
  loadMore: () => Promise<void>;
};
function MoreActivity({
  controls,
  label = "Load more activity",
}: {
  controls: Controls;
  label?: string;
}) {
  return (
    <>
      {controls.moreError && (
        <p role="alert" className={styles.loadError}>
          {controls.moreError}
        </p>
      )}
      {controls.nextCursor && (
        <div className={styles.loadMore}>
          <button
            className={styles.secondary}
            disabled={controls.loadingMore}
            onClick={() => void controls.loadMore()}
          >
            {controls.loadingMore
              ? "Loading…"
              : controls.moreError
                ? "Try loading more again"
                : label}
          </button>
        </div>
      )}
    </>
  );
}
function DayCharges({
  day,
  timeZone,
  scope,
}: {
  day: string;
  timeZone: string;
  scope: string;
}) {
  const load = useCallback(
    (cursor: string | undefined, signal: AbortSignal) =>
      api.getTokenHistoryDayCharges(day, { timeZone, cursor }, signal),
    [day, timeZone],
  );
  const result = useHistoryPages(`${scope}:charges:${day}`, true, load);
  const activity = uniqueActivity(result.pages.flatMap((page) => page.items));
  return (
    <div
      id={`charges-${day}`}
      role="region"
      aria-label={`Model charges for ${day}`}
      aria-busy={result.loading}
    >
      {result.loading && (
        <p role="status" className={styles.loading}>
          Loading charges…
        </p>
      )}
      {result.error && (
        <RequestError text={result.error} retry={result.retry} />
      )}
      {activity.map((item) => (
        <ActivityRow key={item.id} activity={item} />
      ))}
      {!result.loading && !result.error && !activity.length && (
        <p className={styles.loading}>No charges for this day.</p>
      )}
      <MoreActivity controls={result} label="Load more charges" />
    </div>
  );
}
function DayContinuation({ day, scope }: { day: HistoryDay; scope: string }) {
  const [requested, setRequested] = useState(false);
  const load = useCallback(
    async (cursor: string | undefined, signal: AbortSignal) => {
      const result = await api.getTokenHistory(
        {
          ...day.activityQuery,
          cursor: cursor || day.nextActivityCursor || undefined,
        },
        signal,
      );
      if (result.mode !== "detailed")
        throw new Error("Unexpected history response");
      return result as DetailedHistory;
    },
    [day.activityQuery, day.nextActivityCursor],
  );
  const result = useHistoryPages(
    `${scope}:operations:${day.day}`,
    requested,
    load,
  );
  if (!requested)
    return (
      <div className={styles.loadMore}>
        <button
          className={styles.textButton}
          onClick={() => setRequested(true)}
        >
          Load more operations for this day →
        </button>
      </div>
    );
  const loadedIds = new Set(day.activity.map((item) => item.id));
  return (
    <>
      {result.loading && (
        <p role="status" className={styles.loading}>
          Loading operations…
        </p>
      )}
      {result.error && (
        <RequestError text={result.error} retry={result.retry} />
      )}
      {uniqueActivity(result.pages.flatMap((page) => page.items))
        .filter((item) => !loadedIds.has(item.id))
        .map((item) => (
          <ActivityRow key={item.id} activity={item} />
        ))}
      <MoreActivity
        controls={result}
        label="Load more operations for this day"
      />
    </>
  );
}
export default function TokenHistoryPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loggedIn = useAppSelector(selectIsLoggedIn);
  const accessReady = useAppSelector(selectAccessTokenReady);
  const user = useAppSelector(selectUser);
  const balance = useAppSelector(selectBalance);
  const balanceReady = useAppSelector(selectBalanceReady);
  const reservedTokens = useAppSelector(selectReservedTokens);
  const availableTokens = useAppSelector(selectAvailableTokens);
  const maxTransferTokens = useAppSelector(selectMaxTransferTokens);
  const balanceVersion = useAppSelector((state) => state.tokens.balanceVersion);
  const nextClaim = useAppSelector(selectNextClaimTime);
  const claiming = useAppSelector(selectClaiming);
  const timeZone = useSyncExternalStore(
    subscribeTimeZone,
    getTimeZone,
    () => "",
  );
  const [loginOpen, setLoginOpen] = useState(false);
  const [sendOwner, setSendOwner] = useState<string | null>(null);
  const [mode, setMode] = useState<HistoryMode>("general");
  const [filter, setFilter] = useState<HistoryFilter>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reload, setReload] = useState(0);
  const [notice, setNotice] = useState<{ owner: string; text: string } | null>(
    null,
  );
  const [now, setNow] = useState(() => Date.now());
  const claimInFlight = useRef(false);
  const owner = loggedIn ? user?.id || "" : "";
  const enabled = Boolean(owner && accessReady && timeZone);
  const scope = JSON.stringify([owner, balanceVersion, reload, timeZone]);
  const viewScope = JSON.stringify([scope, mode, filter, from, to]);
  const expansionScope = JSON.stringify([
    owner,
    mode,
    filter,
    from,
    to,
    timeZone,
  ]);
  const [expansion, setExpansion] = useState<{
    scope: string;
    days: Set<string>;
  }>({ scope: "", days: new Set() });
  const expandedDays =
    expansion.scope === expansionScope ? expansion.days : new Set<string>();
  useEffect(() => {
    if (!loggedIn) clearTokenHistoryDraft();
  }, [loggedIn]);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const query = useMemo<HistoryQuery>(
    () => ({
      mode,
      type: filter,
      from: from || undefined,
      to: to || undefined,
      timeZone,
    }),
    [mode, filter, from, to, timeZone],
  );
  const load = useCallback(
    (cursor: string | undefined, signal: AbortSignal) =>
      api.getTokenHistory({ ...query, cursor }, signal),
    [query],
  );
  const history = useHistoryPages(viewScope, enabled, load);
  const summaryQuery = useMemo(
    () => ({ from: from || undefined, to: to || undefined, timeZone }),
    [from, to, timeZone],
  );
  const loadSummary = useCallback(
    async (_cursor: string | undefined, signal: AbortSignal) => ({
      summary: await api.getTokenHistorySummary(summaryQuery, signal),
      nextCursor: null,
    }),
    [summaryQuery],
  );
  const summaryState = useHistoryPages(
    JSON.stringify([scope, from, to]),
    enabled,
    loadSummary,
  );
  const summary = summaryState.pages[0]?.summary;
  const days = historyDays(history.pages);
  const resetFilters = () => {
    setFilter("all");
    setFrom("");
    setTo("");
  };
  const closeSend = useCallback(() => {
    setSendOwner(null);
    setReload((value) => value + 1);
  }, []);
  const nextClaimAt = nextClaim ? Date.parse(nextClaim) : null;
  const eligible =
    balanceReady &&
    (nextClaimAt === null ||
      (Number.isFinite(nextClaimAt) && nextClaimAt <= now));
  const claim = async () => {
    if (!loggedIn) {
      setLoginOpen(true);
      return;
    }
    if (!enabled || !eligible || claiming || claimInFlight.current) return;
    claimInFlight.current = true;
    try {
      const result = await dispatch(claimTokens()).unwrap();
      setNotice({
        owner,
        text: result.success
          ? "10,000 TITI added to your balance."
          : result.message,
      });
      setReload((value) => value + 1);
    } catch (error) {
      setNotice({
        owner,
        text:
          typeof error === "string"
            ? error
            : "Could not claim your bonus. Please try again.",
      });
    } finally {
      claimInFlight.current = false;
    }
  };
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
            {loggedIn && balanceReady && reservedTokens > 0 && (
              <div className={styles.reservations} aria-live="polite" aria-atomic="true">
                <span>Reserved for requests: <strong>{numbers.format(reservedTokens)} TITI</strong></span>
                <span>Available: <strong>{numbers.format(availableTokens)} TITI</strong></span>
              </div>
            )}
            {!loggedIn && (
              <button
                className={styles.textButton}
                onClick={() => setLoginOpen(true)}
              >
                Sign in →
              </button>
            )}
            <div
              className={styles.totals}
              aria-label="Selected period totals"
              aria-describedby="history-period"
              aria-busy={summaryState.loading}
            >
              <span>
                In <b>{summary ? amount(summary.incoming) : "—"}</b>
              </span>
              <span>
                Out <b>{summary ? amount(summary.outgoing) : "—"}</b>
              </span>
            </div>
            <div className={styles.netChange}>
              <span>Net change</span>
              <b>{summary ? amount(summary.netChange) : "—"}</b>
              <span id="history-period" className={styles.periodLabel}>
                {formatHistoryPeriod(from, to)}
              </span>
            </div>
            {summaryState.error && (
              <RequestError
                text="Could not load period totals."
                retry={summaryState.retry}
              />
            )}
          </div>
          <div className={styles.actions}>
            <Link className={styles.primary} href="/top-up-your-tokens">
              Top up
            </Link>
            <button
              className={styles.secondary}
              disabled={!enabled || !balanceReady || maxTransferTokens <= 0}
              onClick={() => setSendOwner(owner)}
            >
              Send TITI
              <ActionTooltip label="Send TITI tokens" appearance="plain" />
            </button>
          </div>
        </section>
        <section className={styles.bonus}>
          <span className={`${styles.icon} ${styles.bonusIcon}`}>
            <Icon kind="bonus" />
          </span>
          <div>
            <span className={styles.eyebrow}>A LITTLE GIFT. EVERY WEEK.</span>
            <h2>10,000 TITI, on us.</h2>
            <p>
              {loggedIn &&
              balanceReady &&
              nextClaimAt !== null &&
              Number.isFinite(nextClaimAt) &&
              nextClaimAt > now
                ? `Next bonus: ${new Date(nextClaimAt).toLocaleString("en-GB")}`
                : "Get 10,000 free TITI every week. Make room for your next idea."}
            </p>
          </div>
          <button
            className={styles.primary}
            disabled={loggedIn && (!enabled || !eligible || claiming)}
            onClick={() => void claim()}
          >
            {!loggedIn
              ? "Sign in to claim"
              : claiming
                ? "Claiming…"
                : !balanceReady
                  ? "Checking eligibility…"
                  : eligible
                    ? "Claim 10,000 TITI"
                    : "Bonus claimed"}
          </button>
        </section>
        <div className={styles.toolbar}>
          <div
            className={styles.segment}
            role="group"
            aria-label="History view"
          >
            {(["general", "detailed"] as const).map((view) => (
              <button
                key={view}
                aria-pressed={mode === view}
                onClick={() => setMode(view)}
              >
                {view === "general" ? "General" : "Detailed"}
              </button>
            ))}
          </div>
          <label className={styles.filter}>
            <span className={styles.srOnly}>Activity type</span>
            <select
              value={filter}
              onChange={(event) =>
                setFilter(event.target.value as HistoryFilter)
              }
            >
              <option value="all">All activity</option>
              <option value="purchase">Purchases</option>
              <option value="bonus">Free bonuses</option>
              <option value="received">Received TITI</option>
              <option value="sent">Sent TITI</option>
              <option value="usage">Model usage</option>
              <option value="refund">Payment refunds</option>
              <option value="adjustment">Balance adjustments</option>
            </select>
          </label>
          <div className={styles.dates}>
            <HistoryDateField
              label="From"
              rangeFrom={from}
              rangeTo={to}
              value={from}
              max={to}
              onChange={setFrom}
            />
            <HistoryDateField
              label="To"
              rangeFrom={from}
              rangeTo={to}
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
          <span>Local time · {timeZone || "Your time zone"}</span>
        </div>
        {notice?.owner === owner && (
          <div role="status" className={styles.notice}>
            <span>{notice.text}</span>
            <button
              aria-label="Dismiss notification"
              onClick={() => setNotice(null)}
            >
              ×
            </button>
          </div>
        )}
        <div aria-live="polite" aria-busy={history.loading}>
          {!loggedIn ? (
            <section className={styles.empty}>
              <h2>Sign in to see your activity</h2>
              <p>
                Your purchases, bonuses, transfers and model usage, all in one
                place.
              </p>
              <button
                className={styles.primary}
                onClick={() => setLoginOpen(true)}
              >
                Sign in
              </button>
            </section>
          ) : !enabled || history.loading ? (
            <section className={styles.empty}>
              <p role="status">Loading your activity…</p>
            </section>
          ) : history.error ? (
            <RequestError text={history.error} retry={history.retry} />
          ) : !days.length ? (
            <section className={styles.empty}>
              <span className={`${styles.icon} ${styles.usage}`}>
                <Icon kind="usage" />
              </span>
              <h2>
                {from || to || filter !== "all"
                  ? "No matching activity"
                  : "Your story starts here"}
              </h2>
              <p>
                {from || to || filter !== "all"
                  ? "Try a different date or activity filter."
                  : "Your recorded bonuses, purchases, transfers and model usage will appear here."}
              </p>
              {(from || to || filter !== "all") && (
                <button className={styles.textButton} onClick={resetFilters}>
                  Clear filters →
                </button>
              )}
            </section>
          ) : (
            days.map((day) => (
              <section
                className={styles.day}
                key={day.day}
                aria-label={day.day}
              >
                <h2>
                  {new Date(`${day.day}T12:00:00`).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </h2>
                {day.activity.map((activity) => (
                  <ActivityRow key={activity.id} activity={activity} />
                ))}
                {day.general?.nextActivityCursor && (
                  <DayContinuation day={day.general} scope={viewScope} />
                )}
                {day.general?.usage && (
                  <>
                    <button
                      className={`${styles.row} ${styles.daily}`}
                      aria-expanded={expandedDays.has(day.day)}
                      aria-controls={
                        expandedDays.has(day.day)
                          ? `charges-${day.day}`
                          : undefined
                      }
                      onClick={() =>
                        setExpansion((previous) => {
                          const next = new Set(
                            previous.scope === expansionScope
                              ? previous.days
                              : [],
                          );
                          if (next.has(day.day)) next.delete(day.day);
                          else next.add(day.day);
                          return { scope: expansionScope, days: next };
                        })
                      }
                    >
                      <span className={`${styles.icon} ${styles.usage}`}>
                        <Icon kind="usage" />
                      </span>
                      <span className={styles.rowText}>
                        <b>Model usage</b>
                        <span>
                          {day.general.usage.chargeCount} charges ·{" "}
                          {day.general.usage.modelCount} models
                          {day.general.usage.unknownModelCharges > 0
                            ? " · Some model details unavailable"
                            : ""}
                        </span>
                      </span>
                      <span className={styles.dailyLabel}>Daily total</span>
                      <strong>
                        {amount(day.general.usage.amount)}
                        <span className={styles.viewCharges}>
                          {expandedDays.has(day.day)
                            ? "Close details ↑"
                            : "View charges →"}
                        </span>
                      </strong>
                      <span className={styles.chevron}>›</span>
                    </button>
                    {expandedDays.has(day.day) && (
                      <DayCharges
                        day={day.day}
                        timeZone={timeZone}
                        scope={viewScope}
                      />
                    )}
                  </>
                )}
              </section>
            ))
          )}
        </div>
        {enabled && !history.loading && !history.error && (
          <MoreActivity controls={history} />
        )}
        {!!days.length && !history.nextCursor && (
          <p className={styles.end}>End of recorded activity</p>
        )}
        {summary && (
          <p className={styles.footer}>
            {summary.coverage.firstRecordedAt
              ? `Recorded activity from ${new Date(summary.coverage.firstRecordedAt).toLocaleDateString("en-GB")}. Earlier activity may not be available.`
              : "Earlier activity may not be available in your history."}
          </p>
        )}
      </div>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      {enabled &&
        sendOwner === owner &&
        createPortal(<SendTokensModal onClose={closeSend} />, document.body)}
    </main>
  );
}
