'use client';

import { SectionHeading } from '@/components/ui/SectionHeading';
import { useTranslation } from '@/lib/use-translation';

// Split out from Experience.tsx (an async Server Component, for the
// Supabase fetch) since useTranslation needs the client-side language
// context - same pattern as Projects' projects-heading.tsx.
export function ExperienceHeading() {
  const { t } = useTranslation();

  return (
    <SectionHeading eyebrow={t('experience.eyebrow')} title={t('experience.title')} />
  );
}
