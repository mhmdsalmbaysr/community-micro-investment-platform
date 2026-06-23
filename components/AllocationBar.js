const palette = ['#1d4ed8', '#16a34a', '#f59e0b', '#8b5cf6', '#ef4444'];
export default function AllocationBar({ items }) {
  return (
    <div>
      <div className="flex h-3 w-full overflow-hidden rounded-full">
        {items.map((it, i) => (
          <div key={it.label} style={{ width: it.value + '%', background: palette[i % palette.length] }} />
        ))}
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
        {items.map((it, i) => (
          <li key={it.label} className="flex items-center gap-2">
            <span className="h-3 w-3 rounded" style={{ background: palette[i % palette.length] }} />
            <span className="text-gray-600">{it.label}</span>
            <span className="mr-auto font-semibold">{it.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
