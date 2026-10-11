import type { Metadata, Viewport } from 'next';
import { Geist_Mono, Inter, Inter_Tight } from 'next/font/google';
import { OrbitCanvas } from '@/components/art/OrbitCanvas';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { Footer } from '@/components/site/Footer';
import { Frame } from '@/components/site/Frame';
import { Header } from '@/components/site/Header';
import './globals.css';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] });
const interTight = Inter_Tight({ variable: '--font-inter-tight', subsets: ['latin'], weight: ['400', '500', '600'] });
const mono = Geist_Mono({ variable: '--font-mono-face', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://wearediligence.com'),
  title: {
    default: 'Diligence AI — AI for work that matters.',
    template: '%s — Diligence AI',
  },
  description:
    'We build intelligent products for professionals and organisations working where accuracy, context and judgment matter. Diligence AI Technologies is the company behind DARA.',
  applicationName: 'Diligence AI',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Diligence AI',
    url: 'https://wearediligence.com',
    title: 'Diligence AI — AI for work that matters.',
    description: 'We build intelligent products for professionals and organisations working where accuracy, context and judgment matter.',
    images: [{ url: '/media/og.png', width: 1200, height: 630, alt: 'Diligence AI' }],
  },
  twitter: { card: 'summary_large_image', images: ['/media/og.png'] },
  icons: { icon: [{ url: '/media/icon.png', type: 'image/png' }], apple: '/media/apple-icon.png' },
};

export const viewport: Viewport = { themeColor: '#f3f3f1', colorScheme: 'light' };

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${interTight.variable} ${mono.variable}`}>
      <body className="min-h-screen">
        <OrbitCanvas />
        <Frame />
        <SmoothScroll />
        <Header />
        <main className="relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
