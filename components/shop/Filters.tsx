"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { filterProducts, genders, shapes, type ShopQuery } from "@/lib/products";
import { activeFilterCount, priceSteps, toSearch } from "@/lib/shopQuery";
import { formatNaira } from "@/lib/format";
import { generalEnquiry } from "@/lib/whatsapp";
import { Check, ChevronDown, Close, Filter, Sort } from "../icons";
import { Button, ButtonLink } from "../ui";
import s from "./Shop.module.css";

const toggle = <T,>(arr: T[] | undefined, v: T) => (arr?.includes(v) ? arr.filter((x) => x !== v) : [...(arr ?? []), v]);

function Panel({ q, set, idPrefix }: { q: ShopQuery; set: (q: ShopQuery) => void; idPrefix: string }) {
  return (
    <>
      <fieldset className={s.fs}>
        <legend>Shape</legend>
        {shapes.map((sh) => (
          <label key={sh.id} className={s.check} htmlFor={`${idPrefix}-shape-${sh.id}`}>
            <input id={`${idPrefix}-shape-${sh.id}`} type="checkbox" checked={!!q.shape?.includes(sh.id)} onChange={() => set({ ...q, shape: toggle(q.shape, sh.id) })} />
            <span className={s.box}><Check size={14} strokeWidth={2.4} /></span>{sh.label}
          </label>
        ))}
      </fieldset>
      <fieldset className={s.fs}>
        <legend>Gender</legend>
        <div className={s.chipRow}>
          {genders.map((g) => (
            <button key={g.id} type="button" className={s.chip} aria-pressed={!!q.gender?.includes(g.id)} onClick={() => set({ ...q, gender: toggle(q.gender, g.id) })}>{g.label}</button>
          ))}
        </div>
      </fieldset>
      <fieldset className={s.fs}>
        <legend>Price</legend>
        <div className={s.chipRow}>
          <button type="button" className={s.chip} aria-pressed={!q.max} onClick={() => set({ ...q, max: undefined })}>Any</button>
          {priceSteps.map((m) => (
            <button key={m} type="button" className={s.chip} aria-pressed={q.max === m} onClick={() => set({ ...q, max: m })}>Under {formatNaira(m)}</button>
          ))}
        </div>
      </fieldset>
    </>
  );
}

export function FilterSidebar({ query }: { query: ShopQuery }) {
  const router = useRouter();
  const [, start] = useTransition();
  const set = (q: ShopQuery) => start(() => router.replace(`/shop${toSearch(q)}`, { scroll: false }));
  return (
    <div className={s.panel}>
      <div className={s.panelHead}>
        <h2 className="h3" style={{ fontSize: "1.5rem" }}>Filters</h2>
        {activeFilterCount(query) > 0 && <button type="button" className={s.clear} style={{ background: "none", border: 0, cursor: "pointer" }} onClick={() => set({ category: query.category, sort: query.sort })}>Clear all</button>}
      </div>
      <Panel q={query} set={set} idPrefix="side" />
      <div className={s.help}>
        <span className={`ring ${s.helpRing}`} aria-hidden="true" />
        <h3 className="h3">Need help choosing?</h3>
        <p className="muted" style={{ fontSize: "0.875rem" }}>Send us a selfie and we’ll suggest frames.</p>
        <ButtonLink variant="whatsapp" size="sm" href={generalEnquiry()}>Ask on WhatsApp</ButtonLink>
      </div>
    </div>
  );
}

const sortLabels: Record<NonNullable<ShopQuery["sort"]>, string> = { newest: "Newest", popular: "Bestsellers", "price-asc": "Price: low to high", "price-desc": "Price: high to low" };

export function ShopToolbar({ query }: { query: ShopQuery }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<ShopQuery>(query);
  const count = activeFilterCount(query);

  useEffect(() => { if (open) setDraft(query); }, [open, query]);
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [open]);

  const apply = (q: ShopQuery) => router.replace(`/shop${toSearch(q)}`, { scroll: false });
  const results = filterProducts(draft).length;

  return (
    <>
      <div className={s.toolbar}>
        <button type="button" onClick={() => setOpen(true)} aria-haspopup="dialog">
          <Filter size={18} />Filter{count > 0 && <span className={s.num}>{count}</span>}
        </button>
        <label className={s.sortSelect}>
          <Sort size={18} />{sortLabels[query.sort ?? "newest"]}<ChevronDown size={16} style={{ color: "var(--text-secondary)" }} />
          <select aria-label="Sort products" value={query.sort ?? "newest"} onChange={(e) => apply({ ...query, sort: e.target.value as ShopQuery["sort"] })}>
            {Object.entries(sortLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
      </div>

      {open && (
        <>
          <div className={s.scrim} onClick={() => setOpen(false)} aria-hidden="true" />
          <div className={s.sheet} role="dialog" aria-modal="true" aria-label="Filters" data-theme="dark">
            <span className={s.grab} aria-hidden="true" />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px 8px var(--gutter)" }}>
              <h2 className="h3" style={{ fontSize: "1.5rem" }}>Filters</h2>
              <button type="button" className={s.iconBtn} aria-label="Close filters" onClick={() => setOpen(false)}><Close /></button>
            </div>
            <div className={s.sheetBody}><div className={s.panel}><Panel q={draft} set={setDraft} idPrefix="sheet" /></div></div>
            <div className={s.sheetFoot}>
              <Button variant="secondary" block onClick={() => setDraft({ category: query.category, sort: query.sort })}>Clear all</Button>
              <Button block onClick={() => { apply(draft); setOpen(false); }}>Show {results} {results === 1 ? "frame" : "frames"}</Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
