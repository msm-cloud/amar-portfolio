import type { Metadata } from 'next';
import { Geist, Geist_Mono, Noto_Sans_Bengali } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { ThemeProvider } from 'next-themes';
import { siteConfig } from '@/config/site';
import { LanguageProvider } from '@/lib/language-context';
import '@/styles/globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Bangla-friendly font: Geist has no Bengali glyphs at all, so without
// this, any Bangla text would silently fall back to whatever generic
// system font the browser happens to have. Included as a fallback in the
// --font-sans stack (globals.css), not swapped in conditionally - the
// browser already does per-character font substitution, so Latin text
// keeps using Geist and Bangla text automatically picks this up, with no
// JS needed to switch fonts when the language toggle changes.
const notoSansBengali = Noto_Sans_Bengali({
  variable: '--font-noto-bengali',
  subsets: ['bengali'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.seoTitle,
    template: `%s | ${siteConfig.ownerName}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.seoTitle,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.seoTitle,
    // PLACEHOLDER path - public/og-image.png doesn't exist yet. Referencing
    // it now is harmless (a missing OG image just means link previews fall
    // back to no image, not an error) - see the reminder at the end of the
    // PR this shipped in for adding the real 1200x630 file.
    images: ['/og-image.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.seoTitle,
    description: siteConfig.description,
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    // suppressHydrationWarning: next-themes sets the "dark"/"light" class
    // (and a color-scheme style) on <html> via an inline script that runs
    // before hydration, to avoid a flash of the wrong theme. That means the
    // server-rendered className will legitimately differ from what the
    // client sees on first paint — this tells React that's expected.
    // LanguageProvider also updates <html lang> after mount, for the same
    // reason.
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansBengali.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
        {/* No-op outside Vercel (local dev, other hosts) - only sends
            data once actually deployed on Vercel, so this is safe to
            leave in unconditionally. */}
        <Analytics />
      </body>
    </html>
  );
}
