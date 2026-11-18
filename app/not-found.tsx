import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="container" style={{ display: "grid", justifyItems: "center", textAlign: "center", gap: "var(--space-4)", paddingBlock: "var(--space-9)" }}>
      <p className="eyebrow">404</p>
      <h1 className="h1">We couldn’t find that page</h1>
      <p className="muted">It may have moved, or the frame is no longer available.</p>
      <ButtonLink href="/shop">Browse frames</ButtonLink>
    </section>
  );
}
