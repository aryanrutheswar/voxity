import React from 'react';
import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Vox.ity | Digital Marketing & Growth Engineering Agency',
  description: 'Vox.ity engineers exponential growth for future-focused brands through AI automation, high-converting performance ads, SEO authority, and bespoke web platforms.',
  keywords: [
    'Digital Marketing Agency',
    'SEO Agency',
    'Google Ads PPC',
    'Meta Ads Scaling',
    'Brand Strategy',
    'Web Design UI UX',
    'Next.js Web Development',
    'AI Marketing Workflows',
    'B2B Lead Generation'
  ],
  authors: [{ name: 'Vox.ity' }],
  openGraph: {
    title: 'Vox.ity | Growth Engineering Agency',
    description: 'Data-driven performance ads, AI workflows, and high-converting digital platforms.',
    type: 'website',
    url: 'https://voxity.com',
    siteName: 'Vox.ity',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vox.ity Agency',
    description: 'Digital Marketing & Growth Engineering Agency.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`light scroll-smooth ${inter.variable} ${plusJakarta.variable}`}>
      <body className="font-sans antialiased selection:bg-[#FFE600] selection:text-black bg-white dark:bg-[#0B0F19] text-black dark:text-slate-100 transition-colors duration-300">
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
