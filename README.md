# Paix Et Pearl Solutions — storefront

Mobile-first Next.js storefront for **Paix Et Pearl Solutions** (optical frames & fashion glasses, Nigeria).
Built from the Paix Et Pearl design system and the mobile/desktop mockups.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Plain CSS: design tokens in `app/globals.css`, component styles in CSS Modules
- Self-hosted fonts via Fontsource — Cormorant Garamond (headings), Cinzel (caps labels), Jost (body)
- `next/image` with optimised WebP sources in `public/images`
- Cart saved in the browser (`localStorage`)
- WhatsApp ordering via pre-filled `wa.me` links
- Paystack Inline checkout with server-side verification (switches on when keys are set)

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

| Variable | What it does |
| --- | --- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Number that receives orders, digits only in international format, e.g. `2348012345678` |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Paystack public key. Leave empty to offer "Pay on WhatsApp" only |
| `PAYSTACK_SECRET_KEY` | Paystack secret key, used only on the server by `/api/paystack/verify` |
| `NEXT_PUBLIC_SITE_URL` | Public URL, used for metadata and structured data |

Other scripts: `npm run build`, `npm start`, `npm run lint`, `npm run typecheck`.

## Pages

| Route | |
| --- | --- |
| `/` | Home — hero, categories, featured rail, why-us, styled-on-you, reviews, WhatsApp CTA |
| `/shop` | Catalogue with category bubbles, filters (sidebar on desktop, bottom sheet on mobile) and sort. Filters live in the URL: `?category=optical&shape=round,square&gender=women&max=40000&sort=price-asc` |
| `/product/[slug]` | Gallery (swipe on mobile, thumbnails on desktop), colour + lens options, prescription upload, WhatsApp order sheet, sticky buy bar on mobile, related rail |
| `/cart` | Quantities, totals, checkout or order the whole cart on WhatsApp |
| `/checkout` | Details, delivery option, payment (Paystack or WhatsApp) |
| `/order/confirmed` | Confirmation and next steps |
| `/api/paystack/verify` | Recomputes the order total from the catalogue and verifies the Paystack transaction |

## Where to change things

- **Products** — `lib/products.ts`. Add images to `public/images/products/` (4:3, ~1200×900, cream background).
- **Business details, nav, delivery fees** — `lib/site.ts`.
- **WhatsApp message wording** — `lib/whatsapp.ts`.
- **Colours, spacing, type** — tokens at the top of `app/globals.css`.

## Before launch — placeholders to replace

- Product names, prices, sizes and materials in `lib/products.ts` are **sample data**.
- Address, phone, Instagram handle, opening hours and delivery fees in `lib/site.ts` are placeholders (`[…]`).
- Customer reviews on the home page are placeholders — use real reviews with permission.
- Orders are not stored yet: WhatsApp orders arrive in chat, and paid Paystack orders show in the Paystack dashboard. See the `TODO` in `app/api/paystack/verify/route.ts` to add a database or email notification.
- Prescription uploads are not sent to a server; customers send them on WhatsApp.
- Accessibility note from the design system: white text on WhatsApp green (#25D366) is 2.0:1 contrast. Change `--on-whatsapp` in `app/globals.css` to `#0e0e0d` for an accessible version.

## Next steps

Admin (products & orders) needs a database and login — planned for phase 2.
