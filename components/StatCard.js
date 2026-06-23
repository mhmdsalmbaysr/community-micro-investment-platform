const accents = { trust: 'text-trust', growth: 'text-growth', amber: 'text-amber-600' };
export default function StatCard({ label, value, accent = 'trust' }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${accents[accent] || accents.trust}`}>{value}</p>
    </div>
  );
}
