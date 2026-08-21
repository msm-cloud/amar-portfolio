'use client';

import { SectionHeading } from '@/components/ui/SectionHeading';
import { useTranslation } from '@/lib/use-translation';

// Split out from page.tsx (an async Server Component, for the Supabase
// fetch) since useTranslation needs the client-side language context -
// same pattern as every other section's own *-heading.tsx.
export function BlogHeading() {
  const { t } = useTranslation();

  return (
    <SectionHeading eyebrow={t('blog.eyebrow')} title={t('blog.title')} />
  );
}
