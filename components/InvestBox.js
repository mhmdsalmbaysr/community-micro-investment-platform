'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addInvestment, fmt } from '@/lib/store';

export default function InvestBox({ project }) {
  const [shares, setShares] = useState(1);
  const [done, setDone] = useState(false);
  const router = useRouter();
  const amount = shares * project.sharePrice;

  function invest() {
    addInvestment({
      projectId: project.id,
      projectTitle: project.title,
      shares,
      amount,
      sharePrice: project.sharePrice,
    });
    setDone(true);
    setTimeout(() => router.push('/dashboard/investor'), 1200);
  }

  if (project.status === 'completed') {
    return <p className="mt-5 rounded-lg bg-trust/10 p-3 text-center text-sm text-trust">اكتمل تمويل هذا المشروع 🎉</p>;
  }
  if (done) {
    return <p className="mt-5 rounded-lg bg-growth/10 p-3 text-center text-sm font-semibold text-growth">تم تسجيل استثمارك التجريبي ✓ — جارٍ التحويل للوحتك...</p>;
  }
  return (
    <div className="mt-5">
      <label className="mb-1 block text-sm text-gray-500">عدد الأسهم</label>
      <input type="number" min={1} value={shares}
        onChange={(e) => setShares(Math.max(1, Number(e.target.value)))}
        className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-trust focus:outline-none" />
      <div className="mb-3 flex justify-between text-sm"><span className="text-gray-500">الإجمالي</span><span className="font-bold text-trust">{fmt(amount)}</span></div>
      <button onClick={invest} className="btn btn-green w-full">استثمار تجريبي</button>
      <p className="mt-2 text-center text-xs text-gray-400">⚠️ محاكاة فقط — بدون دفع حقيقي</p>
    </div>
  );
}
