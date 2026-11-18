import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { categories, filterProducts, genders, shapes } from "@/lib/products";
import { formatNaira } from "@/lib/format";
import { parseShopQuery, toSearch } from "@/lib/shopQuery";
import ProductCard from "@/components/ProductCard";
import { FilterSidebar, ShopToolbar } from "@/components/shop/Filters";
import { Close, Grid } from "@/components/icons";
import { ButtonLink } from "@/components/ui";
import s from "@/components/shop/Shop.module.css";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const q = parseShopQuery(await searchParams);
  const c = categories.find((x) => x.id === q.category);
  return { title: c ? c.label : "Shop all frames", description: c?.blurb ?? "Optical frames, fashion glasses, sunglasses and blue-light glasses." };
}

export default async function ShopPage({ searchParams }: Props) {
  const query = parseShopQuery(await searchParams);
  const items = filterProducts(query);
  const cat = categories.find((c) => c.id === query.category);

  const pills = [
    ...(query.shape ?? []).map((v) => ({ label: shapes.find((x) => x.id === v)!.label, next: { ...query, shape: query.shape!.filter((x) => x !== v) } })),
    ...(query.gender ?? []).map((v) => ({ label: genders.find((x) => x.id === v)!.label, next: { ...query, gender: query.gender!.filter((x) => x !== v) } })),
    ...(query.max ? [{ label: `Under ${formatNaira(query.max)}`, next: { ...query, max: undefined } }] : []),
  ];

  return (
    <>
      <div className="container">
        <section className={s.banner}>
          <div className={s.bannerText}>
            <p className={s.crumbs}><Link href="/">Home</Link> / <Link href="/shop">Shop</Link>{cat && <> / {cat.label}</>}</p>
            <h1 className="h1">{cat ? cat.label : "All frames"}</h1>
            <p className="muted">{cat ? cat.blurb : "Optical frames, fashion glasses and sunglasses — fitted by us, delivered to you."}</p>
          </div>
          <div className={s.bannerMedia}>
            <Image src="/images/lifestyle/shop-banner.webp" alt="" fill priority sizes="(max-width: 900px) 100vw, 60vw" />
          </div>
        </section>
      </div>

      <nav aria-label="Categories" className={`rail fade-r ${s.bubbles}`} style={{ gap: "var(--space-4)" }}>
        <Link href={`/shop${toSearch({ ...query, category: undefined })}`} className={s.bubble} aria-current={!query.category ? "true" : undefined}>
          <span className={s.bubbleImg}><Grid size={26} /></span><span>All</span>
        </Link>
        {categories.map((c) => (
          <Link key={c.id} href={`/shop${toSearch({ ...query, category: c.id })}`} className={s.bubble} aria-current={query.category === c.id ? "true" : undefined}>
            <span className={s.bubbleImg}><Image src={c.image} alt="" fill sizes="92px" /></span><span>{c.label.replace(" frames", "").replace(" glasses", "")}</span>
          </Link>
        ))}
      </nav>

      <div className={`container ${s.layout}`}>
        <aside className={s.sidebar} aria-label="Filters"><FilterSidebar query={query} /></aside>
        <div style={{ minWidth: 0, display: "grid", gap: "var(--space-4)", alignContent: "start" }}>
          <div className={s.status}>
            <div className={s.pills}>
              <span className={s.count}>{items.length} {items.length === 1 ? "frame" : "frames"}</span>
              {pills.map((p) => (
                <Link key={p.label} className={s.pill} href={`/shop${toSearch(p.next)}`} scroll={false} aria-label={`Remove filter ${p.label}`}>{p.label}<span><Close size={14} /></span></Link>
              ))}
              {pills.length > 0 && <Link className={s.clear} href={`/shop${toSearch({ category: query.category, sort: query.sort })}`} scroll={false}>Clear all</Link>}
            </div>
            <div style={{ flex: "1 1 260px", maxWidth: 520 }}><ShopToolbar query={query} /></div>
          </div>

          {items.length ? (
            <div className={s.grid}>{items.map((p, i) => <ProductCard key={p.slug} product={p} priority={i < 4} />)}</div>
          ) : (
            <div className={s.empty}>
              <h2 className="h3">No frames match those filters</h2>
              <p className="muted">Try removing a filter, or ask us on WhatsApp — we may have it in store.</p>
              <ButtonLink variant="secondary" href={`/shop${toSearch({ category: query.category })}`}>Clear filters</ButtonLink>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
