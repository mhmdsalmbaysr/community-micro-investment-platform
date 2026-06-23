import { notFound } from 'next/navigation';
import { getProject, projects, statusLabels } from '@/lib/data';
import InvestBox from '@/components/InvestBox';

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export default function ProjectDetails({ params }) {
  const p = getProject(params.id);
  if (!p) return notFound();
  const pct = Math.min(100, Math.round((p.fundedAmount / p.targetAmount) * 100));
  const s = statusLabels[p.status];
  return (
    <div className="container-x grid gap-8 py-12 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.image} alt={p.title} className="aspect-video w-full object-cover" />
        </div>
        <div className="mt-6 flex items-center gap-3">
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${s.color}`}>{s.text}</span>
          <span className="text-sm text-gray-400">{p.category}</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold">{p.title}</h1>
        <p className="mt-4 leading-relaxed text-gray-600">{p.description}</p>

        <div className="mt-8 card p-6">
          <h2 className="mb-2 font-bold">صاحب المشروع</h2>
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-trust/10 font-bold text-trust">{p.owner[0]}</div>
            <div>
              <p className="font-semibold">{p.owner}</p>
              <p className="text-sm text-gray-500">{p.ownerBio}</p>
            </div>
          </div>
        </div>
      </div>

      <aside className="lg:col-span-1">
        <div className="sticky top-20 card p-6">
          <div className="mb-1 flex justify-between text-sm text-gray-500"><span>{pct}% مموّل</span></div>
          <div className="progress mb-4"><span style={{ width: pct + '%' }} /></div>
          <dl className="space-y-3 text-sm">
            <Row k="الهدف المالي" v={p.targetAmount} />
            <Row k="المبلغ المموّل" v={p.fundedAmount} green />
            <Row k="عدد الأسهم" v={p.totalShares} plain />
            <Row k="سعر السهم" v={p.sharePrice} />
          </dl>
          <InvestBox project={p} />
        </div>
      </aside>
    </div>
  );
}

function Row({ k, v, green, plain }) {
  const val = plain ? v.toLocaleString('ar-SA') : new Intl.NumberFormat('ar-SA').format(v) + ' ر.س';
  return (
    <div className="flex justify-between border-b border-gray-100 pb-2">
      <dt className="text-gray-500">{k}</dt>
      <dd className={`font-semibold ${green ? 'text-growth' : ''}`}>{val}</dd>
    </div>
  );
}
