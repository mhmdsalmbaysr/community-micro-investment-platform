'use client';
import Link from 'next/link';
import Guard from '@/components/Guard';
import StatCard from '@/components/StatCard';
import Donut from '@/components/Donut';
import { useInvestments } from '@/components/Providers';
import { fmt, num, projectedReturn, impactFromAmount } from '@/lib/format';

export default function Page() {
  return <Guard role="investor"><Dashboard /></Guard>;
}

function Dashboard() {
  const { investments } = useInvestments();
  const total = investments.reduce((s, i) => s + i.amount, 0);
  const shares = investments.reduce((s, i) => s + i.shares, 0);
  const projectsCount = new Set(investments.map((i) => i.projectId)).size;
  const diversification = Math.min(100, projectsCount * 25);

  return (
    <div className="container-x py-12">
      <h1 className="text-3xl font-extrabold tracking-tight">لوحة المستثمر</h1>
      <p className="mt-1 muted">متابعة محفظتك التجريبية وعائدها والأثر الاجتماعي.</p>

      <div className="my-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="💼" label="إجمالي الاستثمار" value={fmt(total)} />
        <StatCard icon="📈" label="العائد الافتراضي/سنة" value={fmt(projectedReturn(total))} accent="growth" />
        <StatCard icon="🎯" label="مشاريع مدعومة" value={projectsCount} sub={`${num(shares)} سهم`} />
        <StatCard icon="🌱" label="أثر تقديري" value={`~${num(impactFromAmount(total))}`} sub="مستفيد" accent="growth" />
      </div>

      {investments.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-4xl">📭</p>
          <p className="mt-3 font-semibold">لم تبدأ الاستثمار بعد</p>
          <p className="muted">ابدأ بدعم مشروع وشاهد محفظتك تنمو.</p>
          <Link href="/projects" className="btn btn-primary mt-5">استعرض المشاريع</Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="card flex flex-col items-center justify-center p-6">
            <h2 className="mb-4 font-bold">تنويع المحفظة</h2>
            <Donut value={diversification} label="تنويع" color="#1d4ed8" />
            <p className="mt-2 text-center text-xs muted">عبر {projectsCount} مشروع</p>
          </div>
          <div className="card overflow-hidden lg:col-span-2">
            <div className="border-b border-gray-100 p-5 font-bold">سجل الاستثمار التجريبي</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500"><tr><Th>المشروع</Th><Th>الأسهم</Th><Th>المبلغ</Th><Th>التاريخ</Th></tr></thead>
                <tbody>
                  {investments.map((i) => (
                    <tr key={i.id} className="border-t border-gray-100">
                      <Td className="font-medium">{i.projectTitle}</Td><Td>{i.shares}</Td>
                      <Td className="font-semibold text-growth">{fmt(i.amount)}</Td>
                      <Td className="text-gray-400">{new Date(i.date).toLocaleDateString('ar-SA')}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
const Th = ({ children }) => <th className="px-4 py-3 text-right font-medium">{children}</th>;
const Td = ({ children, className = '' }) => <td className={`px-4 py-3 ${className}`}>{children}</td>;
