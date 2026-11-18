import type { Metadata } from "next";
import CheckoutView from "@/components/checkout/CheckoutView";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default function CheckoutPage() {
  return <div data-theme="light" style={{ background: "var(--bg)", color: "var(--text)" }}><CheckoutView paystackKey={process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? ""} /></div>;
}
