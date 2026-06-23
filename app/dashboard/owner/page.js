'use client';
import { useState } from 'react';
import { projects, statusLabels } from '@/lib/data';
import StatCard from '@/components/StatCard';
import { fmt } from '@/lib/store';

export default function OwnerDashboard() {
  const [list, setList] = useState([
    { ...projects[0] },
    { ...projects[3], status: 'pending', title: 'مشروعي قيد المراجعة' },
  ]);
  const [form, setForm] = useState({ title: '', target: '', shares: '', desc: '' });
  const [msg, setMsg] = useState('');

  function add(e) {
    e.preventDefault();
    if (!form.title || !form.target) return;
    setList([
      { id: 'new_' + Date.now(), title: form.title, targetAmount: Number(form.target), fundedAmount: 0,
        totalShares: Number(form.shares) || 100, sharePrice: Math.round(Number(form.target) / (Number(form.shares) || 100)),
        status: 'pending', category: 'جديد' },
      ...list,
    ]);
    setForm({ title: '', target: '', shares: '', desc: '' });
    setMsg('تم إرسال المشروع للمراجعة من قبل الإدارة ✓');
    setTimeout(() => setMsg(''), 3000);
  }

  return (
    <div className="container-x py-12">
      <h1 className="text-3xl font-bold">لوحة صاحب المشروع</h1>
      <p className="mt-1 text-gray-500">أضف مشاريعك وتابع حالة التمويل والمراجعة.</p>

      <div className="my-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="مشاريعي" value={list.length} />
        <StatCard label="قيد المراجعة" value={list.filter((p) => p.status === 'pending').length} accent="amber" />
        <StatCard label="إجمالي التمويل" value={fmt(list.reduce((s, p) => s + (p.fundedAmount || 0), 0))} accent="growth" />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <form onSubmit={add} className="card space-y-4 p-6 lg:col-span-1">
          <h2 className="font-bold">إضافة مشروع جديد</h2>
          {msg && <p className="rounded-lg bg-growth/10 p-2 text-sm text-growth">{msg}</p>}
          <input placeholder="اسم المشروع" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          <input type="number" placeholder="الهدف المالي (ر.س)" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          <input type="number" placeholder="عدد الأسهم" value={form.shares} onChange={(e) => setForm({ ...form, shares: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          <textarea placeholder="وصف المشروع" rows={3} value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          <button className="btn btn-primary w-full">إرسال للمراجعة</button>
        </form>

        <div className="space-y-4 lg:col-span-2">
          {list.map((p) => {
            const pct = p.targetAmount ? Math.min(100, Math.round(((p.fundedAmount || 0) / p.targetAmount) * 100)) : 0;
            const s = statusLabels[p.status] || statusLabels.open;
            return (
              <div key={p.id} className="card p-5">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-bold">{p.title}</h3>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${s.color}`}>{s.text}</span>
                </div>
                <div className="progress mb-2"><span style={{ width: pct + '%' }} /></div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{pct}% مموّل</span><span>الهدف {fmt(p.targetAmount)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
