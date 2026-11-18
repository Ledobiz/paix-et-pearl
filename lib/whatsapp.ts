import { site } from "./site";
import { formatNaira } from "./format";
import { lensOptions, type LensId } from "./products";

/** wa.me link with a pre-filled message. Falls back to a number-less link if none is configured. */
export function whatsappLink(message: string): string {
  const text = encodeURIComponent(message);
  return site.whatsappNumber ? `https://wa.me/${site.whatsappNumber}?text=${text}` : `https://wa.me/?text=${text}`;
}

export type OrderLine = { name: string; colour: string; lens: LensId; qty: number; unitPrice: number };

export function lineLabel(l: OrderLine) {
  const lens = lensOptions.find((o) => o.id === l.lens)?.label ?? "";
  return `${l.name} — ${l.colour} · ${lens}${l.qty > 1 ? ` × ${l.qty}` : ""}`;
}

export function orderMessage(lines: OrderLine[], extra?: string): string {
  const total = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0);
  const body = lines.map((l) => `• ${lineLabel(l)} (${formatNaira(l.unitPrice * l.qty)})`).join("\n");
  return [
    `Hello ${site.shortName}, I'd like to order:`,
    "",
    body,
    "",
    `Total: ${formatNaira(total)}`,
    extra ?? "Delivery to: [my area]",
  ].join("\n");
}

export const generalEnquiry = () => whatsappLink(`Hello ${site.shortName}, I'd like some help choosing frames.`);
