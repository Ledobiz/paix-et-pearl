import { getProduct, lensPrice, type LensId } from "./products";
import { deliveryOptions, type DeliveryId } from "./site";

export type OrderItemInput = { slug: string; colour: string; lens: LensId; qty: number };

/** Recomputes the order total from the catalogue — never trust a total sent by the browser. */
export function computeTotal(items: OrderItemInput[], delivery: DeliveryId) {
  let subtotal = 0;
  for (const i of items) {
    const p = getProduct(i.slug);
    if (!p || !p.colours.some((c) => c.name === i.colour) || !p.lenses.includes(i.lens)) throw new Error(`Invalid item: ${i.slug}`);
    const qty = Math.max(1, Math.min(10, Math.floor(i.qty)));
    subtotal += (p.price + lensPrice(i.lens)) * qty;
  }
  const fee = deliveryOptions.find((d) => d.id === delivery)?.fee;
  if (fee === undefined) throw new Error("Invalid delivery option");
  return { subtotal, fee, total: subtotal + fee };
}

export const newOrderRef = () => `PP-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
