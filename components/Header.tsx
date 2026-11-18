"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { nav, site } from "@/lib/site";
import { useCart } from "@/lib/cart";
import { generalEnquiry } from "@/lib/whatsapp";
import { Bag, Chat, ChevronRight, Clock, Close, Instagram, Menu, Pin } from "./icons";
import { ButtonLink } from "./ui";
import s from "./Header.module.css";

function NavLinks({ onNavigate, drawer }: { onNavigate?: () => void; drawer?: boolean }) {
  const path = usePathname();
  const params = useSearchParams();
  const current = path + (params.get("category") ? `?category=${params.get("category")}` : "");
  return (
    <>
      {nav.map((l) => (
        <Link key={l.href} href={l.href} onClick={onNavigate} aria-current={current === l.href ? "page" : undefined}>
          {l.label}{drawer && <ChevronRight size={20} />}
        </Link>
      ))}
    </>
  );
}

export default function Header() {
  const { count, ready } = useCart();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={s.header} data-theme="dark">
      <div className={`container ${s.inner}`}>
        <button type="button" className={`${s.icon} ${s.menuBtn}`} aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}><Menu /></button>
        <Link href="/" className={s.logo} aria-label={`${site.name} — home`}>
          <Image src="/images/logo.webp" alt="" width={56} height={56} priority />
          <span className={s.word}>Paix Et Pearl<small>Solutions</small></span>
        </Link>
        <nav className={s.nav} aria-label="Main"><Suspense><NavLinks /></Suspense></nav>
        <span className={s.spacer} />
        <a className={`${s.icon} ${s.wa}`} href={generalEnquiry()} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp"><Chat /></a>
        <Link className={s.icon} href="/cart" aria-label={`Cart, ${ready ? count : 0} ${count === 1 ? "item" : "items"}`}>
          <Bag />{ready && count > 0 && <span className={s.count}>{count}</span>}
        </Link>
      </div>

      {open && createPortal(
        <div className={s.drawer} data-theme="dark" role="dialog" aria-modal="true" aria-label="Menu">
          <span className={`ring ${s.drawerRing}`} aria-hidden="true" />
          <div className={s.drawerTop}>
            <button type="button" className={s.icon} aria-label="Close menu" onClick={() => setOpen(false)}><Close /></button>
            <Image src="/images/logo.webp" alt={site.name} width={44} height={44} />
            <Link className={s.icon} href="/cart" aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`} onClick={() => setOpen(false)}><Bag /></Link>
          </div>
          <nav className={s.drawerNav} aria-label="Main"><Suspense><NavLinks drawer onNavigate={() => setOpen(false)} /></Suspense></nav>
          <div className={s.drawerFoot}>
            <ButtonLink variant="whatsapp" block href={generalEnquiry()}>Order on WhatsApp</ButtonLink>
            <p><Clock size={18} />{site.hours[0]}</p>
            <p><Pin size={18} />{site.address}</p>
            <p><Instagram size={18} />{site.instagram}</p>
          </div>
        </div>,
        document.body,
      )}
    </header>
  );
}
