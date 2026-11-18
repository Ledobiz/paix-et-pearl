import { categories, genders, shapes, type Category, type Gender, type Shape, type ShopQuery } from "./products";

export const priceSteps = [30000, 40000, 50000];
const sorts = ["newest", "price-asc", "price-desc", "popular"] as const;

type Raw = Record<string, string | string[] | undefined>;
const list = (v: string | string[] | undefined) => (Array.isArray(v) ? v : v ? v.split(",") : []);

export function parseShopQuery(sp: Raw): ShopQuery {
  const cat = typeof sp.category === "string" ? sp.category : undefined;
  const max = Number(sp.max);
  const sort = typeof sp.sort === "string" && (sorts as readonly string[]).includes(sp.sort) ? (sp.sort as ShopQuery["sort"]) : "newest";
  return {
    category: categories.some((c) => c.id === cat) ? (cat as Category) : undefined,
    shape: list(sp.shape).filter((x): x is Shape => shapes.some((s) => s.id === x)),
    gender: list(sp.gender).filter((x): x is Gender => genders.some((g) => g.id === x)),
    max: priceSteps.includes(max) ? max : undefined,
    sort,
  };
}

export function toSearch(q: ShopQuery): string {
  const p = new URLSearchParams();
  if (q.category) p.set("category", q.category);
  if (q.shape?.length) p.set("shape", q.shape.join(","));
  if (q.gender?.length) p.set("gender", q.gender.join(","));
  if (q.max) p.set("max", String(q.max));
  if (q.sort && q.sort !== "newest") p.set("sort", q.sort);
  const s = p.toString();
  return s ? `?${s}` : "";
}

export const activeFilterCount = (q: ShopQuery) => (q.shape?.length ?? 0) + (q.gender?.length ?? 0) + (q.max ? 1 : 0);
