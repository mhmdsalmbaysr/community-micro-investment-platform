export default function Donut({ value, size = 120, stroke = 12, color = '#16a34a', label }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (Math.min(100, value) / 100) * c;
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" style={{ transition: 'stroke-dashoffset .8s ease' }} />
      </svg>
      <div className="-mt-[75%] mb-[35%] text-center">
        <p className="text-xl font-extrabold">{value}%</p>
        {label && <p className="text-xs text-gray-500">{label}</p>}
      </div>
    </div>
  );
}
