import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/authContext';
import { Navbar } from '@/components/Navbar';
import { VerificationBanner } from '@/components/VerificationBanner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Find My Vibe — CSJMU Verified Student Network',
  description: 'Exclusively for verified residential students of Chhatrapati Shahu Ji Maharaj University (CSJMU), Kanpur. Match by hobbies, find batchmates, and connect securely.',
  icons: {
    icon: '/logo.jpg',
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
                <span>Find My Vibe • CSJMU Kanpur Residential Network</span>
              </div>
              <p className="text-zinc-600">
                Crafted for CSJMU hostelites. 100% Student Verified.
              </p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
