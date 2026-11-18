import { NextResponse } from "next/server";
import { computeTotal, type OrderItemInput } from "@/lib/order";
import type { DeliveryId } from "@/lib/site";

type Body = { reference?: string; items?: OrderItemInput[]; delivery?: DeliveryId };

export async function POST(req: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return NextResponse.json({ ok: false, error: "Paystack is not configured" }, { status: 503 });

  let body: Body;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 }); }
  const { reference, items, delivery } = body;
  if (!reference || !/^[A-Za-z0-9_-]{6,64}$/.test(reference) || !Array.isArray(items) || !items.length || !delivery)
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });

  let expected: number;
  try { expected = computeTotal(items, delivery).total; } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 400 });
  }

  const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secret}` }, cache: "no-store",
  });
  const data = await res.json().catch(() => null);
  const tx = data?.data;
  const paid = res.ok && data?.status && tx?.status === "success" && tx?.currency === "NGN" && tx?.amount === expected * 100;

  // TODO: save the order (database / email / WhatsApp notification) here once a backend is chosen.
  return NextResponse.json({ ok: !!paid, reference, amount: tx?.amount ? tx.amount / 100 : null }, { status: paid ? 200 : 402 });
}
