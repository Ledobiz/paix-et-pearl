import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { categories, products } from "@/lib/products";
import { generalEnquiry } from "@/lib/whatsapp";
import ProductCard from "@/components/ProductCard";
import Rail from "@/components/Rail";
import { ButtonLink, ui } from "@/components/ui";
import { ChevronRight, Lens, Shield, Star, Truck } from "@/components/icons";
import s from "./page.module.css";

// TODO: replace with real customer reviews (with permission)
const reviews = [
  { initials: "AO", product: "Amara Round", text: "[Customer review — a short quote about fit, style or delivery.]" },
  { initials: "TB", product: "Zuri Cat-eye", text: "[Customer review — a short quote about fit, style or delivery.]" },
  { initials: "NK", product: "Lagos Aviator", text: "[Customer review — a short quote about fit, style or delivery.]" },
  { initials: "FO", product: "Kemi Square", text: "[Customer review — a short quote about fit, style or delivery.]" },
];

function HeroImage() {
  const common = { alt: "Woman wearing gold cat-eye glasses from Paix Et Pearl", sizes: "(max-width: 900px) 100vw, 50vw", priority: true };
  const { props: { srcSet: desktop } } = getImageProps({ ...common, src: "/images/lifestyle/hero-desktop.webp", width: 928, height: 1152 });
  const { props: mobile } = getImageProps({ ...common, src: "/images/lifestyle/hero-mobile.webp", width: 1024, height: 1024 });
  return (
    <picture>
      <source media="(min-width: 900px)" srcSet={desktop} />
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img {...mobile} />
    </picture>
  );
}

export default function Home() {
  const featured = [...products].sort((a, b) => (a.bestseller ?? 99) - (b.bestseller ?? 99)).slice(0, 6);
  return (
    <>
      <section className={s.hero}>
        <div className={`container ${s.heroGrid}`}>
          <div className={s.heroMedia}>
            <HeroImage />
            <span className={`ring ${s.heroRing}`} aria-hidden="true" />
          </div>
          <div className={s.heroText}>
            <p className="eyebrow">New season frames</p>
            <h1 className="display">Frames that speak before you do</h1>
            <p className="lead">Genuine optical frames and fashion glasses, fitted with your lenses and delivered across Nigeria.</p>
            <div className={s.heroCtas}>
              <ButtonLink href="/shop" block>Shop frames</ButtonLink>
              <ButtonLink variant="whatsapp" href={generalEnquiry()} block>Order on WhatsApp</ButtonLink>
            </div>
            <div className={s.trust}>
              <span><Shield size={20} />Genuine frames</span>
              <span><Lens size={20} />Lens fitting</span>
              <span><Truck size={20} />Nationwide delivery</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ borderTop: "1px solid var(--line-gold)" }}>
        <div className="container">
          <div className="section-head">
            <div><p className="eyebrow">Shop by category</p><h2 className="h2">Find your frame</h2></div>
          </div>
          <div className={s.cats}>
            {categories.map((c) => (
              <Link key={c.id} href={`/shop?category=${c.id}`} className={s.cat}>
                <div className={s.catMedia}><Image src={c.image} alt="" fill sizes="(max-width: 900px) 50vw, 25vw" /></div>
                <span className={s.catLabel}>{c.label}<ChevronRight size={18} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={`section ${s.featured}`}>
        <div className="container section-head">
          <div><p className="eyebrow">Featured</p><h2 className="h2">This week’s favourites</h2></div>
          <Link href="/shop?sort=popular" className={`${ui.round} ${ui.roundSolid} ${s.viewAll}`} aria-label="View all bestsellers"><ChevronRight size={18} /></Link>
        </div>
        <Rail label="Featured frames" itemWidth="clamp(250px, 26vw, 300px)">
          {featured.map((p, i) => <ProductCard key={p.slug} product={p} priority={i < 2} sizes="300px" />)}
        </Rail>
      </section>

      <section className="section" data-theme="light" style={{ background: "var(--bg)", color: "var(--text)" }}>
        <div className="container">
          <div className={`section-head ${s.whyHead}`} style={{ justifyContent: "center" }}>
            <div className={s.whyHead}><p className="eyebrow">Why Paix Et Pearl</p><h2 className="h2">See clearly. Look exceptional.</h2></div>
          </div>
          <div className={s.whyGrid}>
            {[
              { icon: <Shield />, t: "Genuine frames", d: "Every frame is authentic and quality-checked before it leaves us." },
              { icon: <Lens />, t: "Lens fitting", d: "Send your prescription and we fit lenses to your new frames." },
              { icon: <Truck />, t: "Nationwide delivery", d: "Order from anywhere in Nigeria and we deliver to your door." },
            ].map((w) => (
              <div key={w.t} className={s.why}>
                <span className={s.whyIcon}>{w.icon}</span>
                <div><h3 className="h3">{w.t}</h3><p className="muted">{w.d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className={`container ${s.styled}`}>
          <div className={s.styledText}>
            <p className="eyebrow">Styled on you</p>
            <h2 className="h2">Frames for every day, every face</h2>
            <p className="muted">From the office to Sunday brunch — find a shape that feels like you.</p>
            <div><ButtonLink variant="secondary" href="/product/amara-round">Shop Amara Round</ButtonLink></div>
          </div>
          <div className={s.styledPics}>
            <figure className={s.styledPic}><Image src="/images/lifestyle/styled-woman.webp" alt="Woman with braids wearing tortoise round glasses in a café" fill sizes="(max-width: 900px) 50vw, 30vw" /><figcaption>Amara Round</figcaption></figure>
            <figure className={s.styledPic}><Image src="/images/lifestyle/styled-man.webp" alt="Man in a navy blazer wearing tortoise round glasses at work" fill sizes="(max-width: 900px) 50vw, 30vw" /><figcaption>Tobi Round</figcaption></figure>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container section-head">
          <div><p className="eyebrow">Kind words</p><h2 className="h2">From our customers</h2></div>
        </div>
        <Rail label="Customer reviews" itemWidth="clamp(290px, 30vw, 380px)">
          {reviews.map((r) => (
            <figure key={r.initials} className={s.review}>
              <span className={`ring ${s.reviewRing}`} aria-hidden="true" />
              <div className={s.quoteRow}>
                <span className={s.quoteMark} aria-hidden="true">“</span>
                <span className={s.stars} role="img" aria-label="Rated 5 out of 5">{[0, 1, 2, 3, 4].map((i) => <Star key={i} />)}</span>
              </div>
              <blockquote>{r.text}</blockquote>
              <div className={s.reviewRule} />
              <figcaption className={s.who}><span className={s.avatar}>{r.initials}</span><span>[Customer name]<small>Bought {r.product}</small></span></figcaption>
            </figure>
          ))}
        </Rail>
      </section>

      <section className="container" style={{ paddingBottom: "var(--space-9)" }}>
        <div className={s.cta}>
          <span className={`ring ${s.ctaRing1}`} aria-hidden="true" />
          <span className={`ring ${s.ctaRing2}`} aria-hidden="true" />
          <div style={{ display: "grid", gap: "var(--space-3)", maxWidth: 560 }}>
            <h2 className="h2">Not sure which frame suits you?</h2>
            <p className="lead">Send us a selfie on WhatsApp. We’ll suggest shapes that flatter your face.</p>
          </div>
          <ButtonLink variant="whatsapp" href={generalEnquiry()}>Chat with us</ButtonLink>
        </div>
      </section>
    </>
  );
}
