'use client';

import Link from 'next/link';
import { Home } from 'lucide-react';
import { buttonVariants } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { useTranslation } from '@/lib/use-translation';

// Root-level (not inside (public)/) on purpose: a genuinely unmatched
// top-level URL doesn't belong to any route group's layout tree, so only
// this file catches it - a not-found.tsx placed inside (public)/ would
// only apply to notFound() calls from routes already inside that group
// (blog/[slug], projects/[slug], ...), not to a random unknown path.
// That also means this renders without the public Header/Footer (and
// without the admin sidebar) everywhere, including under /admin/* -
// intentional, not a bug: it's wrapped only by the root layout (html/
// body/ThemeProvider/LanguageProvider), so it looks the same and stays
// simple regardless of which section of the site the 404 happened in.
export default function NotFound() {
  const { t } = useTranslation();

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-24">
      <GlassCard className="flex max-w-md flex-col items-center gap-4 p-10 text-center">
        <p className="text-6xl font-bold text-primary">404</p>
        <h1 className="text-xl font-semibold text-foreground">
          {t('notFound.title')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t('notFound.description')}
        </p>
        <Link
          href="/"
          className={buttonVariants({ variant: 'primary', className: 'mt-2' })}
        >
          <Home className="mr-2 h-4 w-4" aria-hidden />
          {t('notFound.homeButton')}
        </Link>
      </GlassCard>
    </main>
  );
}
