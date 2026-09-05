import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'BazaarBondhu - Bangladesh’s Modern Classified Marketplace',
  description: 'Buy and sell cars, mobile phones, apartments, furniture, electronics and find jobs across all 64 districts in Bangladesh safely with BazaarBondhu.',
  keywords: 'classifieds bangladesh, buy sell cars dhaka, apartments for rent bashundhara, buy used mobile, bazar bondhu',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <MobileBottomNav />
            </div>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
