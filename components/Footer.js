import Link from 'next/link';
export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="container-x grid gap-8 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-bold text-trust"><span className="grid h-8 w-8 place-items-center rounded-lg bg-trust text-white">م</span>منصة الاستثمار المجتمعي</div>
          <p className="mt-3 text-sm muted">نموذج تجريبي لتمكين المشاريع الصغيرة والفئات الهشة عبر الاستثمار المجتمعي الشفاف.</p>
        </div>
        <div><h4 className="mb-3 font-semibold">المنصة</h4><ul className="space-y-2 text-sm muted">
          <li><Link href="/projects" className="hover:text-trust">المشاريع</Link></li>
          <li><Link href="/for-donors" className="hover:text-trust">للجهات المانحة</Link></li>
          <li><Link href="/login" className="hover:text-trust">تسجيل الدخول</Link></li>
        </ul></div>
        <div><h4 className="mb-3 font-semibold">الأدوار</h4><ul className="space-y-2 text-sm muted">
          <li><Link href="/dashboard/investor" className="hover:text-trust">لوحة المستثمر</Link></li>
          <li><Link href="/dashboard/owner" className="hover:text-trust">لوحة صاحب المشروع</Link></li>
          <li><Link href="/admin" className="hover:text-trust">لوحة الإدارة</Link></li>
        </ul></div>
        <div><h4 className="mb-3 font-semibold">تنبيه</h4><p className="text-sm muted">⚠️ نسخة تجريبية (MVP) — كل العمليات محاكاة بدون تحويلات مالية حقيقية.</p></div>
      </div>
      <div className="border-t border-gray-100"><div className="container-x py-5 text-center text-xs muted">© {new Date().getFullYear()} منصة الاستثمار المجتمعي — جميع الحقوق محفوظة (عرض تجريبي).</div></div>
    </footer>
  );
}
