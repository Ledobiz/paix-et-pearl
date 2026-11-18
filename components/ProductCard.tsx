"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { categoryLabel, type Product } from "@/lib/products";
import { formatNaira } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { orderMessage, whatsappLink } from "@/lib/whatsapp";
import { Badge, ButtonLink, Button } from "./ui";
import { Bag } from "./icons";
import s from "./ProductCard.module.css";

export default function ProductCard({ product, priority, sizes = "(max-width: 600px) 50vw, (max-width: 1100px) 33vw, 300px" }:
  { product: Product; priority?: boolean; sizes?: string }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const colour = product.colours[0];
  const lens = product.lenses[0];
  const href = `/product/${product.slug}`;
  const wa = whatsappLink(orderMessage([{ name: product.name, colour: colour.name, lens, qty: 1, unitPrice: product.price }]));

  return (
    <article className={s.card}>
      <div className={s.media}>
        {product.badge && <span className={s.badge}><Badge tone={product.badge.tone}>{product.badge.label}</Badge></span>}
        <Image src={colour.image ?? product.images[0].src} alt={product.images[0].alt} fill sizes={sizes} priority={priority} />
      </div>
      <div className={s.body}>
        <span className={s.cat}>{categoryLabel(product.category).replace(" frames", "").replace(" glasses", "")}</span>
        <Link href={href} className={s.name}>{product.name}</Link>
        <div className={s.row}>
          <span className={s.price}>{formatNaira(product.price)}</span>
          <span className={s.dots} aria-label={`Colours: ${product.colours.map((c) => c.name).join(", ")}`}>
            {product.colours.map((c) => <span key={c.name} className={s.dot} style={{ background: c.hex }} />)}
          </span>
        </div>
        <div className={s.actions}>
          <ButtonLink variant="whatsapp" block href={wa} aria-label={`Order ${product.name} on WhatsApp`}>
            <span className={s.long}>Order on WhatsApp</span><span className={s.short}>Order</span>
          </ButtonLink>
          <Button variant="secondary" block icon={<Bag />} aria-label={`Add ${product.name} to cart`}
            onClick={() => { add({ slug: product.slug, colour: colour.name, lens }); setAdded(true); setTimeout(() => setAdded(false), 2000); }}>
            <span className={s.long}>{added ? "Added" : "Add to cart"}</span><span className={s.short}>{added ? "Added" : "Add"}</span>
          </Button>
        </div>
      </div>
    </article>
  );
}
