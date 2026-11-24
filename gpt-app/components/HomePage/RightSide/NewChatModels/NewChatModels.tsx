"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { discoveryGroups, findModelCard, modelCards, type ModelCard, type DiscoveryGroup } from "@/config/modelDiscovery";
import { getModelGroupAndItem } from "@/functions/getModelGroupAndItem";
import { useChatCatalog } from "@/hooks/useChatCatalog";
import { ModelGlyph } from "./ModelGlyph";
import styles from "./NewChatModels.module.css";

function Choice({ card, selected, onPick, busy }: {
  card: ModelCard; selected: string; onPick: (card: ModelCard) => void; busy: boolean;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const wrap = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const hover = useRef(false);
  const planned = card.group !== "Chat" && card.id !== "dictation";
  const average = card.demoTokens ?? getModelGroupAndItem(card.id)?.model.tokens;
  useEffect(() => {
    if (!open) return;
    const outside = (e: PointerEvent) => { if (!wrap.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  return <div className={styles.unit} style={{ "--accent": card.accent } as CSSProperties}
    data-selected={selected === card.id} onKeyDown={e => {
      if (e.key === "Escape" && open) { e.preventDefault(); e.stopPropagation(); setOpen(false); trigger.current?.focus(); }
    }}>
    <button className={styles.pick} type="button" disabled={planned || busy}
      aria-pressed={card.group === "Chat" ? selected === card.id : undefined} onClick={() => onPick(card)}>
      <span className={styles.mark}><ModelGlyph icon={card.icon} /></span>
      <span className={styles.copy}><strong>{card.name}</strong><span>{card.subtitle}</span>
        <small>≈ {average?.toLocaleString("en-US")} tokens{card.demoTokens !== undefined && " · Demo"}</small>
      </span>
      {selected === card.id && <span className={styles.tick} aria-hidden="true">✓</span>}
      {planned && <small className={styles.planned}>Planned</small>}
    </button>
    <div className={styles.info} ref={wrap} onPointerEnter={e => {
      if (e.pointerType === "mouse") { hover.current = true; setOpen(true); }
    }} onPointerLeave={() => { hover.current = false; if (!wrap.current?.contains(document.activeElement)) setOpen(false); }}
      onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget) && !hover.current) setOpen(false); }}>
      <button type="button" className={styles.eye} ref={trigger} aria-expanded={open} aria-controls={open ? id : undefined}
        aria-label={`About ${card.name}`} onClick={() => setOpen(was => hover.current || !was)}>
        <ModelGlyph icon="eye" />
      </button>
      {open && <div className={styles.detail} id={id} role="region" aria-label={`About ${card.name}`}>
        <strong>{card.name}</strong><p>{card.detail}</p>
        {card.demoTokens !== undefined && <small>Demo amount for a typical request.</small>}
        {card.guide && <Link href={`/ai-models-guide/${card.guide}`} target="_blank" rel="noopener noreferrer">Read model guide ↗</Link>}
      </div>}
    </div>
  </div>;
}

type Bindings = { dictateButtonRef: RefObject<HTMLButtonElement | null>; accent?: string; openPicker: () => void; onBusyChange: (busy: boolean) => void };
export default function NewChatModels({ selected, onSelect, children }: {
  selected: string; onSelect: (id: string) => void; children: (bindings: Bindings) => ReactNode;
}) {
  const catalog = useChatCatalog();
  const chat = modelCards.filter(card => card.group === "Chat" && catalog.ids.includes(card.id));
  const mic = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [busy, setBusy] = useState(false);
  const title = useId();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<DiscoveryGroup | "All">("All");
  const pick = (card: ModelCard) => {
    if (busy) return;
    if (dialog.current?.open) dialog.current.close();
    if (card.id === "dictation") { if (mic.current?.getAttribute("aria-label") === "Dictate") mic.current.click(); }
    else if (catalog.ids.includes(card.id)) onSelect(card.id);
  };
  const choices = (cards: ModelCard[]) => cards.map(card =>
    <Choice key={card.id} card={card} selected={selected} onPick={pick} busy={busy} />);
  const groups = (inDialog = false) => {
    const term = inDialog ? query.trim().toLowerCase() : "";
    const regions = discoveryGroups.flatMap(group => {
      if (inDialog && category !== "All" && category !== group) return [];
      const cards = (group === "Chat" ? chat : modelCards.filter(c => c.group === group))
        .filter(card => !term || (card.name + " " + card.subtitle).toLowerCase().includes(term));
      if (!cards.length && (term || group !== "Chat")) return [];
      return [<section key={group} aria-label={group} className={styles.group}>
        <h3>{group}</h3>
        {group === "Chat" && catalog.status === "error" && <p role="status">Couldn’t refresh the model list. <button type="button" onClick={catalog.retry}>Retry</button></p>}
        {group === "Chat" && !chat.length && catalog.status !== "error" && <p role="status">{catalog.status === "loading" ? "Loading models…" : "No chat models are available."}</p>}
        <div className={styles.grid}>{choices(cards)}</div>
      </section>];
    });
    return regions.length ? regions : <p role="status">No matching models.</p>;
  };
  const openPicker = () => { setQuery(""); setCategory("All"); dialog.current?.showModal(); };
  return <>
    {!!chat.length && <section aria-label="Quick model selection" className={styles.quick}>{choices(chat.slice(0, 3))}</section>}
    {children({ dictateButtonRef: mic, accent: findModelCard(selected)?.accent, openPicker, onBusyChange: setBusy })}
    <div className={styles.library}>
      <div className={styles.heading}><div><h2>Explore models</h2><p>Average request cost in TITI. Demo marks sample amounts.</p></div><button type="button" onClick={openPicker}>All models</button></div>
      {groups()}
    </div>
    <dialog ref={dialog} className={styles.dialog} aria-labelledby={title} onClick={e => {
      if (e.target === e.currentTarget) {
        const r = e.currentTarget.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) e.currentTarget.close();
      }
    }}>
      <div className={styles.heading}><h2 id={title}>Choose a model</h2><button type="button" aria-label="Close model picker" onClick={() => dialog.current?.close()}>✕</button></div>
      <input type="search" className={styles.search} aria-label="Search models" placeholder="Search models" value={query} onChange={e => setQuery(e.target.value)} />
      <div className={styles.filters} aria-label="Filter models">{(["All", ...discoveryGroups] as const).map(g =>
        <button key={g} type="button" aria-pressed={g === category} onClick={() => setCategory(g)}>{g}</button>)}</div>
      {groups(true)}
    </dialog>
  </>;
}
