'use client';
import Link from 'next/link';
import { useAuth } from '@/components/Providers';
import { roleLabels } from '@/lib/data';

export default function Guard({ role, children }) {
  const { user } = useAuth();
  if (!user) {
    return (
      <div className="container-x grid min-h-[55vh] place-items-center text-center">
        <div className="card max-w-md p-8">
          <h2 className="text-xl font-bold">يلزم تسجيل الدخول</h2>
          <p className="mt-2 muted">هذه اللوحة متاحة بعد الدخول بالدور المناسب.</p>
          <Link href="/login" className="btn btn-primary mt-5">تسجيل الدخول</Link>
        </div>
      </div>
    );
  }
  if (role && user.role !== role) {
    return (
      <div className="container-x grid min-h-[55vh] place-items-center text-center">
        <div className="card max-w-md p-8">
          <h2 className="text-xl font-bold">صلاحية غير كافية</h2>
          <p className="mt-2 muted">هذه اللوحة مخصصة لدور «{roleLabels[role]}». أنت داخل كـ«{roleLabels[user.role]}».</p>
          <Link href="/login" className="btn btn-ghost mt-5">تبديل الدور</Link>
        </div>
      </div>
    );
  }
  return children;
}
