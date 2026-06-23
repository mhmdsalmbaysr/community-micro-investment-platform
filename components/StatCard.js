const accents = { trust: 'text-trust', growth: 'text-growth', amber: 'text-amber-600' };
export default function StatCard({ label, value, sub, accent = 'trust', icon }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2">
        {icon && <span className="text-lg">{icon}</span>}
        <p className="text-sm muted">{label}</p>
      </div>
      <p className={`mt-2 text-2xl font-extrabold ${accents[accent] || accents.trust}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
    </div>
  );
}
