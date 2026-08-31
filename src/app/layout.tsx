import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/authContext';
import { Navbar } from '@/components/Navbar';
import { BottomNavbar } from '@/components/BottomNavbar';
import { VerificationBanner } from '@/components/VerificationBanner';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL('https://findmyvibe.fun'),
  title: 'FindMyVibe — Connect With People Who Match Your Vibe',
  description:
    'FindMyVibe is a college social platform where students can discover people with similar interests, hobbies, and vibes.',
  keywords: [
    'college social network',
    'find college friends',
    'meet college students',
    'college community',
    'student social platform',
    'find people with similar interests',
  ],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/logo.jpg', sizes: '32x32', type: 'image/jpeg' },
    ],
    apple: '/logo.jpg',
  },
  openGraph: {
    title: 'FindMyVibe — Connect With People Who Match Your Vibe',
    description:
      'FindMyVibe is a college social platform where students can discover people with similar interests, hobbies, and vibes.',
    url: 'https://findmyvibe.fun',
    siteName: 'FindMyVibe',
    images: [
      {
        url: '/logo.jpg',
        width: 800,
        height: 800,
        alt: 'FindMyVibe',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FindMyVibe — Connect With People Who Match Your Vibe',
    description:
      'FindMyVibe is a college social platform where students can discover people with similar interests, hobbies, and vibes.',
    images: ['/logo.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-[#0A0A0B] text-zinc-100 min-h-screen flex flex-col antialiased selection:bg-purple-500/30 selection:text-white`}>
        <AuthProvider>
          <Navbar />
          <VerificationBanner />
          <main className="flex-1 flex flex-col pb-20 sm:pb-24">
            {children}
          </main>
          <BottomNavbar />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
