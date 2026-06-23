'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useToast } from '@/components/Providers';

const roles = [
  { k: 'investor', t: 'مستثمر', d: 'ادعم المشاريع وتابع محفظتك', href: '/dashboard/investor' },
  { k: 'owner', t: 'صاحب مشروع', d: 'أضف مشروعك وتابع التمويل', href: '/dashboard/owner' },
  { k: 'admin', t: 'إدارة', d: 'راجع المشاريع وأدر المنصة', href: '/admin' },
];
const names = { investor: 'مستثمر تجريبي', owner: 'صاحب مشروع', admin: 'مدير المنصة' };

export default function Login() {
  const [role, setRole] = useState('investor');
  const { login } = useAuth();
  const { notify } = useToast();
  const router = useRouter();

  function submit(e) {
    e.preventDefault();
    login({ name: names[role], email: `${role}@demo.com`, role });
    notify('أهلاً بك 👋');
    router.push(roles.find((r) => r.k === role).href);
  }

  return (
    <div className="container-x grid min-h-[75vh] place-items-center py-12">
      <div className="card w-full max-w-md animate-fadeUp p-8">
        <h1 className="text-2xl font-extrabold">تسجيل الدخول</h1>
        <p className="mt-1 text-sm muted">نسخة تجريبية — اختر الدور للدخول مباشرة.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="label">البريد الإلكتروني</label>
            <input type="email" defaultValue={`${role}@demo.com`} className="input" />
          </div>
          <div>
            <label className="label">كلمة المرور</label>
            <input type="password" defaultValue="demo1234" className="input" />
          </div>
          <div>
            <p className="label">اختر الدور</p>
            <div className="space-y-2">
              {roles.map((r) => (
                <button type="button" key={r.k} onClick={() => setRole(r.k)}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-right transition ${role === r.k ? 'border-trust bg-trust-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <span><span className="block font-semibold">{r.t}</span><span className="text-xs muted">{r.d}</span></span>
                  <span className={`h-4 w-4 rounded-full border ${role === r.k ? 'border-trust bg-trust' : 'border-gray-300'}`} />
                </button>
              ))}
            </div>
          </div>
          <button className="btn btn-primary w-full">دخول</button>
        </form>
      </div>
    </div>
  );
}
