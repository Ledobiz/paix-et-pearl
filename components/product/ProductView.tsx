"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { lensOptions, lensPrice, type LensId, type Product } from "@/lib/products";
import { formatNaira } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { orderMessage, whatsappLink } from "@/lib/whatsapp";
import { Badge, Button, ButtonLink, ui } from "../ui";
import { Close, Shield, Truck, Upload } from "../icons";
import s from "./Product.module.css";

function Gallery({ product, activeImage }: { product: Product; activeImage?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const images = product.images;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => setIdx(Math.round(el.scrollLeft / Math.max(1, (el.firstElementChild as HTMLElement)?.offsetWidth + (window.innerWidth >= 900 ? 0 : 10))));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const go = (i: number) => {
    const el = ref.current;
    const child = el?.children[i] as HTMLElement | undefined;
    if (el && child) el.scrollTo({ left: child.offsetLeft - el.offsetLeft - (window.innerWidth >= 900 ? 0 : parseFloat(getComputedStyle(el).paddingLeft)), behavior: "smooth" });
  };

  // jump to the selected colour's photo
  useEffect(() => {
    if (!activeImage) return;
    const i = images.findIndex((im) => im.src === activeImage);
    if (i >= 0) go(i);
  }, [activeImage, images]);

  return (
    <div className={s.gallery}>
      <div ref={ref} className={s.slides} role="region" aria-label={`${product.name} photos`} tabIndex={0}>
        {images.map((im, i) => (
          <div key={im.src} className={s.slide}>
            {images.length > 1 && <div className={s.segs} aria-hidden="true">{images.map((_, k) => <span key={k} data-on={k === idx} />)}</div>}
            {i === 0 && product.badge && <span className={s.slideBadge}><Badge tone={product.badge.tone}>{product.badge.label}</Badge></span>}
            <Image src={im.src} alt={im.alt} fill priority={i === 0} sizes="(max-width: 900px) 86vw, 640px" />
            {images.length > 1 && <span className={s.pager}>{idx + 1} / {images.length}</span>}
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <div className={s.thumbs}>
          {images.map((im, i) => (
            <button key={im.src} type="button" className={s.thumb} aria-label={`Show photo ${i + 1}`} aria-current={i === idx} onClick={() => go(i)}>
              <Image src={im.src} alt="" fill sizes="88px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductView({ product }: { product: Product }) {
  const { add } = useCart();
  const [colour, setColour] = useState(product.colours[0]);
  const [lens, setLens] = useState<LensId>(product.lenses[0]);
  const [rxFile, setRxFile] = useState<string>();
  const [added, setAdded] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const buyRef = useRef<HTMLDivElement>(null);

  const unit = product.price + lensPrice(lens);
  const lensLabel = lensOptions.find((l) => l.id === lens)!.label;
  const defaultMsg = orderMessage([{ name: product.name, colour: colour.name, lens, qty: 1, unitPrice: unit }],
    `${lens === "rx" ? "I'll send my prescription in this chat.\n" : ""}Delivery to: [my area]`);
  const [msg, setMsg] = useState(defaultMsg);
  useEffect(() => setMsg(defaultMsg), [defaultMsg]);

  // sticky bar appears once the main buy box scrolls out of view (mobile)
  useEffect(() => {
    const el = buyRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!sheet) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheet(false);
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [sheet]);

  const addToCart = () => { add({ slug: product.slug, colour: colour.name, lens }); setAdded(true); setTimeout(() => setAdded(false), 2500); };
  const lenses = lensOptions.filter((l) => product.lenses.includes(l.id));

  return (
    <>
      <div className={s.layout}>
        <Gallery product={product} activeImage={colour.image} />
        <div className={`stagger ${s.info}`}>
          <div className={s.titleBlock}>
            <p className="eyebrow">{product.category.replace("-", " ")} · {product.gender}</p>
            <h1 className="h1">{product.name}</h1>
            <p className={`price ${s.priceLine}`}>{formatNaira(product.price)} <small>frame only</small></p>
            <p className="muted" style={{ maxWidth: 520 }}>{product.description}</p>
          </div>
          <div className={s.rule} />

          <div>
            <p className={s.groupLabel} id="colour-l">Colour · <b>{colour.name}</b></p>
            <div className={ui.swatches} role="radiogroup" aria-labelledby="colour-l">
              {product.colours.map((c) => (
                <button key={c.name} type="button" role="radio" aria-checked={c.name === colour.name} aria-label={c.name} title={c.name}
                  className={`${ui.swatch} ${ui.swatchLg}`} style={{ background: c.hex }} onClick={() => setColour(c)} />
              ))}
            </div>
          </div>

          {lenses.length > 1 && (
            <div>
              <p className={s.groupLabel} id="lens-l">Lenses</p>
              <div className={ui.options} role="radiogroup" aria-labelledby="lens-l">
                {lenses.map((l) => (
                  <button key={l.id} type="button" role="radio" aria-checked={lens === l.id} className={ui.option} onClick={() => setLens(l.id)}>
                    <span>{l.label}</span><small>{l.note}</small>
                  </button>
                ))}
              </div>
            </div>
          )}

          {lens === "rx" && (
            <label className={s.upload}>
              <Upload />
              <span style={{ flex: 1 }}>{rxFile ? <>Prescription added<small>{rxFile} — we’ll ask you to send it on WhatsApp or at checkout</small></> : <>Add your prescription<small>Photo or PDF of your eye test — or send it on WhatsApp later</small></>}</span>
              <span className="caps" style={{ fontSize: "0.6875rem", color: "var(--accent-text)" }}>{rxFile ? "Change" : "Upload"}</span>
              <input type="file" accept="image/*,application/pdf" onChange={(e) => setRxFile(e.target.files?.[0]?.name)} />
            </label>
          )}

          <div className={s.buy} ref={buyRef}>
            <div className={s.buyTotal}><span>{colour.name} · {lensLabel}</span><span className="price" style={{ fontSize: "1.375rem" }}>{formatNaira(unit)}</span></div>
            <div className={s.buyBtns}>
              <Button variant="whatsapp" block onClick={() => setSheet(true)}>Order on WhatsApp</Button>
              <ButtonLink block href="/checkout" onClick={() => add({ slug: product.slug, colour: colour.name, lens })}>Buy now</ButtonLink>
            </div>
            <Button variant="secondary" block onClick={addToCart}>{added ? "Added to cart" : "Add to cart"}</Button>
            <p className={s.toast} role="status" aria-live="polite">{added ? `${product.name} added to your cart.` : ""}</p>
          </div>

          <div className={s.perks}>
            <p><Truck size={20} />Delivery across Nigeria</p>
            <p><Shield size={20} />Genuine, quality-checked</p>
          </div>

          <div className={s.details}>
            <h2 className="h3">Frame details</h2>
            {product.details.map((d) => <div key={d.label} className={s.detail}><span>{d.label}</span><span>{d.value}</span></div>)}
          </div>
        </div>
      </div>

      <div className={s.bar} data-show={showBar} aria-hidden={!showBar}>
        <div className={s.barTop}><span>{colour.name} · {lensLabel}</span><b>{formatNaira(unit)}</b></div>
        <div className={s.buyBtns}>
          <Button variant="whatsapp" block onClick={() => setSheet(true)} tabIndex={showBar ? 0 : -1}>Order on WhatsApp</Button>
          <ButtonLink block href="/checkout" tabIndex={showBar ? 0 : -1} onClick={() => add({ slug: product.slug, colour: colour.name, lens })}>Buy now</ButtonLink>
        </div>
      </div>

      {sheet && (
        <>
          <div className={s.scrim} onClick={() => setSheet(false)} aria-hidden="true" />
          <div className={s.sheet} role="dialog" aria-modal="true" aria-labelledby="wa-title" data-theme="dark">
            <span className={s.grab} aria-hidden="true" />
            <div className={s.sheetHead}>
              <div style={{ display: "grid", gap: 6 }}><p className="eyebrow">Order on WhatsApp</p><h2 id="wa-title" className="h3" style={{ fontSize: "1.625rem" }}>We’ll prepare your message</h2></div>
              <button type="button" className={s.close} aria-label="Close" onClick={() => setSheet(false)}><Close /></button>
            </div>
            <div className={s.summary}>
              <div className={s.summaryImg}><Image src={colour.image ?? product.images[0].src} alt="" fill sizes="84px" /></div>
              <div style={{ display: "grid", gap: 2, minWidth: 0 }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.1875rem" }}>{product.name}</span>
                <span className="muted" style={{ fontSize: "0.8125rem" }}>{colour.name} · {lensLabel}</span>
                <span className="price">{formatNaira(unit)}</span>
              </div>
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              <label htmlFor="wa-msg" className="caps" style={{ fontSize: "0.6875rem", color: "var(--text-secondary)" }}>Your message</label>
              <textarea id="wa-msg" className={s.msg} value={msg} onChange={(e) => setMsg(e.target.value)} />
              <p className="muted" style={{ fontSize: "0.8125rem" }}>You can still edit it in WhatsApp before sending.</p>
            </div>
            <ButtonLink variant="whatsapp" block href={whatsappLink(msg)}>Open WhatsApp</ButtonLink>
            <button type="button" className={s.alt} onClick={() => { addToCart(); setSheet(false); }}>Or add to cart and pay online</button>
          </div>
        </>
      )}
    </>
  );
}
