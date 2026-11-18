"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useCart } from "@/lib/cart";
import { formatNaira } from "@/lib/format";
import { lensOptions } from "@/lib/products";
import { deliveryOptions, nigerianStates, type DeliveryId } from "@/lib/site";
import { newOrderRef } from "@/lib/order";
import { lineLabel, whatsappLink } from "@/lib/whatsapp";
import { Button, ButtonLink, Field, Input, Select } from "../ui";
import { Check, Shield, Upload } from "../icons";
import s from "./Checkout.module.css";

type PaystackPopup = { newTransaction: (o: Record<string, unknown>) => void };
declare global { interface Window { PaystackPop?: new () => PaystackPopup } }

function loadPaystack(): Promise<void> {
  if (window.PaystackPop) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const sc = document.createElement("script");
    sc.src = "https://js.paystack.co/v2/inline.js";
    sc.onload = () => resolve();
    sc.onerror = () => reject(new Error("Could not load Paystack"));
    document.head.appendChild(sc);
  });
}

type Form = { name: string; phone: string; email: string; address: string; city: string; state: string };
const phoneOk = (p: string) => /^(\+?234|0)[789][01]\d{8}$/.test(p.replace(/[\s-]/g, ""));
const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export default function CheckoutView({ paystackKey }: { paystackKey: string }) {
  const router = useRouter();
  const { lines, subtotal, clear, ready } = useCart();
  const [f, setF] = useState<Form>({ name: "", phone: "", email: "", address: "", city: "", state: "Lagos" });
  const [delivery, setDelivery] = useState<DeliveryId>("lagos");
  const [pay, setPay] = useState<"paystack" | "whatsapp">(paystackKey ? "paystack" : "whatsapp");
  const [rx, setRx] = useState<string>();
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<string>();

  const fee = deliveryOptions.find((d) => d.id === delivery)!.fee;
  const total = subtotal + fee;
  const needsRx = lines.some((l) => l.lens === "rx");
  const set = (k: keyof Form) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }));

  if (!ready) return <div className={`container ${s.page}`} style={{ minHeight: "60vh" }} />;
  if (!lines.length)
    return (
      <div className={`container ${s.empty}`}>
        <h1 className="h1">Nothing to check out yet</h1>
        <p className="muted">Add a frame to your cart first.</p>
        <ButtonLink href="/shop">Shop frames</ButtonLink>
      </div>
    );

  const validate = () => {
    const e: typeof errors = {};
    if (f.name.trim().length < 2) e.name = "Enter your full name.";
    if (!phoneOk(f.phone)) e.phone = "Enter a Nigerian phone number, e.g. 0803 000 0000.";
    if (pay === "paystack" ? !emailOk(f.email) : f.email && !emailOk(f.email)) e.email = pay === "paystack" ? "Paystack needs an email for your receipt." : "Check your email address.";
    if (delivery !== "pickup" && f.address.trim().length < 5) e.address = "Enter your delivery address.";
    if (delivery !== "pickup" && f.city.trim().length < 2) e.city = "Enter your city or area.";
    setErrors(e);
    if (Object.keys(e).length) document.getElementById(`co-${Object.keys(e)[0]}`)?.focus();
    return !Object.keys(e).length;
  };

  const orderText = (ref: string, paid: boolean) => [
    `Hello Paix Et Pearl, ${paid ? "I've paid for" : "I'd like to place"} order ${ref}:`, "",
    ...lines.map((l) => `• ${lineLabel({ name: l.name, colour: l.colour, lens: l.lens, qty: l.qty, unitPrice: l.unitPrice })} (${formatNaira(l.unitPrice * l.qty)})`), "",
    `Delivery: ${deliveryOptions.find((d) => d.id === delivery)!.label} (${formatNaira(fee)})`,
    `Total: ${formatNaira(total)}`, "",
    `Name: ${f.name}`, `Phone: ${f.phone}`, ...(delivery !== "pickup" ? [`Address: ${f.address}, ${f.city}, ${f.state}`] : []),
    ...(needsRx ? ["", rx ? "I'll send my prescription in this chat." : "Prescription: I'll send it in this chat."] : []),
  ].join("\n");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setFailure(undefined);
    if (!validate()) return;
    const ref = newOrderRef();

    if (pay === "whatsapp") {
      window.open(whatsappLink(orderText(ref, false)), "_blank", "noopener");
      clear();
      router.push(`/order/confirmed?ref=${ref}&method=whatsapp`);
      return;
    }

    setBusy(true);
    try {
      await loadPaystack();
      const popup = new window.PaystackPop!();
      popup.newTransaction({
        key: paystackKey, email: f.email, amount: total * 100, currency: "NGN", reference: ref,
        metadata: { custom_fields: [
          { display_name: "Name", variable_name: "name", value: f.name },
          { display_name: "Phone", variable_name: "phone", value: f.phone },
          { display_name: "Delivery", variable_name: "delivery", value: delivery === "pickup" ? "Pick up" : `${f.address}, ${f.city}, ${f.state}` },
          { display_name: "Items", variable_name: "items", value: lines.map((l) => lineLabel({ ...l })).join("; ") },
        ] },
        onSuccess: async (tx: { reference: string }) => {
          const res = await fetch("/api/paystack/verify", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reference: tx.reference, delivery, items: lines.map(({ slug, colour, lens, qty }) => ({ slug, colour, lens, qty })) }),
          }).then((r) => r.json()).catch(() => ({ ok: false }));
          if (res.ok) {
            clear();
            router.push(`/order/confirmed?ref=${tx.reference}&method=paystack&wa=${encodeURIComponent(orderText(tx.reference, true))}`);
          } else {
            setFailure(`We couldn’t confirm payment for ${tx.reference}. Please contact us on WhatsApp with this reference.`);
            setBusy(false);
          }
        },
        onCancel: () => setBusy(false),
        onError: (err: { message?: string }) => { setFailure(err?.message ?? "Payment could not start."); setBusy(false); },
      });
    } catch (err) {
      setFailure((err as Error).message);
      setBusy(false);
    }
  };

  return (
    <div className={`container ${s.page}`}>
      <ol className={s.steps} aria-label="Checkout progress">
        <li data-state="done"><span><Check size={14} strokeWidth={2.4} /></span>Cart</li>
        <li data-state="now" aria-current="step"><span>2</span>Details</li>
        <li data-state="todo"><span>3</span>Done</li>
      </ol>
      <h1 className="h1" style={{ marginBottom: "var(--space-5)" }}>Checkout</h1>

      <form className={s.layout} onSubmit={submit} noValidate>
        <div className={s.form}>
          <fieldset className={s.fieldset}>
            <legend className="h3">Your details</legend>
            <Field id="co-name" label="Full name" error={errors.name}><Input id="co-name" autoComplete="name" value={f.name} onChange={set("name")} aria-invalid={!!errors.name} aria-describedby={errors.name ? "co-name-e" : undefined} /></Field>
            <Field id="co-phone" label="Phone number" hint="We’ll send delivery updates on WhatsApp." error={errors.phone}><Input id="co-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="0803 000 0000" value={f.phone} onChange={set("phone")} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "co-phone-e" : "co-phone-h"} /></Field>
            <Field id="co-email" label={pay === "paystack" ? "Email" : "Email (optional)"} hint="For your receipt." error={errors.email}><Input id="co-email" type="email" autoComplete="email" placeholder="you@example.com" value={f.email} onChange={set("email")} aria-invalid={!!errors.email} aria-describedby={errors.email ? "co-email-e" : "co-email-h"} /></Field>
          </fieldset>

          <fieldset className={s.fieldset}>
            <legend className="h3">Delivery</legend>
            {deliveryOptions.map((d) => (
              <label key={d.id} className={s.radio}>
                <input type="radio" name="delivery" value={d.id} checked={delivery === d.id} onChange={() => setDelivery(d.id)} />
                <span className={s.dot} aria-hidden="true" />
                <span className={s.radioText}><b>{d.label}</b><small>{d.note}</small></span>
                <span className="price">{d.fee ? formatNaira(d.fee) : "Free"}</span>
              </label>
            ))}
            {delivery !== "pickup" && (
              <>
                <Field id="co-address" label="Delivery address" error={errors.address}><Input id="co-address" autoComplete="street-address" placeholder="House number, street, area" value={f.address} onChange={set("address")} aria-invalid={!!errors.address} /></Field>
                <div className={s.two}>
                  <Field id="co-city" label="City / area" error={errors.city}><Input id="co-city" autoComplete="address-level2" value={f.city} onChange={set("city")} aria-invalid={!!errors.city} /></Field>
                  <Field id="co-state" label="State"><Select id="co-state" autoComplete="address-level1" value={f.state} onChange={set("state")}>{nigerianStates.map((st) => <option key={st}>{st}</option>)}</Select></Field>
                </div>
              </>
            )}
          </fieldset>

          {needsRx && (
            <label className={s.upload}>
              <Upload />
              <span style={{ flex: 1, display: "grid" }}><b style={{ fontWeight: 500 }}>{rx ? "Prescription selected" : "Prescription (optional now)"}</b><small className="muted">{rx ?? "Choose a photo or PDF — you’ll send it to us on WhatsApp to confirm."}</small></span>
              <input type="file" accept="image/*,application/pdf" onChange={(e) => setRx(e.target.files?.[0]?.name)} />
            </label>
          )}

          <fieldset className={s.fieldset}>
            <legend className="h3">Payment</legend>
            {paystackKey && (
              <label className={s.radio}>
                <input type="radio" name="pay" checked={pay === "paystack"} onChange={() => setPay("paystack")} />
                <span className={s.dot} aria-hidden="true" />
                <span className={s.radioText}><b>Card, transfer or USSD</b><small>Secure payment via Paystack</small></span>
              </label>
            )}
            <label className={s.radio}>
              <input type="radio" name="pay" checked={pay === "whatsapp"} onChange={() => setPay("whatsapp")} />
              <span className={s.dot} aria-hidden="true" />
              <span className={s.radioText}><b>Pay on WhatsApp</b><small>We’ll send bank transfer details in the chat</small></span>
            </label>
          </fieldset>
        </div>

        <aside className={s.aside}>
          <div className={s.summary}>
            <h2 className="h3">Order summary</h2>
            {lines.map((l) => (
              <div key={l.key} className={s.mini}>
                <span className={s.thumb}><Image src={l.image} alt="" fill sizes="56px" /></span>
                <span style={{ minWidth: 0 }}>{l.name}{l.qty > 1 && ` × ${l.qty}`}<br /><small className="muted">{l.colour} · {lensOptions.find((o) => o.id === l.lens)?.label}</small></span>
                <span>{formatNaira(l.unitPrice * l.qty)}</span>
              </div>
            ))}
            <div className={s.row}><span>Subtotal</span><span>{formatNaira(subtotal)}</span></div>
            <div className={s.row}><span>Delivery</span><span>{fee ? formatNaira(fee) : "Free"}</span></div>
            <div className={`${s.row} ${s.total}`}><span>Total</span><span>{formatNaira(total)}</span></div>
          </div>
          {failure && <p className={s.err} role="alert">{failure}</p>}
          {pay === "paystack"
            ? <Button type="submit" block disabled={busy}>{busy ? "Opening Paystack…" : `Pay ${formatNaira(total)}`}</Button>
            : <Button type="submit" variant="whatsapp" block>Send order on WhatsApp</Button>}
          <p className={s.note}><Shield size={16} />{pay === "paystack" ? "You’ll pay on Paystack’s secure window." : "Your order opens in WhatsApp, ready to send."}</p>
        </aside>
      </form>
    </div>
  );
}
