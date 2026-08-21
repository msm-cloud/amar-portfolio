'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { estimateReadingTime, formatPublishedDate } from '@/lib/blog';
import { useTranslation } from '@/lib/use-translation';

// Both pulled out of page.tsx (an async Server Component, for the
// Supabase fetch + HTML sanitizing) since useTranslation needs the
// client-side language context - same reason every migrated section has
// its own small client piece for static, translatable chrome. The post's
// own title/content stay untranslated by design (see the note in
// src/lib/blog.ts) and so stay rendered directly in the Server Component.

export function BlogBackLink() {
  const { t } = useTranslation();

  return (
    <Link
      href="/blog"
      className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden />
      {t('blog.backToBlog')}
    </Link>
  );
}

export function BlogPostMeta({
  publishedAt,
  content,
}: {
  publishedAt: string | null;
  content: string | null;
}) {
  const { t } = useTranslation();

  return (
    <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
      <span>{formatPublishedDate(publishedAt)}</span>
      <span aria-hidden>·</span>
      <span>
        {estimateReadingTime(content)} {t('blog.minRead')}
      </span>
    </div>
  );
}
