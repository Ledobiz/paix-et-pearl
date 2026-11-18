import Image from "next/image";
import Link from "next/link";
import { nav, site } from "@/lib/site";
import { generalEnquiry } from "@/lib/whatsapp";
import s from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={s.footer} data-theme="dark">
      <div className={`container ${s.grid}`}>
        <div className={s.brand}>
          <Image src="/images/logo.webp" alt="" width={64} height={64} />
          <p className={s.brandName}>Paix Et Pearl</p>
          <p>{site.tagline}</p>
        </div>
        <div>
          <h2>Shop</h2>
          <ul>{nav.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}</ul>
        </div>
        <div>
          <h2>Talk to us</h2>
          <ul>
            <li><a href={generalEnquiry()} target="_blank" rel="noopener noreferrer">WhatsApp {site.phoneDisplay}</a></li>
            <li><a href={site.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram {site.instagram}</a></li>
            <li>{site.address}</li>
          </ul>
        </div>
        <div>
          <h2>Opening hours</h2>
          <ul>{site.hours.map((h) => <li key={h}>{h}</li>)}</ul>
        </div>
      </div>
      <div className={`container ${s.base}`}>
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span>Optical frames · Fashion glasses</span>
      </div>
    </footer>
  );
}
