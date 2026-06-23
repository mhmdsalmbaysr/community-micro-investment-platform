'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const roles = [
  { k: 'investor', t: 'مستثمر', href: '/dashboard/investor' },
  { k: 'owner', t: 'صاحب مشروع', href: '/dashboard/owner' },
  { k: 'admin', t: 'إدارة', href: '/admin' },
];

export default function Login() {
  const [role, setRole] = useState('investor');
  const router = useRouter();
  function submit(e) {
    e.preventDefault();
    router.push(roles.find((r) => r.k === role).href);
  }
  return (
    <div className="container-x grid min-h-[70vh] place-items-center py-12">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-bold">تسجيل الدخول</h1>
        <p className="mt-1 text-sm text-gray-500">نسخة تجريبية — اختر الدور للدخول مباشرة.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input type="email" placeholder="البريد الإلكتروني" defaultValue="demo@cmip.com" className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-trust focus:outline-none" />
          <input type="password" placeholder="كلمة المرور" defaultValue="demo1234" className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-trust focus:outline-none" />
          <div>
            <p className="mb-2 text-sm text-gray-500">الدور</p>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((r) => (
                <button type="button" key={r.k} onClick={() => setRole(r.k)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium ${role === r.k ? 'border-trust bg-trust text-white' : 'border-gray-300 text-gray-600'}`}>{r.t}</button>
              ))}
            </div>
          </div>
          <button className="btn btn-primary w-full">دخول</button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">ليس لديك حساب؟ <Link href="/login" className="text-trust">سجّل الآن</Link></p>
      </div>
    </div>
  );
}
