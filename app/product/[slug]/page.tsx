import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categoryLabel, getProduct, products } from "@/lib/products";
import { formatNaira } from "@/lib/format";
import { site } from "@/lib/site";
import ProductView from "@/components/product/ProductView";
import ProductCard from "@/components/ProductCard";
import Rail from "@/components/Rail";
import s from "@/components/product/Product.module.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  return {
    title: p.name,
    description: `${p.description} ${formatNaira(p.price)}.`,
    openGraph: { title: `${p.name} · ${site.shortName}`, images: [p.images[0].src] },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const related = products.filter((p) => p.slug !== product.slug)
    .sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category)).slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org", "@type": "Product", name: product.name, description: product.description,
    image: product.images.map((i) => `${site.url}${i.src}`), brand: { "@type": "Brand", name: site.name },
    offers: { "@type": "Offer", priceCurrency: "NGN", price: product.price, availability: "https://schema.org/InStock" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="container">
        <p className={s.crumbs}><Link href="/">Home</Link> / <Link href={`/shop?category=${product.category}`}>{categoryLabel(product.category)}</Link> / <span style={{ color: "var(--text-secondary)" }}>{product.name}</span></p>
        <ProductView product={product} />
      </div>
      <section className="section" style={{ borderTop: "1px solid var(--line-gold)" }}>
        <div className="container section-head">
          <div><p className="eyebrow">Complete the look</p><h2 className="h2">You may also like</h2></div>
        </div>
        <Rail label="You may also like" itemWidth="clamp(250px, 26vw, 300px)">
          {related.map((p) => <ProductCard key={p.slug} product={p} sizes="300px" />)}
        </Rail>
      </section>
    </>
  );
}
