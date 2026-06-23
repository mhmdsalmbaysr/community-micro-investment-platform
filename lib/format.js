export function fmt(n) {
  return new Intl.NumberFormat('ar-SA', { maximumFractionDigits: 0 }).format(n || 0) + ' ر.س';
}
export function pct(part, whole) {
  if (!whole) return 0;
  return Math.min(100, Math.round((part / whole) * 100));
}
export function num(n) {
  return new Intl.NumberFormat('ar-SA').format(n || 0);
}
// Demo projected annualized social-return rate per project category.
export const RETURN_RATE = 0.08;
export function projectedReturn(amount) {
  return Math.round(amount * RETURN_RATE);
}
// Demo: estimated beneficiaries impacted per 1000 SAR invested.
export function impactFromAmount(amount) {
  return Math.max(1, Math.round((amount / 1000) * 1.5));
}
