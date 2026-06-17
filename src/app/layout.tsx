import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Be_Vietnam_Pro, Quicksand } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import TopAppBar from '@/components/TopAppBar';

const zyzol = localFont({
  src: [
    { path: './fonts/Zyzol.otf', weight: '400', style: 'normal' },
    { path: './fonts/Zyzol-Bold.otf', weight: '700', style: 'normal' }
  ],
  variable: '--font-zyzol'
});

const quicksand = Quicksand({
  weight: ['700', '600'],
  subsets: ['latin'],
  variable: '--font-headline'
});

const beVietnamPro = Be_Vietnam_Pro({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-body'
});

export const metadata: Metadata = {
  title: 'P.R.I.T.',
  description: 'PR- och rustmästeriet på IT-sektionen vid Chalmers'
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="sv"
      suppressHydrationWarning
      className={`${zyzol.variable} ${quicksand.variable} ${beVietnamPro.variable}`}
    >
      <body>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <TopAppBar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
