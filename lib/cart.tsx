"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getProduct, lensPrice, type LensId } from "./products";

export type CartItem = { slug: string; colour: string; lens: LensId; qty: number };
export type CartLine = CartItem & { key: string; name: string; image: string; unitPrice: number };

type CartCtx = {
  items: CartItem[];
  lines: CartLine[];
  count: number;
  subtotal: number;
  ready: boolean;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const KEY = "pp-cart-v1";
const Ctx = createContext<CartCtx | null>(null);
const keyOf = (i: Omit<CartItem, "qty">) => `${i.slug}|${i.colour}|${i.lens}`;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems((JSON.parse(raw) as CartItem[]).filter((i) => getProduct(i.slug)));
    } catch { /* storage unavailable */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* ignore */ }
  }, [items, ready]);

  const add = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    setItems((prev) => {
      const k = keyOf(item);
      const found = prev.find((p) => keyOf(p) === k);
      return found ? prev.map((p) => (keyOf(p) === k ? { ...p, qty: Math.min(10, p.qty + qty) } : p)) : [...prev, { ...item, qty }];
    });
  }, []);
  const setQty = useCallback((key: string, qty: number) =>
    setItems((prev) => prev.map((p) => (keyOf(p) === key ? { ...p, qty: Math.max(1, Math.min(10, qty)) } : p))), []);
  const remove = useCallback((key: string) => setItems((prev) => prev.filter((p) => keyOf(p) !== key)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartCtx>(() => {
    const lines: CartLine[] = items.flatMap((i) => {
      const p = getProduct(i.slug);
      if (!p) return [];
      const colour = p.colours.find((c) => c.name === i.colour);
      return [{ ...i, key: keyOf(i), name: p.name, image: colour?.image ?? p.images[0].src, unitPrice: p.price + lensPrice(i.lens) }];
    });
    return {
      items, lines, ready, add, setQty, remove, clear,
      count: lines.reduce((s, l) => s + l.qty, 0),
      subtotal: lines.reduce((s, l) => s + l.qty * l.unitPrice, 0),
    };
  }, [items, ready, add, setQty, remove, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside <CartProvider>");
  return c;
}
