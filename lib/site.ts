export const site = {
  name: "Paix Et Pearl Solutions",
  shortName: "Paix Et Pearl",
  tagline: "See clearly. Look exceptional.",
  description: "Genuine optical frames and fashion glasses, fitted with your lenses and delivered across Nigeria.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, ""),
  // TODO: replace with the real details
  address: "[Shop address], Lagos",
  instagram: "[@handle]",
  instagramUrl: "#",
  phoneDisplay: "[+234 phone]",
  hours: ["Mon–Sat · [9am – 7pm]", "Sun · [1pm – 5pm]"],
};

export const nav = [
  { label: "Shop", href: "/shop" },
  { label: "Optical", href: "/shop?category=optical" },
  { label: "Fashion", href: "/shop?category=fashion" },
  { label: "Sunglasses", href: "/shop?category=sunglasses" },
  { label: "Blue-light", href: "/shop?category=blue-light" },
];

// TODO: confirm real delivery fees and times before launch
export const deliveryOptions = [
  { id: "lagos", label: "Lagos delivery", note: "1–2 working days", fee: 3000 },
  { id: "other", label: "Other states", note: "3–5 working days", fee: 6000 },
  { id: "pickup", label: "Pick up in store", note: "[Shop address], Lagos", fee: 0 },
] as const;
export type DeliveryId = (typeof deliveryOptions)[number]["id"];

export const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo",
  "Ekiti", "Enugu", "FCT (Abuja)", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];
