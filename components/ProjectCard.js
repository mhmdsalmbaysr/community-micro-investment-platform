import Link from 'next/link';
import { statusLabels } from '@/lib/data';
import { fmt, pct } from '@/lib/format';

export default function ProjectCard({ p }) {
  const p2 = pct(p.fundedAmount, p.targetAmount);
  const s = statusLabels[p.status] || statusLabels.open;
  return (
    <div className="card group overflow-hidden transition hover:shadow-lift">
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.image} alt={p.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className={`chip absolute right-3 top-3 ${s.color} shadow-soft`}>{s.text}</span>
      </div>
      <div className="p-5">
        <div className="mb-2 flex items-center gap-2 text-xs text-gray-400">
          <span>{p.category}</span><span>•</span><span>{p.region}</span>
          {p.status === 'open' && <span className="mr-auto text-amber-600">باقٍ {p.daysLeft} يوم</span>}
        </div>
        <h3 className="mb-1 text-lg font-bold">{p.title}</h3>
        <p className="mb-4 text-sm muted line-clamp-2">{p.short}</p>
        <div className="mb-1 flex justify-between text-xs text-gray-500">
          <span className="font-semibold text-growth">{p2}% مموّل</span>
          <span>{fmt(p.fundedAmount)}</span>
        </div>
        <div className="progress mb-3"><span style={{ width: p2 + '%' }} /></div>
        <div className="mb-4 flex justify-between text-xs text-gray-500">
          <span>👥 {p.backers} داعم</span><span>الهدف {fmt(p.targetAmount)}</span>
        </div>
        <Link href={`/projects/${p.id}`} className="btn btn-primary w-full">عرض التفاصيل</Link>
      </div>
    </div>
  );
}
