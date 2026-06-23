export function fmt(n) {
  return new Intl.NumberFormat('ar-SA').format(n) + ' \u0631.\u0633';
}
