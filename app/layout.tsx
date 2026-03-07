import type { Metadata } from 'next';
import { Viewport } from 'next';
import './globals.css';
import { ClerkProvider, SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';
import CookieConsent from '@/components/CookieConsent';
import AgeVerification from '@/components/AgeVerification';
import { SupabaseProvider } from '@/components/SupabaseProvider';

export const metadata: Metadata = {
  title: 'PulseMate – AI Companions for Flirty Chats',
  description: 'Experience teasing AI girlfriends with emotional depth. Start free today! 18+ only.',
  keywords: ['AI companion', 'AI girlfriend', 'virtual companion', 'chat AI', 'PulseMate', 'adult AI'],
  authors: [{ name: 'PulseMate' }],
  openGraph: {
    title: 'PulseMate – AI Companions for Flirty Chats',
    description: 'Experience teasing AI girlfriends with emotional depth. Start free today! 18+ only.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PulseMate – AI Companions for Flirty Chats',
    description: 'Experience teasing AI girlfriends with emotional depth. Start free today! 18+ only.',
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'age-rating': '18+',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {/* Universal Header */}
          <header className="p-6 flex justify-between items-center border-b border-purple-500/30 bg-black/40 backdrop-blur-md sticky top-0 z-[100]">
            <Link href="/">
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                PulseMate
              </h1>
            </Link>
            <div className="flex gap-4 items-center">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-6 py-3 bg-purple-600 rounded-full font-medium hover:brightness-110 transition">
                    Log In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-6 py-3 bg-pink-500 rounded-full font-medium hover:brightness-110 transition">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-medium hover:brightness-110 transition">
                    Dashboard
                  </button>
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </header>
          {children}
          <SupabaseProvider><AgeVerification />
          <CookieConsent />
        </SupabaseProvider></body>
      </html>
    </ClerkProvider>
  );
}
