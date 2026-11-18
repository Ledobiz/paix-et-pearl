import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui";
import { Chat, Check, Lens, Truck } from "@/components/icons";
import { generalEnquiry, whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Order received", robots: { index: false } };

type Props = { searchParams: Promise<Record<string, string | undefined>> };

export default async function Confirmed({ searchParams }: Props) {
  const sp = await searchParams;
  const ref = sp.ref && /^[A-Za-z0-9_-]{4,64}$/.test(sp.ref) ? sp.ref : undefined;
  const paid = sp.method === "paystack";
  const track = sp.wa ? whatsappLink(sp.wa.slice(0, 2000)) : ref ? whatsappLink(`Hello Paix Et Pearl, I'm checking on order ${ref}.`) : generalEnquiry();
  const steps = [
    { icon: <Chat size={18} />, t: paid ? "Send us your order on WhatsApp" : "Send the message we opened in WhatsApp", d: paid ? "Tap below so we can confirm details and your prescription." : "We’ll reply with payment details and confirm your order." },
    { icon: <Lens size={18} />, t: "Lenses are fitted", d: "We fit your lenses and check every frame before it ships." },
    { icon: <Truck size={18} />, t: "Delivered to your door", d: "Track progress any time in our WhatsApp chat." },
  ];
  return (
    <section className="container" style={{ position: "relative", overflow: "hidden", display: "grid", justifyItems: "center", textAlign: "center", gap: "var(--space-4)", paddingBlock: "var(--space-8) var(--space-9)", maxWidth: 640 }}>
      <span className="ring" aria-hidden="true" style={{ top: -180, width: 560, height: 560, left: "calc(50% - 280px)" }} />
      <div style={{ position: "relative", width: 112, height: 112, borderRadius: 999, border: "1px solid var(--accent-text)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ width: 72, height: 72, borderRadius: 999, background: "var(--action)", color: "var(--on-action)", display: "flex", alignItems: "center", justifyContent: "center" }}><Check size={36} strokeWidth={2} /></span>
      </div>
      {ref && <p className="eyebrow">Order {ref}</p>}
      <h1 className="display" style={{ fontSize: "clamp(2.25rem, 5vw, 3.25rem)", position: "relative" }}>{paid ? "Thank you. Your frames are on the way." : "Almost done — send your order on WhatsApp."}</h1>
      <p className="lead">{paid ? "Payment received. A receipt is on its way to your email." : "If WhatsApp didn’t open, tap the button below."}</p>
      <ul style={{ listStyle: "none", margin: "var(--space-4) 0 0", padding: "var(--space-5)", width: "100%", display: "grid", gap: "var(--space-4)", textAlign: "left", borderRadius: "var(--radius-card)", border: "1px solid var(--line-gold)", background: "var(--surface)" }}>
        {steps.map((st) => (
          <li key={st.t} style={{ display: "flex", gap: "var(--space-4)", alignItems: "flex-start" }}>
            <span style={{ flex: "none", width: 40, height: 40, borderRadius: 999, border: "1px solid var(--accent-text)", color: "var(--accent-text)", display: "flex", alignItems: "center", justifyContent: "center" }}>{st.icon}</span>
            <span><b style={{ fontWeight: 500, display: "block" }}>{st.t}</b><span className="muted" style={{ fontSize: "0.875rem" }}>{st.d}</span></span>
          </li>
        ))}
      </ul>
      <div style={{ display: "grid", gap: "var(--space-3)", width: "100%", marginTop: "var(--space-4)" }}>
        <ButtonLink variant="whatsapp" block href={track}>{paid ? "Send order on WhatsApp" : "Open WhatsApp"}</ButtonLink>
        <ButtonLink variant="secondary" block href="/shop">Continue shopping</ButtonLink>
      </div>
    </section>
  );
}
