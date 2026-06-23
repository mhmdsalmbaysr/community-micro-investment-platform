'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getInvestments, fmt } from '@/lib/store';
import StatCard from '@/components/StatCard';

export default function InvestorDashboard() {
  const [inv, setInv] = useState([]);
  useEffect(() => setInv(getInvestments()), []);
  const total = inv.reduce((s, i) => s + i.amount, 0);
  const shares = inv.reduce((s, i) => s + i.shares, 0);
  const projectsCount = new Set(inv.map((i) => i.projectId)).size;
  const expectedReturn = Math.round(total * 0.08);

  return (
    <div className="container-x py-12">
      <h1 className="text-3xl font-bold">لوحة المستثمر</h1>
      <p className="mt-1 text-gray-500">متابعة استثماراتك التجريبية وعائدها الافتراضي.</p>

      <div className="my-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="إجمالي الاستثمار" value={fmt(total)} />
        <StatCard label="عدد الأسهم" value={shares.toLocaleString('ar-SA')} accent="growth" />
        <StatCard label="مشاريع مدعومة" value={projectsCount} />
        <StatCard label="العائد الافتراضي (8%)" value={fmt(expectedReturn)} accent="growth" />
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-gray-100 p-5 font-bold">سجل الاستثمار التجريبي</div>
        {inv.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            لم تستثمر بعد. <Link href="/projects" className="text-trust">استعرض المشاريع</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr><Th>المشروع</Th><Th>الأسهم</Th><Th>المبلغ</Th><Th>التاريخ</Th></tr>
              </thead>
              <tbody>
                {inv.map((i) => (
                  <tr key={i.id} className="border-t border-gray-100">
                    <Td>{i.projectTitle}</Td><Td>{i.shares}</Td><Td className="font-semibold text-growth">{fmt(i.amount)}</Td>
                    <Td className="text-gray-400">{new Date(i.date).toLocaleDateString('ar-SA')}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-8 card p-5">
        <h2 className="mb-3 font-bold">إشعارات المشاريع</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• مخبز الحي التعاوني: وصل التمويل إلى 65%.</li>
          <li>• مزرعة الخضار العمودية: اكتمل التمويل 🎉.</li>
          <li>• مركز تدريب الشباب: تم نشر تحديث جديد.</li>
        </ul>
      </div>
    </div>
  );
}
const Th = ({ children }) => <th className="px-4 py-3 text-right font-medium">{children}</th>;
const Td = ({ children, className = '' }) => <td className={`px-4 py-3 ${className}`}>{children}</td>;
