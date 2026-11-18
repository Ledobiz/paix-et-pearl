"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "./icons";
import { Counter, Progress, ui, cls } from "./ui";
import s from "./Rail.module.css";

/** Horizontal scroll-snap rail with gold progress line, counter and arrow controls. */
export default function Rail({ children, label, itemWidth, controls = "bottom", fade = true, className }:
  { children: ReactNode; label: string; itemWidth: string; controls?: "bottom" | "none"; fade?: boolean; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(0);
  const [visible, setVisible] = useState(0.3);
  const [index, setIndex] = useState(0);
  const count = Children.count(children);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setPos(max > 0 ? el.scrollLeft / max : 0);
    setVisible(el.scrollWidth ? el.clientWidth / el.scrollWidth : 1);
    const first = el.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 12;
    const step = first ? first.offsetWidth + gap : el.clientWidth;
    setIndex(Math.min(count - 1, Math.round(el.scrollLeft / step)));
  }, [count]);

  useEffect(() => {
    measure();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => { el.removeEventListener("scroll", measure); window.removeEventListener("resize", measure); };
  }, [measure]);

  const go = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 12;
    el.scrollBy({ left: dir * (first ? first.offsetWidth + gap : el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <div className={className}>
      <div ref={ref} className={cls("rail", fade && "fade-r", s.track)} role="region" aria-label={label} tabIndex={0} style={{ ["--item" as string]: itemWidth }}>
        {Children.map(children, (c) => <div className={s.item}>{c}</div>)}
      </div>
      {controls === "bottom" && (
        <div className={`container ${s.controls}`}>
          <Progress value={pos} size={visible} />
          <Counter current={index + 1} total={count} />
          <button type="button" className={ui.round} onClick={() => go(-1)} disabled={pos <= 0.001} aria-label={`Previous — ${label}`}><ChevronLeft size={18} /></button>
          <button type="button" className={ui.round} onClick={() => go(1)} disabled={pos >= 0.999} aria-label={`Next — ${label}`}><ChevronRight size={18} /></button>
        </div>
      )}
    </div>
  );
}
