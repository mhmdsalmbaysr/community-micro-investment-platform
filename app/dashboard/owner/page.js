'use client';
import { useState } from 'react';
import Guard from '@/components/Guard';
import StatCard from '@/components/StatCard';
import { useToast } from '@/components/Providers';
import { projects, statusLabels } from '@/lib/data';
import { fmt, pct } from '@/lib/format';

export default function Page() { return <Guard role="owner"><Owner /></Guard>; }

function Owner() {
  const { notify } = useToast();
  const [list, setList] = useState([
    { ...projects[0] },
    { ...projects[3], status: 'pending', title: 'مشروعي قيد المراجعة', fundedAmount: 0 },
  ]);
  const [form, setForm] = useState({ title: '', target: '', shares: '', desc: '' });

  function add(e) {
    e.preventDefault();
    if (!form.title || !form.target) { notify('أكمل اسم المشروع والهدف', 'info'); return; }
    setList([{ id: 'new_' + Date.now(), title: form.title, targetAmount: Number(form.target), fundedAmount: 0,
      totalShares: Number(form.shares) || 100, sharePrice: Math.round(Number(form.target) / (Number(form.shares) || 100)),
      status: 'pending', category: 'جديد' }, ...list]);
    setForm({ title: '', target: '', shares: '', desc: '' });
    notify('تم إرسال المشروع للمراجعة ✓');
  }

  return (
    <div className="container-x py-12">
      <h1 className="text-3xl font-extrabold tracking-tight">لوحة صاحب المشروع</h1>
      <p className="mt-1 muted">أضف مشاريعك وتابع حالة التمويل والمراجعة.</p>
      <div className="my-8 grid gap-4 sm:grid-cols-3">
        <StatCard icon="📁" label="مشاريعي" value={list.length} />
        <StatCard icon="⏳" label="قيد المراجعة" value={list.filter((p) => p.status === 'pending').length} accent="amber" />
        <StatCard icon="💰" label="إجمالي التمويل" value={fmt(list.reduce((s, p) => s + (p.fundedAmount || 0), 0))} accent="growth" />
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <form onSubmit={add} className="card space-y-4 p-6">
          <h2 className="font-bold">إضافة مشروع جديد</h2>
          <div><label className="label">اسم المشروع</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" /></div>
          <div><label className="label">الهدف المالي (ر.س)</label><input type="number" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} className="input" /></div>
          <div><label className="label">عدد الأسهم</label><input type="number" value={form.shares} onChange={(e) => setForm({ ...form, shares: e.target.value })} className="input" /></div>
          <div><label className="label">وصف المشروع</label><textarea rows={3} value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} className="input" /></div>
          <button className="btn btn-primary w-full">إرسال للمراجعة</button>
        </form>
        <div className="space-y-4 lg:col-span-2">
          {list.map((p) => {
            const p2 = p.targetAmount ? pct(p.fundedAmount || 0, p.targetAmount) : 0;
            const s = statusLabels[p.status] || statusLabels.open;
            return (
              <div key={p.id} className="card p-5">
                <div className="mb-2 flex items-center justify-between"><h3 className="font-bold">{p.title}</h3><span className={`chip ${s.color}`}>{s.text}</span></div>
                <div className="progress mb-2"><span style={{ width: p2 + '%' }} /></div>
                <div className="flex justify-between text-sm muted"><span>{p2}% مموّل</span><span>الهدف {fmt(p.targetAmount)}</span></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
