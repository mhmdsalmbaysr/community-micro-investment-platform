'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/components/Providers';
import { roleLabels } from '@/lib/data';

const baseLinks = [
  { href: '/', label: 'الرئيسية' },
  { href: '/projects', label: 'المشاريع' },
  { href: '/for-donors', label: 'للجهات المانحة' },
];
const roleHome = { investor: '/dashboard/investor', owner: '/dashboard/owner', admin: '/admin' };

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const path = usePathname();
  const links = [...baseLinks];
  if (user) links.push({ href: roleHome[user.role], label: 'لوحتي' });

  const Item = ({ href, label }) => (
    <Link href={href} onClick={() => setOpen(false)}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition ${path === href ? 'bg-trust-50 text-trust' : 'text-gray-600 hover:bg-gray-100 hover:text-trust'}`}>{label}</Link>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/85 backdrop-blur-md">
      <nav className="container-x flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-trust">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-trust to-trust-light text-white">م</span>
          <span className="hidden text-[15px] sm:block">منصة الاستثمار المجتمعي</span>
        </Link>
        <button className="btn btn-ghost px-3 py-1.5 md:hidden" onClick={() => setOpen(!open)} aria-label="القائمة">☰</button>
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => <Item key={l.href} {...l} />)}
          {user ? (
            <div className="mr-3 flex items-center gap-2">
              <span className="chip bg-gray-100 text-gray-600">{user.name} · {roleLabels[user.role]}</span>
              <button onClick={logout} className="btn btn-ghost px-3 py-1.5">خروج</button>
            </div>
          ) : (
            <Link href="/login" className="btn btn-primary mr-2">تسجيل الدخول</Link>
          )}
        </div>
      </nav>
      {open && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="container-x flex flex-col py-2">
            {links.map((l) => <Item key={l.href} {...l} />)}
            {user ? (
              <button onClick={() => { logout(); setOpen(false); }} className="btn btn-ghost mt-2">خروج ({user.name})</button>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)} className="btn btn-primary mt-2">تسجيل الدخول</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
