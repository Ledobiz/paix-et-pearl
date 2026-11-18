import type { Metadata } from "next";
import CartView from "@/components/checkout/CartView";

export const metadata: Metadata = { title: "Your cart", robots: { index: false } };

export default function CartPage() {
  return <div data-theme="light" style={{ background: "var(--bg)", color: "var(--text)" }}><CartView /></div>;
}
