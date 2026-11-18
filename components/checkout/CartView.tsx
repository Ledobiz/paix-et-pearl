"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatNaira } from "@/lib/format";
import { lensOptions } from "@/lib/products";
import { orderMessage, whatsappLink } from "@/lib/whatsapp";
import { ButtonLink } from "../ui";
import { Minus, Plus, Shield, Trash } from "../icons";
import s from "./Checkout.module.css";

export default function CartView() {
  const { lines, subtotal, count, setQty, remove, ready } = useCart();

  if (!ready) return <div className={`container ${s.page}`} style={{ minHeight: "50vh" }} />;

  if (!lines.length)
    return (
      <div className={`container ${s.empty}`}>
        <span className={`ring ${s.emptyRing}`} aria-hidden="true" />
        <h1 className="h1" style={{ position: "relative", marginTop: 120 }}>Your cart is empty</h1>
        <p className="muted">Find a frame you love — we’ll fit your lenses and deliver it to you.</p>
        <ButtonLink href="/shop">Shop frames</ButtonLink>
      </div>
    );

  const wa = whatsappLink(orderMessage(lines.map((l) => ({ name: l.name, colour: l.colour, lens: l.lens, qty: l.qty, unitPrice: l.unitPrice }))));

  return (
    <div className={`container ${s.page}`}>
      <div className={s.head}><h1 className="h1">Your cart</h1><span className="muted">{count} {count === 1 ? "item" : "items"}</span></div>
      <div className={s.layout}>
        <div>
          {lines.map((l) => (
            <article key={l.key} className={s.line}>
              <div className={s.thumb}><Image src={l.image} alt="" fill sizes="128px" /></div>
              <div className={s.lineBody}>
                <div className={s.lineTop}>
                  <Link href={`/product/${l.slug}`} className="h3" style={{ fontSize: "1.25rem" }}>{l.name}</Link>
                  <button type="button" className={s.remove} aria-label={`Remove ${l.name}`} onClick={() => remove(l.key)}><Trash size={18} /></button>
                </div>
                <span className={s.meta}>{l.colour} · {lensOptions.find((o) => o.id === l.lens)?.label}</span>
                <div className={s.lineBottom}>
                  <div className={s.qty} role="group" aria-label={`Quantity of ${l.name}`}>
                    <button type="button" aria-label="Decrease quantity" disabled={l.qty <= 1} onClick={() => setQty(l.key, l.qty - 1)}><Minus size={16} /></button>
                    <span aria-live="polite">{l.qty}</span>
                    <button type="button" aria-label="Increase quantity" disabled={l.qty >= 10} onClick={() => setQty(l.key, l.qty + 1)}><Plus size={16} /></button>
                  </div>
                  <span className="price" style={{ fontSize: "1.0625rem" }}>{formatNaira(l.unitPrice * l.qty)}</span>
                </div>
              </div>
            </article>
          ))}
          <p style={{ marginTop: "var(--space-4)" }}><Link href="/shop" style={{ color: "var(--accent-text)", fontSize: "0.875rem" }}>Continue shopping</Link></p>
        </div>
        <aside className={s.aside}>
          <div className={s.summary}>
            <div className={s.row}><span>Subtotal</span><span>{formatNaira(subtotal)}</span></div>
            <div className={s.row}><span>Lens fitting</span><span>Included</span></div>
            <div className={s.row}><span>Delivery</span><span>At checkout</span></div>
            <div className={`${s.row} ${s.total}`}><span>Total</span><span>{formatNaira(subtotal)}</span></div>
          </div>
          <ButtonLink href="/checkout" block>Checkout</ButtonLink>
          <ButtonLink variant="whatsapp" href={wa} block>Order cart on WhatsApp</ButtonLink>
          <p className={s.note}><Shield size={16} />Secure payment by Paystack · card, transfer or USSD</p>
        </aside>
      </div>
    </div>
  );
}
