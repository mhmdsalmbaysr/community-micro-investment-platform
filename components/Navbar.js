'use client';
import Link from 'next/link';
import { useState } from 'react';

const links = [
  { href: '/', label: 'الرئيسية' },
  { href: '/projects', label: 'المشاريع' },
  { href: '/dashboard/investor', label: 'لوحة المستثمر' },
  { href: '/dashboard/owner', label: 'صاحب المشروع' },
  { href: '/admin', label: 'الإدارة' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur">
      <nav className="container-x flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-trust">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-trust text-white">م</span>
          <span className="hidden sm:block">منصة الاستثمار المجتمعي</span>
        </Link>
        <button className="md:hidden btn btn-ghost px-3 py-1.5" onClick={() => setOpen(!open)}>☰</button>
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-trust">{l.label}</Link>
          ))}
          <Link href="/login" className="btn btn-primary mr-2">تسجيل الدخول</Link>
        </div>
      </nav>
      {open && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="container-x flex flex-col py-2">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100">{l.label}</Link>
            ))}
            <Link href="/login" className="btn btn-primary mt-2">تسجيل الدخول</Link>
          </div>
        </div>
      )}
    </header>
  );
}
