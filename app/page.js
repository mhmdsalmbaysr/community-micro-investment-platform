import Link from 'next/link';
import { stats, projects } from '@/lib/data';
import ProjectCard from '@/components/ProjectCard';
import { fmt, num } from '@/lib/format';

const steps = [
  { n: '1', t: 'سجّل حسابك', d: 'كمستثمر أو صاحب مشروع خلال دقيقة.' },
  { n: '2', t: 'تصفّح المشاريع', d: 'مشاريع معتمدة بشفافية كاملة في الأثر والتمويل.' },
  { n: '3', t: 'استثمر تجريبياً', d: 'اختر عدد الأسهم وتابع نسبة ملكيتك.' },
  { n: '4', t: 'تابع الأثر', d: 'لوحة حية للعائد الافتراضي والأثر الاجتماعي.' },
];
const problems = ['صعوبة وصول أصحاب المشاريع الصغيرة للتمويل', 'غياب قنوات شفافة لدعم الفئات الهشة', 'محدودية أدوات قياس الأثر الاجتماعي'];
const solutions = ['تمويل جماعي مجتمعي بأسهم صغيرة في المتناول', 'شفافية كاملة في أوجه صرف التمويل والأثر', 'لوحات متابعة حية لكل الأطراف'];
const faqs = [
  { q: 'هل هذه منصة استثمار حقيقية؟', a: 'لا، هذه نسخة تجريبية (MVP) لإثبات الجدوى — كل العمليات محاكاة بدون تحويلات مالية حقيقية.' },
  { q: 'كيف يتحقق العائد؟', a: 'في النموذج المقترح، يُوزَّع عائد افتراضي مرتبط بأداء المشروع والأثر الاجتماعي المحقَّق.' },
  { q: 'كيف تُضمن الشفافية؟', a: 'كل مشروع يعرض أوجه صرف التمويل، المراحل، والأثر المتوقع، مع مراجعة إدارية قبل النشر.' },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-trust-50 via-white to-white">
        <div className="container-x grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div className="animate-fadeUp">
            <span className="chip bg-growth-50 text-growth">نسخة تجريبية · Proof of Concept</span>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl">
              استثمار مجتمعي يصنع <span className="text-trust">أثراً</span> حقيقياً و<span className="text-growth">نمواً</span> مستداماً
            </h1>
            <p className="mt-4 text-lg muted">
              منصة تتيح للأفراد المساهمة بمبالغ صغيرة في مشاريع الفئات الهشة والمشاريع الصغيرة، بشفافية كاملة وقياس واضح للأثر الاجتماعي.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/projects" className="btn btn-primary">استعرض المشاريع</Link>
              <Link href="/for-donors" className="btn btn-ghost">عرض للجهات المانحة</Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm muted">
              <span>✓ شفافية كاملة</span><span>✓ أثر قابل للقياس</span><span>✓ قابل للتوسّع</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <HeroStat label="مشاريع نشطة" value={stats.activeProjects} />
            <HeroStat label="مستثمرون" value={num(stats.totalInvestors)} />
            <HeroStat label="مستفيدون" value={`+${num(stats.beneficiaries * 60)}`} />
            <HeroStat label="فرص عمل" value={`+${num(stats.jobs * 25)}`} />
            <div className="col-span-2 card bg-trust p-5 text-white">
              <p className="text-sm text-blue-100">إجمالي التمويل (تجريبي)</p>
              <p className="mt-1 text-3xl font-extrabold">{fmt(stats.totalFunding)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x grid gap-6 py-16 md:grid-cols-2">
        <div className="card p-6"><h2 className="mb-4 text-xl font-bold text-red-600">التحدّي</h2>
          <ul className="space-y-3">{problems.map((p) => <li key={p} className="flex gap-2 muted"><span className="text-red-400">•</span>{p}</li>)}</ul></div>
        <div className="card p-6"><h2 className="mb-4 text-xl font-bold text-growth">حلّنا</h2>
          <ul className="space-y-3">{solutions.map((p) => <li key={p} className="flex gap-2 muted"><span className="text-growth">✓</span>{p}</li>)}</ul></div>
      </section>

      <section className="bg-white py-16"><div className="container-x">
        <h2 className="section-title mb-10 text-center">كيف تعمل المنصة؟</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="card p-6 text-center transition hover:shadow-lift">
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-trust to-trust-light text-lg font-bold text-white">{s.n}</div>
              <h3 className="mb-1 font-bold">{s.t}</h3><p className="text-sm muted">{s.d}</p>
            </div>
          ))}
        </div>
      </div></section>

      <section className="container-x py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="section-title">مشاريع مميزة</h2>
          <Link href="/projects" className="text-sm font-semibold text-trust hover:underline">عرض الكل ←</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{projects.slice(0, 3).map((p) => <ProjectCard key={p.id} p={p} />)}</div>
      </section>

      <section className="bg-growth-50 py-16"><div className="container-x">
        <h2 className="section-title mb-10 text-center">أثرٌ نقيسه، لا نعِدُ به فقط</h2>
        <div className="grid gap-6 text-center sm:grid-cols-3">
          <Impact n={`+${num(stats.beneficiaries * 60)}`} t="أسرة مستفيدة" />
          <Impact n="85%" t="من المشاريع تخدم فئات هشة" />
          <Impact n={`+${num(stats.jobs * 25)}`} t="فرصة عمل" />
        </div>
      </div></section>

      <section className="container-x py-16">
        <h2 className="section-title mb-8 text-center">أسئلة شائعة</h2>
        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="card p-5 [&_summary]:cursor-pointer">
              <summary className="font-semibold">{f.q}</summary>
              <p className="mt-3 muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="container-x pb-20">
        <div className="overflow-hidden rounded-xl2 bg-gradient-to-l from-trust to-trust-dark px-8 py-12 text-center text-white shadow-lift">
          <h2 className="text-3xl font-extrabold">كن جزءاً من التغيير</h2>
          <p className="mx-auto mt-3 max-w-xl text-blue-100">انضم اليوم وادعم المشاريع المجتمعية، أو اعرض مشروعك على آلاف المستثمرين.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/projects" className="btn bg-white text-trust hover:bg-gray-100">ابدأ الاستثمار</Link>
            <Link href="/dashboard/owner" className="btn btn-green">أضف مشروعك</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function HeroStat({ label, value }) {
  return <div className="card p-5"><p className="text-sm muted">{label}</p><p className="mt-1 text-2xl font-extrabold text-trust">{value}</p></div>;
}
function Impact({ n, t }) {
  return <div><p className="text-4xl font-extrabold text-growth">{n}</p><p className="mt-2 muted">{t}</p></div>;
}
