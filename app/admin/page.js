'use client';
import { useState } from 'react';
import { projects, users, stats, statusLabels } from '@/lib/data';
import StatCard from '@/components/StatCard';
import { fmt } from '@/lib/store';

export default function Admin() {
  const [items, setItems] = useState([
    ...projects.map((p) => ({ ...p })),
    { id: 'pend1', title: 'مشروع مقهى مجتمعي', owner: 'خالد', status: 'pending', targetAmount: 60000, fundedAmount: 0, category: 'أغذية' },
    { id: 'pend2', title: 'مشغل خياطة', owner: 'سارة', status: 'pending', targetAmount: 45000, fundedAmount: 0, category: 'حرف' },
  ]);
  const [tab, setTab] = useState('projects');

  const setStatus = (id, status) => setItems(items.map((p) => (p.id === id ? { ...p, status } : p)));
  const remove = (id) => setItems(items.filter((p) => p.id !== id));
  const pending = items.filter((p) => p.status === 'pending');

  return (
    <div className="container-x py-12">
      <h1 className="text-3xl font-bold">لوحة الإدارة</h1>
      <p className="mt-1 text-gray-500">مراجعة المشاريع وإدارة المستخدمين ومتابعة الإحصائيات.</p>

      <div className="my-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="عدد المشاريع" value={items.length} />
        <StatCard label="عدد المستثمرين" value={stats.totalInvestors.toLocaleString('ar-SA')} accent="growth" />
        <StatCard label="إجمالي التمويل" value={fmt(stats.totalFunding)} />
        <StatCard label="قيد المراجعة" value={pending.length} accent="amber" />
      </div>

      <div className="mb-6 flex gap-2">
        {[['projects', 'المشاريع'], ['pending', 'طلبات المراجعة'], ['users', 'المستخدمون']].map(([k, t]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${tab === k ? 'bg-trust text-white' : 'border border-gray-300 text-gray-600'}`}>
            {t}{k === 'pending' && pending.length ? ` (${pending.length})` : ''}
          </button>
        ))}
      </div>

      {tab === 'pending' && (
        <div className="card overflow-hidden">
          {pending.length === 0 ? <p className="p-10 text-center text-gray-500">لا توجد طلبات قيد المراجعة.</p> : pending.map((p) => (
            <div key={p.id} className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="font-bold">{p.title}</p><p className="text-sm text-gray-500">{p.owner} • الهدف {fmt(p.targetAmount)}</p></div>
              <div className="flex gap-2">
                <button onClick={() => setStatus(p.id, 'open')} className="btn btn-green px-4 py-2">قبول ونشر</button>
                <button onClick={() => remove(p.id)} className="btn btn-ghost px-4 py-2 text-red-600">رفض</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'projects' && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500"><tr><Th>المشروع</Th><Th>الحالة</Th><Th>التمويل</Th><Th>إجراء</Th></tr></thead>
            <tbody>
              {items.map((p) => {
                const s = statusLabels[p.status] || statusLabels.open;
                return (
                  <tr key={p.id} className="border-t border-gray-100">
                    <Td className="font-medium">{p.title}</Td>
                    <Td><span className={`rounded-full px-2 py-0.5 text-xs ${s.color}`}>{s.text}</span></Td>
                    <Td>{fmt(p.fundedAmount || 0)}</Td>
                    <Td><button onClick={() => remove(p.id)} className="text-red-600 hover:underline">حذف</button></Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'users' && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500"><tr><Th>الاسم</Th><Th>البريد</Th><Th>الدور</Th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-gray-100"><Td className="font-medium">{u.name}</Td><Td className="text-gray-500">{u.email}</Td><Td>{u.role}</Td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
const Th = ({ children }) => <th className="px-4 py-3 text-right font-medium">{children}</th>;
const Td = ({ children, className = '' }) => <td className={`px-4 py-3 ${className}`}>{children}</td>;
