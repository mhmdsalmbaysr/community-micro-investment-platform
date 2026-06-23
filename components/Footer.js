export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="container-x flex flex-col items-center justify-between gap-4 py-8 text-sm text-gray-500 sm:flex-row">
        <p>© {new Date().getFullYear()} منصة الاستثمار المجتمعي — نسخة تجريبية (MVP / Demo).</p>
        <p className="text-xs">⚠️ محاكاة فقط — لا توجد تحويلات مالية حقيقية.</p>
      </div>
    </footer>
  );
}
