import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="container-x grid min-h-[60vh] place-items-center text-center">
      <div>
        <h1 className="text-5xl font-extrabold text-trust">404</h1>
        <p className="mt-3 text-gray-500">الصفحة غير موجودة.</p>
        <Link href="/" className="btn btn-primary mt-6">العودة للرئيسية</Link>
      </div>
    </div>
  );
}
