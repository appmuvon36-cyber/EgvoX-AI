import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AppStateProvider } from '@/lib/hooks/useAppState';
import { SiteHeader } from '@/apps/web/shared/SiteHeader';
import { SiteFooter } from '@/apps/web/shared/SiteFooter';
import { MobileBottomNav } from '@/apps/web/shared/MobileBottomNav';
import { GlobalActionModals } from '@/apps/web/shared/GlobalActionModals';
import { OfflineIndicator } from '@/packages/design-system';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#027F86',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'EgvoX — The Human Experience Data Network & Marketplace',
  description:
    'Marketplace and managed data operations platform connecting egocentric video contributors, data annotators, dataset vendors, and enterprise teams.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'EgvoX',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'EgvoX — The Human Experience Data Network & Marketplace',
    description:
      'Marketplace and managed data operations platform for egocentric video capture, annotation, QA, and enterprise datasets.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EgvoX — The Human Experience Data Network & Marketplace',
    description:
      'Marketplace and managed data operations platform for egocentric video capture, annotation, QA, and enterprise datasets.',
  },
};

const DEV_SW_PURGE_SCRIPT = `
(function(){
  try {
    var h = location.hostname || '';
    if (h === 'localhost' || h === '127.0.0.1' || h.indexOf('ais-dev-') === 0) {
      var hadController = !!navigator.serviceWorker && !!navigator.serviceWorker.controller;
      if ('caches' in window) {
        caches.keys().then(function(keys){ keys.forEach(function(k){ caches.delete(k); }); });
      }
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(regs){
          if (regs.length > 0) {
            Promise.all(regs.map(function(r){ return r.unregister(); })).then(function(){
              if (hadController && !sessionStorage.getItem('egvox_sw_purged')) {
                sessionStorage.setItem('egvox_sw_purged', '1');
                location.reload();
              }
            });
          }
        });
      }
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: DEV_SW_PURGE_SCRIPT }} />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col bg-[var(--egvox-bg-canvas)] text-[var(--egvox-text-primary)] antialiased"
      >
        <AppStateProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <MobileBottomNav />
          <GlobalActionModals />
          <OfflineIndicator />
        </AppStateProvider>
      </body>
    </html>
  );
}
