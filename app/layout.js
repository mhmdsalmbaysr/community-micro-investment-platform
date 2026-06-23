import './globals.css';
import { Tajawal } from 'next/font/google';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const tajawal = Tajawal({ subsets: ['arabic'], weight: ['400', '500', '700', '800'], variable: '--font-tajawal' });

export const metadata = {
  title: 'منصة الاستثمار المجتمعي | دعم المشاريع الصغيرة والفئات الهشة',
  description: 'منصة استثمار مجتمعي شفافة تتيح دعم المشاريع الصغيرة بمبالغ صغيرة وقياس الأثر الاجتماعي. نسخة تجريبية (MVP).',
  keywords: ['استثمار مجتمعي', 'تمويل جماعي', 'مشاريع صغيرة', 'أثر اجتماعي'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body className="flex min-h-screen flex-col font-sans">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
