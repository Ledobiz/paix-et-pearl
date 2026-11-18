export type Category = "optical" | "fashion" | "sunglasses" | "blue-light";
export type Shape = "round" | "square" | "cat-eye" | "aviator";
export type Gender = "women" | "men" | "unisex";
export type LensId = "frame" | "rx" | "blue";

export type Colour = { name: string; hex: string; image?: string };
export type Product = {
  slug: string;
  name: string;
  category: Category;
  shape: Shape;
  gender: Gender;
  price: number;
  badge?: { label: string; tone: "gold" | "outline" };
  description: string;
  colours: Colour[];
  images: { src: string; alt: string }[];
  details: { label: string; value: string }[];
  isNew?: boolean;
  bestseller?: number; // lower = more popular
  lenses: LensId[];
};

export const categories: { id: Category; label: string; blurb: string; image: string }[] = [
  { id: "optical", label: "Optical frames", blurb: "Everyday frames, ready for your prescription.", image: "/images/products/amara-round-front.webp" },
  { id: "fashion", label: "Fashion glasses", blurb: "Statement shapes for every outfit.", image: "/images/products/zuri-cat-eye.webp" },
  { id: "sunglasses", label: "Sunglasses", blurb: "Shade with style, made for Lagos sun.", image: "/images/products/lagos-aviator-gradient.webp" },
  { id: "blue-light", label: "Blue-light", blurb: "Lenses that filter screen glare.", image: "/images/products/dayo-square.webp" },
];

export const lensOptions: { id: LensId; label: string; note: string; price: number }[] = [
  { id: "frame", label: "Frame only", note: "Included", price: 0 },
  { id: "rx", label: "With prescription", note: "+ ₦15,000", price: 15000 },
  { id: "blue", label: "Blue-light lenses", note: "+ ₦10,000", price: 10000 },
];

export const shapes: { id: Shape; label: string }[] = [
  { id: "round", label: "Round" },
  { id: "square", label: "Square" },
  { id: "cat-eye", label: "Cat-eye" },
  { id: "aviator", label: "Aviator" },
];
export const genders: { id: Gender; label: string }[] = [
  { id: "women", label: "Women" },
  { id: "men", label: "Men" },
  { id: "unisex", label: "Unisex" },
];

const P = "/images/products/";
const opticalLenses: LensId[] = ["frame", "rx", "blue"];

