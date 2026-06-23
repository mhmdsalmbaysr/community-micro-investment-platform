import Link from 'next/link';
import { stats, projects } from '@/lib/data';
import ProjectCard from '@/components/ProjectCard';
import { fmt } from '@/lib/format';

const steps = [
  { n: '1', t: 'سجّل حسابك', d: 'كمستثمر أو صاحب مشروع خلال دقيقة.' },
  { n: '2', t: 'تصفّح المشاريع', d: 'استعرض المشاريع المعتمدة وأثرها الاجتماعي.' },
  { n: '3', t: 'استثمر تجريبياً', d: 'اختر عدد الأسهم وادعم المشروع (محاكاة).' },
  { n: '4', t: 'تابع الأثر', d: 'راقب نسبة التمويل والعائد الافتراضي من لوحتك.' },
];
const problems = [
  'صعوبة وصول أصحاب المشاريع الصغيرة للتمويل',
  'غياب قنوات شفافة لدعم الفئات الهشة',
  'محدودية أدوات قياس الأثر الاجتماعي',
];
const solutions = [
  'منصة تمويل جماعي مجتمعي بأسهم صغيرة',
  'شفافية كاملة في عرض التمويل والأثر',
  'لوحات متابعة حية لكل الأطراف',
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-trust/5 to-transparent">
        <div className="container-x grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-block rounded-full bg-growth/10 px-3 py-1 text-sm font-medium text-growth">نسخة تجريبية — Proof of Concept</span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
              استثمار مجتمعي يصنع <span className="text-trust">أثراً</span> حقيقياً <span className="text-growth">للنمو</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              منصة تتيح للأفراد المساهمة بمبالغ صغيرة في مشاريع الفئات الهشة والمشاريع الصغيرة، بشفافية كاملة وقياس واضح للأثر الاجتماعي.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/projects" className="btn btn-primary">استعرض المشاريع</Link>
              <Link href="/login" className="btn btn-ghost">انضم للمنصة</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Stat label="مشاريع" value={stats.totalProjects} />
            <Stat label="مستثمرون" value={stats.totalInvestors.toLocaleString('ar-SA')} />
            <Stat label="إجمالي التمويل" value={fmt(stats.totalFunding)} wide />
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="container-x grid gap-6 py-16 md:grid-cols-2">
        <div className="card p-6">
          <h2 className="mb-4 text-xl font-bold text-red-600">المشكلة</h2>
          <ul className="space-y-3">{problems.map((p) => <li key={p} className="flex gap-2 text-gray-600"><span>•</span>{p}</li>)}</ul>
        </div>
        <div className="card p-6">
          <h2 className="mb-4 text-xl font-bold text-growth">الحل</h2>
          <ul className="space-y-3">{solutions.map((p) => <li key={p} className="flex gap-2 text-gray-600"><span className="text-growth">✓</span>{p}</li>)}</ul>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16">
        <div className="container-x">
          <h2 className="mb-10 text-center text-3xl font-bold">كيف تعمل المنصة؟</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} className="card p-6 text-center">
                <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-trust text-lg font-bold text-white">{s.n}</div>
                <h3 className="mb-1 font-bold">{s.t}</h3>
                <p className="text-sm text-gray-500">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured projects */}
      <section className="container-x py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold">مشاريع مميزة</h2>
          <Link href="/projects" className="text-sm font-semibold text-trust hover:underline">عرض الكل ←</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 3).map((p) => <ProjectCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* Impact */}
      <section className="bg-growth/5 py-16">
        <div className="container-x grid gap-6 text-center sm:grid-cols-3">
          <Impact n="+1,200" t="أسرة مستفيدة" />
          <Impact n="85%" t="من المشاريع تخدم فئات هشة" />
          <Impact n="+300" t="فرصة عمل افتراضية" />
        </div>
      </section>

      {/* Partners */}
      <section className="container-x py-16">
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-700">شركاؤنا</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {['شريك ١', 'شريك ٢', 'شريك ٣', 'شريك ٤'].map((p) => (
            <div key={p} className="grid h-20 place-items-center rounded-xl border border-dashed border-gray-300 text-gray-400">{p}</div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-x pb-20">
        <div className="rounded-3xl bg-trust px-8 py-12 text-center text-white">
          <h2 className="text-3xl font-bold">كن جزءاً من التغيير</h2>
          <p className="mx-auto mt-3 max-w-xl text-blue-100">انضم اليوم وادعم المشاريع المجتمعية، أو اعرض مشروعك على آلاف المستثمرين.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/projects" className="btn bg-white text-trust hover:bg-gray-100">ابدأ الاستثمار</Link>
            <Link href="/dashboard/owner" className="btn btn-green">أضف مشروعك</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ label, value, wide }) {
  return (
    <div className={`card p-5 ${wide ? 'col-span-2' : ''}`}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-trust">{value}</p>
    </div>
  );
}
function Impact({ n, t }) {
  return (<div><p className="text-4xl font-extrabold text-growth">{n}</p><p className="mt-2 text-gray-600">{t}</p></div>);
}
