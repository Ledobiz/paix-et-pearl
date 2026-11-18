/** 45000 → "₦45,000". Whole naira, no decimals. */
export function formatNaira(amount: number): string {
  const n = Math.round(Number(amount) || 0);
  return "₦" + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
