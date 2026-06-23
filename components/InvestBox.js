'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInvestments, useAuth, useToast } from '@/components/Providers';
import { fmt, pct, projectedReturn, impactFromAmount } from '@/lib/format';

const presets = [1, 5, 10, 25];

export default function InvestBox({ project }) {
  const [shares, setShares] = useState(5);
  const { invest } = useInvestments();
  const { user } = useAuth();
  const { notify } = useToast();
  const router = useRouter();
  const amount = shares * project.sharePrice;
  const ownership = ((shares / project.totalShares) * 100).toFixed(2);

  function go() {
    if (!user) { router.push('/login'); return; }
    invest({ projectId: project.id, projectTitle: project.title, shares, amount, sharePrice: project.sharePrice });
    notify('تم تسجيل استثمارك التجريبي بنجاح ✓');
    setTimeout(() => router.push('/dashboard/investor'), 900);
  }

  if (project.status === 'completed')
    return <p className="mt-5 rounded-xl bg-trust-50 p-3 text-center text-sm font-medium text-trust">اكتمل تمويل هذا المشروع 🎉</p>;

  return (
    <div className="mt-5 border-t border-gray-100 pt-5">
      <p className="label">حاسبة الأسهم</p>
      <div className="mb-3 flex gap-2">
        {presets.map((n) => (
          <button key={n} onClick={() => setShares(n)}
            className={`flex-1 rounded-lg border px-2 py-1.5 text-sm font-medium ${shares === n ? 'border-trust bg-trust text-white' : 'border-gray-300 text-gray-600'}`}>{n}</button>
        ))}
      </div>
      <input type="number" min={1} value={shares} onChange={(e) => setShares(Math.max(1, Number(e.target.value)))} className="input mb-3" />
      <dl className="mb-4 space-y-2 rounded-xl bg-gray-50 p-3 text-sm">
        <div className="flex justify-between"><dt className="muted">إجمالي الاستثمار</dt><dd className="font-bold text-trust">{fmt(amount)}</dd></div>
        <div className="flex justify-between"><dt className="muted">نسبة الملكية</dt><dd className="font-semibold">{ownership}%</dd></div>
        <div className="flex justify-between"><dt className="muted">العائد الافتراضي/سنة (8%)</dt><dd className="font-semibold text-growth">{fmt(projectedReturn(amount))}</dd></div>
        <div className="flex justify-between"><dt className="muted">أثر اجتماعي تقديري</dt><dd className="font-semibold">~{impactFromAmount(amount)} مستفيد</dd></div>
      </dl>
      <button onClick={go} className="btn btn-green w-full">{user ? 'استثمار تجريبي' : 'سجّل الدخول للاستثمار'}</button>
      <p className="mt-2 text-center text-xs text-gray-400">⚠️ محاكاة فقط — لا يوجد دفع حقيقي</p>
    </div>
  );
}
