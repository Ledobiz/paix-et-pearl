import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import s from "./ui.module.css";
import { Chat, ChevronDown } from "./icons";

type Variant = "primary" | "secondary" | "whatsapp" | "ghost";
type Common = { variant?: Variant; size?: "md" | "sm"; block?: boolean; icon?: ReactNode; className?: string; children: ReactNode };

const cls = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const btnClass = (v: Variant, size?: string, block?: boolean, extra?: string) =>
  cls(s.btn, s[v], size === "sm" && s.sm, block && s.block, extra);

export function Button({ variant = "primary", size, block, icon, className, children, ...rest }: Common & Omit<ComponentProps<"button">, "children">) {
  const ic = icon !== undefined ? icon : variant === "whatsapp" ? <Chat /> : null;
  return <button type="button" className={btnClass(variant, size, block, className)} {...rest}>{ic}<span>{children}</span></button>;
}

export function ButtonLink({ variant = "primary", size, block, icon, className, children, href, external, ...rest }:
  Common & { href: string; external?: boolean } & Omit<ComponentProps<"a">, "children" | "href">) {
  const ic = icon !== undefined ? icon : variant === "whatsapp" ? <Chat /> : null;
  const c = btnClass(variant, size, block, className);
  if (external || href.startsWith("http"))
    return <a href={href} className={c} target="_blank" rel="noopener noreferrer" {...rest}>{ic}<span>{children}</span></a>;
  return <Link href={href} className={c} {...rest}>{ic}<span>{children}</span></Link>;
}

export function Badge({ tone = "gold", children }: { tone?: "gold" | "outline"; children: ReactNode }) {
  return <span className={cls(s.badge, tone === "gold" ? s.badgeGold : s.badgeOutline)}>{children}</span>;
}

export function Field({ label, hint, error, id, children }: { label: string; hint?: string; error?: string; id: string; children: ReactNode }) {
  return (
    <div className={cls(s.field, error && s.invalid)}>
      <label className={s.label} htmlFor={id}>{label}</label>
      {children}
      {error ? <div id={`${id}-e`} className={s.error} role="alert">{error}</div> : hint ? <div id={`${id}-h`} className={s.hint}>{hint}</div> : null}
    </div>
  );
}

export function Input(props: ComponentProps<"input">) { return <input className={s.input} {...props} />; }
export function Select({ children, ...props }: ComponentProps<"select">) {
  return <div className={s.selectWrap}><select className={s.input} {...props}>{children}</select><ChevronDown size={18} /></div>;
}

export function Progress({ value, size = 0.25 }: { value: number; size?: number }) {
  // value: 0..1 scroll position; size: visible fraction
  const w = Math.max(0.08, Math.min(1, size));
  return <div className={s.progress} aria-hidden="true"><div className={s.progressBar} style={{ width: `${w * 100}%`, transform: `translateX(${value * ((1 - w) / w) * 100}%)` }} /></div>;
}

export function Counter({ current, total }: { current: number; total: number }) {
  const p = (n: number) => String(n).padStart(2, "0");
  return <span className={s.counter}><b>{p(current)}</b> / {p(total)}</span>;
}

export { s as ui, cls };