// NOTE: sample catalogue — names, prices and details are placeholders until the real stock list is ready.
export const products: Product[] = [
  {
    slug: "amara-round", name: "Amara Round", category: "optical", shape: "round", gender: "unisex", price: 45000,
    badge: { label: "Bestseller", tone: "gold" }, bestseller: 1, lenses: opticalLenses,
    description: "A soft round acetate frame that flatters most face shapes. Light enough for all-day wear.",
    colours: [{ name: "Havana Tortoise", hex: "#8a4b1f", image: P + "amara-round-front.webp" }],
    images: [
      { src: P + "amara-round-front.webp", alt: "Amara Round in Havana Tortoise, front view" },
      { src: P + "amara-round-angle.webp", alt: "Amara Round, three-quarter view" },
      { src: P + "amara-round-hinge.webp", alt: "Close-up of the Amara Round hinge and temple" },
      { src: P + "amara-round-flat.webp", alt: "Amara Round folded, top view" },
    ],
    details: [
      { label: "Size", value: "48 □ 21 – 145 mm" }, { label: "Material", value: "Acetate" },
      { label: "Fits", value: "Medium faces" }, { label: "In the box", value: "Hard case & cleaning cloth" },
    ],
  },
  {
    slug: "zuri-cat-eye", name: "Zuri Cat-eye", category: "fashion", shape: "cat-eye", gender: "women", price: 38500,
    badge: { label: "New", tone: "gold" }, isNew: true, bestseller: 4, lenses: opticalLenses,
    description: "A bold champagne-gold cat-eye with a polished brow line. Instantly elevates any look.",
    colours: [{ name: "Champagne Gold", hex: "#d9c08c", image: P + "zuri-cat-eye.webp" }],
    images: [{ src: P + "zuri-cat-eye.webp", alt: "Zuri Cat-eye in Champagne Gold, front view" }],
    details: [
      { label: "Size", value: "53 □ 17 – 140 mm" }, { label: "Material", value: "Stainless steel" },
      { label: "Fits", value: "Medium to wide faces" }, { label: "In the box", value: "Hard case & cleaning cloth" },
    ],
  },
  {
    slug: "kemi-square", name: "Kemi Square", category: "blue-light", shape: "square", gender: "unisex", price: 32000,
    badge: { label: "Blue-light", tone: "outline" }, bestseller: 3, lenses: ["blue", "rx"],
    description: "A matte black square frame fitted with clear blue-light lenses for long days on screens.",
    colours: [{ name: "Matte Onyx", hex: "#141414", image: P + "kemi-square.webp" }],
    images: [{ src: P + "kemi-square.webp", alt: "Kemi Square in Matte Onyx, front view" }],
    details: [
      { label: "Size", value: "52 □ 19 – 145 mm" }, { label: "Material", value: "Acetate" },
      { label: "Lenses", value: "Blue-light filtering" }, { label: "In the box", value: "Hard case & cleaning cloth" },
    ],
  },
  {
    slug: "lagos-aviator", name: "Lagos Aviator", category: "sunglasses", shape: "aviator", gender: "unisex", price: 52000,
    bestseller: 2, lenses: ["frame"],
    description: "A classic gunmetal aviator with UV-protective lenses. Made for bright Lagos afternoons.",
    colours: [
      { name: "Gunmetal · Smoke", hex: "#3a3b3a", image: P + "lagos-aviator-dark.webp" },
      { name: "Gunmetal · Gradient", hex: "#6b6d6e", image: P + "lagos-aviator-gradient.webp" },
    ],
    images: [
      { src: P + "lagos-aviator-dark.webp", alt: "Lagos Aviator with smoke lenses, front view" },
      { src: P + "lagos-aviator-gradient.webp", alt: "Lagos Aviator with gradient lenses, front view" },
    ],
    details: [
      { label: "Size", value: "58 □ 14 – 140 mm" }, { label: "Material", value: "Metal" },
      { label: "Lenses", value: "UV400 protection" }, { label: "In the box", value: "Hard case & cleaning cloth" },
    ],
  },
  {
    slug: "ifeoma-round", name: "Ifeoma Round", category: "optical", shape: "round", gender: "women", price: 41000,
    bestseller: 6, lenses: opticalLenses,
    description: "A fine champagne-gold wire frame with soft round lenses. Quietly elegant.",
    colours: [{ name: "Brushed Gold", hex: "#d6c29a", image: P + "ifeoma-round.webp" }],
    images: [{ src: P + "ifeoma-round.webp", alt: "Ifeoma Round in Brushed Gold, front view" }],
    details: [
      { label: "Size", value: "50 □ 20 – 145 mm" }, { label: "Material", value: "Titanium" },
      { label: "Fits", value: "Small to medium faces" }, { label: "In the box", value: "Hard case & cleaning cloth" },
    ],
  },
  {
    slug: "bisi-soft-square", name: "Bisi Soft Square", category: "optical", shape: "square", gender: "unisex", price: 29500,
    badge: { label: "New", tone: "gold" }, isNew: true, bestseller: 8, lenses: opticalLenses,
    description: "A crystal-clear soft square frame. Fresh, modern and easy to wear every day.",
    colours: [{ name: "Crystal", hex: "#e9eceb", image: P + "bisi-soft-square.webp" }],
    images: [{ src: P + "bisi-soft-square.webp", alt: "Bisi Soft Square in Crystal, front view" }],
    details: [
      { label: "Size", value: "51 □ 20 – 145 mm" }, { label: "Material", value: "Acetate" },
      { label: "Fits", value: "Medium faces" }, { label: "In the box", value: "Hard case & cleaning cloth" },
    ],
  },
  {
    slug: "tobi-round", name: "Tobi Round", category: "optical", shape: "round", gender: "men", price: 47500,
    bestseller: 5, lenses: opticalLenses,
    description: "A deeper tortoise round frame with keyhole bridge and metal rivets.",
    colours: [{ name: "Dark Tortoise", hex: "#5a3416", image: P + "tobi-round.webp" }],
    images: [{ src: P + "tobi-round.webp", alt: "Tobi Round in Dark Tortoise, front view" }],
    details: [
      { label: "Size", value: "49 □ 21 – 145 mm" }, { label: "Material", value: "Acetate" },
      { label: "Fits", value: "Medium faces" }, { label: "In the box", value: "Hard case & cleaning cloth" },
    ],
  },
  {
    slug: "nneka-cat-eye", name: "Nneka Cat-eye", category: "fashion", shape: "cat-eye", gender: "women", price: 43000,
    bestseller: 7, lenses: opticalLenses,
    description: "A slim gold wire cat-eye with a gentle upsweep. Feminine and featherlight.",
    colours: [{ name: "Rose Gold", hex: "#d8b99a", image: P + "nneka-cat-eye.webp" }],
    images: [{ src: P + "nneka-cat-eye.webp", alt: "Nneka Cat-eye in Rose Gold, front view" }],
    details: [
      { label: "Size", value: "54 □ 17 – 140 mm" }, { label: "Material", value: "Stainless steel" },
      { label: "Fits", value: "Medium faces" }, { label: "In the box", value: "Hard case & cleaning cloth" },
    ],
  },
  {
    slug: "dayo-square", name: "Dayo Square", category: "blue-light", shape: "square", gender: "men", price: 36000,
    bestseller: 9, lenses: ["blue", "rx"],
    description: "A glossy black square frame with blue-light lenses and silver rivet detail.",
    colours: [{ name: "Gloss Black", hex: "#0f0f10", image: P + "dayo-square.webp" }],
    images: [{ src: P + "dayo-square.webp", alt: "Dayo Square in Gloss Black, front view" }],
    details: [
      { label: "Size", value: "53 □ 18 – 145 mm" }, { label: "Material", value: "Acetate" },
      { label: "Lenses", value: "Blue-light filtering" }, { label: "In the box", value: "Hard case & cleaning cloth" },
    ],
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const categoryLabel = (c: Category) => categories.find((x) => x.id === c)?.label ?? c;
export const lensPrice = (id: LensId) => lensOptions.find((l) => l.id === id)?.price ?? 0;

export type ShopQuery = {
  category?: Category; shape?: Shape[]; gender?: Gender[]; max?: number;
  sort?: "newest" | "price-asc" | "price-desc" | "popular";
};

export function filterProducts(q: ShopQuery): Product[] {
  let list = products.filter((p) =>
    (!q.category || p.category === q.category) &&
    (!q.shape?.length || q.shape.includes(p.shape)) &&
    (!q.gender?.length || q.gender.includes(p.gender) || p.gender === "unisex") &&
    (!q.max || p.price <= q.max));
  switch (q.sort) {
    case "price-asc": list = [...list].sort((a, b) => a.price - b.price); break;
    case "price-desc": list = [...list].sort((a, b) => b.price - a.price); break;
    case "popular": list = [...list].sort((a, b) => (a.bestseller ?? 99) - (b.bestseller ?? 99)); break;
    default: list = [...list].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
  }
  return list;
}
