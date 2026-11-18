import type { Metadata, Viewport } from "next";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "@fontsource/cinzel/500.css";
import "@fontsource/jost/400.css";
import "@fontsource/jost/500.css";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/cart";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — Optical frames & fashion glasses`, template: `%s · ${site.shortName}` },
  description: site.description,
  openGraph: { title: site.name, description: site.description, images: ["/images/lifestyle/hero-desktop.webp"], type: "website", locale: "en_NG" },
};

export const viewport: Viewport = { themeColor: "#0e0e0d", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG" data-theme="dark">
      <body>
        <CartProvider>
          <a href="#main" className="sr-only skip">Skip to content</a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
