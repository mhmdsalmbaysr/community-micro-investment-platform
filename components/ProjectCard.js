import Link from 'next/link';
import { statusLabels } from '@/lib/data';
import { fmt } from '@/lib/format';

export default function ProjectCard({ p }) {
  const pct = Math.min(100, Math.round((p.fundedAmount / p.targetAmount) * 100));
  const s = statusLabels[p.status] || statusLabels.open;
  return (
    <div className="card overflow-hidden">
      <div className="aspect-video w-full overflow-hidden bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
      </div>
      <div className="p-5">
        <div className="mb-2 flex items-center justify-between">
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${s.color}`}>{s.text}</span>
          <span className="text-xs text-gray-400">{p.category}</span>
        </div>
        <h3 className="mb-1 text-lg font-bold">{p.title}</h3>
        <p className="mb-4 text-sm text-gray-500 line-clamp-2">{p.short}</p>
        <div className="mb-1 flex justify-between text-xs text-gray-500">
          <span>{pct}% مموّل</span>
          <span>سعر السهم {fmt(p.sharePrice)}</span>
        </div>
        <div className="progress mb-4"><span style={{ width: pct + '%' }} /></div>
        <div className="mb-4 flex justify-between text-sm">
          <span className="text-gray-500">الهدف: {fmt(p.targetAmount)}</span>
          <span className="font-semibold text-growth">{fmt(p.fundedAmount)}</span>
        </div>
        <Link href={`/projects/${p.id}`} className="btn btn-primary w-full">عرض التفاصيل</Link>
      </div>
    </div>
  );
}
