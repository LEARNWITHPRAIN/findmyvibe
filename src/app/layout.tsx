import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/authContext';
import { Navbar } from '@/components/Navbar';
import { VerificationBanner } from '@/components/VerificationBanner';

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
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <footer className="border-t border-zinc-900 bg-zinc-950/80 py-8 px-4 text-center text-xs text-zinc-500">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <span>Find My Vibe • CSJMU Student Community</span>
              </div>
              <p className="text-zinc-600">
                100% Student Verified. Connect with your campus vibe.
              </p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
