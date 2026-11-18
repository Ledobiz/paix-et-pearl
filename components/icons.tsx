import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };
const base = (size = 22, rest: SVGProps<SVGSVGElement>) => ({
  width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true, ...rest,
});
const make = (d: React.ReactNode) => function Icon({ size, ...rest }: P) { return <svg {...base(size, rest)}>{d}</svg>; };

export const ChevronRight = make(<path d="M9 6l6 6-6 6" />);
export const ChevronLeft = make(<path d="M15 6l-6 6 6 6" />);
export const ChevronDown = make(<path d="M6 9l6 6 6-6" />);
export const Close = make(<path d="M6 6l12 12M18 6L6 18" />);
export const Menu = make(<path d="M4 7h16M4 12h16M4 17h10" />);
export const Chat = make(<><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.1A8 8 0 1 1 20 11.5z" /><path d="M9 10.5h6M9 13.5h4" /></>);
export const Bag = make(<><path d="M5 8h14l-1 12H6L5 8z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></>);
export const Shield = make(<><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" /><path d="M9 12l2 2 4-4" /></>);
export const Lens = make(<><circle cx="7" cy="13" r="3.5" /><circle cx="17" cy="13" r="3.5" /><path d="M10.5 13h3M3.5 12L2 9M20.5 12L22 9" /></>);
export const Truck = make(<><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="17.5" r="1.5" /><circle cx="17" cy="17.5" r="1.5" /></>);
export const Filter = make(<path d="M4 7h16M7 12h10M10 17h4" />);
export const Sort = make(<path d="M7 4v16M4 17l3 3 3-3M17 20V4M14 7l3-3 3 3" />);
export const Plus = make(<path d="M12 5v14M5 12h14" />);
export const Minus = make(<path d="M5 12h14" />);
export const Trash = make(<path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12" />);
export const Check = make(<path d="M5 12.5l4.5 4.5L19 7.5" />);
export const Upload = make(<path d="M12 16V5M7.5 9.5L12 5l4.5 4.5M5 19h14" />);
export const Clock = make(<><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></>);
export const Pin = make(<><path d="M12 21s-6-5.5-6-10a6 6 0 0 1 12 0c0 4.5-6 10-6 10z" /><circle cx="12" cy="11" r="2" /></>);
export const Instagram = make(<><rect x="4" y="4" width="16" height="16" rx="4.5" /><circle cx="12" cy="12" r="3.5" /><path d="M16.5 7.5h.01" /></>);
export const Grid = make(<><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>);
export function Star({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 4l2.4 5 5.4.6-4 3.7 1.1 5.3L12 16l-4.9 2.6 1.1-5.3-4-3.7 5.4-.6z" /></svg>;
}
