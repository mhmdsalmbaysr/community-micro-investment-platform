import Link from 'next/link';
import { stats } from '@/lib/data';
import { fmt, num } from '@/lib/format';

const model = [
  { t: 'بأسهم صغيرة في المتناول', d: 'تبدأ المساهمة من 100 ر.س، ما يوسّع قاعدة الداعمين.' },
  { t: 'رسوم منصة شفافة', d: 'نموذج إيراد مقترح: رسوم تشغيل بسيطة على المشاريع المموّلة.' },
  { t: 'قياس أثر معياري', d: 'كل ريال يُربط بمؤشرات أثر (مستفيدون، وظائف، استدامة).' },
];
const traction = [
  { k: `+${num(stats.totalInvestors)}`, t: 'مستخدم مهتم (تجريبي)' },
  { k: fmt(stats.totalFunding), t: 'تمويل تجريبي محاكى' },
  { k: `${stats.activeProjects}`, t: 'مشاريع نشطة' },
  { k: '85%', t: 'تخدم فئات هشة' },
];
const roadmap = [
  { ph: 'المرحلة 1', t: 'MVP وإثبات الجدوى', d: 'النسخة الحالية: عرض النموذج للجهات المانحة.' },
  { ph: 'المرحلة 2', t: 'الامتثال والبنية المالية', d: 'مصادقة، KYC، بوابة دفع، وقاعدة بيانات.' },
  { ph: 'المرحلة 3', t: 'الإطلاق التجريبي', d: 'مشاريع حقيقية محدودة مع شركاء.' },
  { ph: 'المرحلة 4', t: 'التوسّع', d: 'تغطية إقليمية وتطبيق موبايل.' },
];

export default function ForDonors() {
  return (
    <div className="container-x py-12">
      <div className="mx-auto max-w-3xl text-center">
        <span className="chip bg-trust-50 text-trust">عرض للجهات المانحة</span>
        <h1 className="mt-4 section-title">لماذا يستحق هذا المشروع الدعم؟</h1>
        <p className="mt-4 text-lg muted">نموذج مجتمعي شفاف وقابل للقياس والتوسّع لتمكين المشاريع الصغيرة والفئات الهشة.</p>
      </div>

      <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {traction.map((x) => (<div key={x.t} className="card p-6 text-center"><p className="text-3xl font-extrabold text-growth">{x.k}</p><p className="mt-2 text-sm muted">{x.t}</p></div>))}
      </section>

      <section className="mt-12"><h2 className="section-title mb-6 text-center">نموذج العمل</h2>
        <div className="grid gap-6 md:grid-cols-3">{model.map((m) => (<div key={m.t} className="card p-6"><h3 className="font-bold text-trust">{m.t}</h3><p className="mt-2 text-sm muted">{m.d}</p></div>))}</div>
      </section>

      <section className="mt-12"><h2 className="section-title mb-6 text-center">خارطة الطريق</h2>
        <div className="grid gap-4 md:grid-cols-4">{roadmap.map((r) => (
          <div key={r.ph} className="card p-6"><span className="chip bg-gray-100 text-gray-600">{r.ph}</span><h3 className="mt-3 font-bold">{r.t}</h3><p className="mt-2 text-sm muted">{r.d}</p></div>))}
        </div>
      </section>

      <section className="mt-12 overflow-hidden rounded-xl2 bg-gradient-to-l from-growth to-growth-dark px-8 py-12 text-center text-white shadow-lift">
        <h2 className="text-3xl font-extrabold">لنبنِ الأثر معاً</h2>
        <p className="mx-auto mt-3 max-w-xl text-green-50">ندعو الجهات المانحة لدعم الانتقال من النموذج التجريبي إلى منصة وطنية فاعلة.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/projects" className="btn bg-white text-growth hover:bg-gray-100">استعرض المشاريع</Link>
          <a href="mailto:partners@cmip.demo" className="btn border border-white/40 text-white hover:bg-white/10">تواصل للشراكة</a>
        </div>
      </section>
    </div>
  );
}
