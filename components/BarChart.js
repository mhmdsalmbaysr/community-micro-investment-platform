export default function BarChart({ data, color = '#1d4ed8' }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex h-40 items-end gap-3">
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex w-full items-end justify-center" style={{ height: '100%' }}>
            <div className="w-full max-w-[36px] rounded-t-lg" style={{ height: (d.value / max) * 100 + '%', background: color, minHeight: 4 }} />
          </div>
          <span className="text-xs text-gray-500">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
