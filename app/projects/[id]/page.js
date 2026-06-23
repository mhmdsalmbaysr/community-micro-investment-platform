import { notFound } from 'next/navigation';
import { getProject, projects, statusLabels } from '@/lib/data';
import { fmt, pct, num } from '@/lib/format';
import InvestBox from '@/components/InvestBox';
import AllocationBar from '@/components/AllocationBar';

export function generateStaticParams() { return projects.map((p) => ({ id: p.id })); }

export default function ProjectDetails({ params }) {
  const p = getProject(params.id);
  if (!p) return notFound();
  const p2 = pct(p.fundedAmount, p.targetAmount);
  const s = statusLabels[p.status];
  return (
    <div className="container-x grid gap-8 py-12 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="overflow-hidden rounded-xl2 shadow-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.image} alt={p.title} className="aspect-video w-full object-cover" />
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className={`chip ${s.color}`}>{s.text}</span>
          <span className="chip bg-gray-100 text-gray-600">{p.category}</span>
          <span className="chip bg-gray-100 text-gray-600">📍 {p.region}</span>
          <span className="chip bg-amber-50 text-amber-700">مخاطرة: {p.riskLevel}</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight">{p.title}</h1>
        <p className="mt-4 leading-relaxed muted">{p.description}</p>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <Mini label="مستفيدون" value={p.beneficiaries} />
          <Mini label="فرص عمل" value={p.jobs} />
          <Mini label="داعمون" value={num(p.backers)} />
        </div>

        <div className="mt-8 card p-6">
          <h2 className="mb-4 font-bold">أوجه صرف التمويل (شفافية)</h2>
          <AllocationBar items={p.useOfFunds} />
        </div>

        <div className="mt-6 card p-6">
          <h2 className="mb-4 font-bold">مراحل المشروع</h2>
          <ol className="space-y-3">
            {p.milestones.map((m, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className={`grid h-6 w-6 place-items-center rounded-full text-xs ${m.done ? 'bg-growth text-white' : 'border border-gray-300 text-gray-400'}`}>{m.done ? '✓' : i + 1}</span>
                <span className={m.done ? 'font-medium' : 'muted'}>{m.t}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-6 card p-6">
          <h2 className="mb-2 font-bold">صاحب المشروع</h2>
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-trust-50 font-bold text-trust">{p.owner[0]}</div>
            <div><p className="font-semibold">{p.owner}</p><p className="text-sm muted">{p.ownerBio}</p></div>
          </div>
        </div>

        <p className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
          <b>إفصاح المخاطر:</b> الاستثمار في المشاريع الناشئة ينطوي على مخاطر. الأرقام هنا تجريبية لأغراض العرض فقط ولا تمثل عرضاً مالياً.
        </p>
      </div>

      <aside className="lg:col-span-1">
        <div className="sticky top-20 card p-6">
          <div className="mb-1 flex justify-between text-sm"><span className="font-semibold text-growth">{p2}% مموّل</span>{p.status === 'open' && <span className="text-amber-600">باقٍ {p.daysLeft} يوم</span>}</div>
          <div className="progress mb-4"><span style={{ width: p2 + '%' }} /></div>
          <dl className="space-y-3 text-sm">
            <Row k="الهدف المالي" v={fmt(p.targetAmount)} />
            <Row k="المبلغ المموّل" v={fmt(p.fundedAmount)} green />
            <Row k="عدد الأسهم" v={num(p.totalShares)} />
            <Row k="سعر السهم" v={fmt(p.sharePrice)} />
          </dl>
          <InvestBox project={p} />
        </div>
      </aside>
    </div>
  );
}

function Row({ k, v, green }) {
  return <div className="flex justify-between border-b border-gray-100 pb-2"><dt className="muted">{k}</dt><dd className={`font-semibold ${green ? 'text-growth' : ''}`}>{v}</dd></div>;
}
function Mini({ label, value }) {
  return <div className="card p-4 text-center"><p className="text-xl font-extrabold text-trust">{value}</p><p className="text-xs muted">{label}</p></div>;
}
