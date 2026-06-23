import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'منصة الاستثمار المجتمعي',
  description: 'منصة استثمار مجتمعي لدعم المشاريع الصغيرة والفئات الهشة — نسخة تجريبية (MVP).',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
