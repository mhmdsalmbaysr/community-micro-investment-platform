'use client';
import { useState } from 'react';
import Guard from '@/components/Guard';
import StatCard from '@/components/StatCard';
import BarChart from '@/components/BarChart';
import { useToast } from '@/components/Providers';
import { projects, users, stats, statusLabels } from '@/lib/data';
import { fmt, num } from '@/lib/format';

export default function Page() { return <Guard role="admin"><Admin /></Guard>; }

function Admin() {
  const { notify } = useToast();
  const [items, setItems] = useState([
    ...projects.map((p) => ({ ...p })),
    { id: 'pend1', title: 'مشروع مقهى مجتمعي', owner: 'خالد', status: 'pending', targetAmount: 60000, fundedAmount: 0, category: 'أغذية' },
    { id: 'pend2', title: 'مشغل خياطة', owner: 'سارة', status: 'pending', targetAmount: 45000, fundedAmount: 0, category: 'حرف' },
  ]);
  const [tab, setTab] = useState('pending');
  const setStatus = (id, status, msg) => { setItems(items.map((p) => (p.id === id ? { ...p, status } : p))); notify(msg); };
  const remove = (id, msg) => { setItems(items.filter((p) => p.id !== id)); notify(msg, 'info'); };
  const pending = items.filter((p) => p.status === 'pending');
  const fundingByCat = Object.values(items.reduce((a, p) => {
    a[p.category] = a[p.category] || { label: p.category, value: 0 };
    a[p.category].value += p.fundedAmount || 0; return a;
  }, {}));

  return (
    <div className="container-x py-12">
      <h1 className="text-3xl font-extrabold tracking-tight">لوحة الإدارة</h1>
      <p className="mt-1 muted">مراجعة المشاريع، إدارة المستخدمين، ومتابعة مؤشرات الأداء.</p>

      <div className="my-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="📦" label="عدد المشاريع" value={items.length} />
        <StatCard icon="👥" label="المستثمرون" value={num(stats.totalInvestors)} accent="growth" />
        <StatCard icon="💰" label="إجمالي التمويل" value={fmt(stats.totalFunding)} />
        <StatCard icon="⏳" label="قيد المراجعة" value={pending.length} accent="amber" />
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-6"><h2 className="mb-4 font-bold">التمويل حسب القطاع</h2><BarChart data={fundingByCat} /></div>
        <div className="card p-6"><h2 className="mb-4 font-bold">الأثر الإجمالي</h2>
          <div className="grid grid-cols-2 gap-4">
            <Mini n={num(stats.beneficiaries)} t="مستفيد مباشر" />
            <Mini n={num(stats.jobs)} t="فرصة عمل" />
            <Mini n={stats.activeProjects} t="مشروع نشط" />
            <Mini n="85%" t="تخدم فئات هشة" />
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {[['pending', 'طلبات المراجعة'], ['projects', 'المشاريع'], ['users', 'المستخدمون']].map(([k, t]) => (
          <button key={k} onClick={() => setTab(k)} className={`rounded-xl px-4 py-2 text-sm font-medium ${tab === k ? 'bg-trust text-white' : 'border border-gray-300 text-gray-600'}`}>
            {t}{k === 'pending' && pending.length ? ` (${pending.length})` : ''}
          </button>
        ))}
      </div>

      {tab === 'pending' && (
        <div className="card overflow-hidden">
          {pending.length === 0 ? <p className="p-10 text-center muted">لا توجد طلبات قيد المراجعة.</p> : pending.map((p) => (
            <div key={p.id} className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="font-bold">{p.title}</p><p className="text-sm muted">{p.owner} • الهدف {fmt(p.targetAmount)}</p></div>
              <div className="flex gap-2">
                <button onClick={() => setStatus(p.id, 'open', 'تم اعتماد المشروع ونشره ✓')} className="btn btn-green px-4 py-2">قبول ونشر</button>
                <button onClick={() => remove(p.id, 'تم رفض المشروع')} className="btn btn-ghost px-4 py-2 text-red-600">رفض</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'projects' && (
        <div className="card overflow-x-auto"><table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500"><tr><Th>المشروع</Th><Th>الحالة</Th><Th>التمويل</Th><Th>إجراء</Th></tr></thead>
          <tbody>{items.map((p) => { const s = statusLabels[p.status] || statusLabels.open; return (
            <tr key={p.id} className="border-t border-gray-100"><Td className="font-medium">{p.title}</Td>
              <Td><span className={`chip ${s.color}`}>{s.text}</span></Td><Td>{fmt(p.fundedAmount || 0)}</Td>
              <Td><button onClick={() => remove(p.id, 'تم حذف المشروع')} className="text-red-600 hover:underline">حذف</button></Td></tr>); })}
          </tbody></table></div>
      )}

      {tab === 'users' && (
        <div className="card overflow-x-auto"><table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500"><tr><Th>الاسم</Th><Th>البريد</Th><Th>الدور</Th><Th>انضم</Th></tr></thead>
          <tbody>{users.map((u) => (<tr key={u.id} className="border-t border-gray-100"><Td className="font-medium">{u.name}</Td><Td className="text-gray-500">{u.email}</Td><Td>{u.role}</Td><Td className="text-gray-400">{u.joined}</Td></tr>))}</tbody>
        </table></div>
      )}
    </div>
  );
}
const Th = ({ children }) => <th className="px-4 py-3 text-right font-medium">{children}</th>;
const Td = ({ children, className = '' }) => <td className={`px-4 py-3 ${className}`}>{children}</td>;
const Mini = ({ n, t }) => <div className="rounded-xl bg-gray-50 p-4 text-center"><p className="text-2xl font-extrabold text-trust">{n}</p><p className="text-xs muted">{t}</p></div>;
