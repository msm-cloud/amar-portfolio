'use client';

import { SectionHeading } from '@/components/ui/SectionHeading';
import { useTranslation } from '@/lib/use-translation';

// Split out from Projects.tsx (an async Server Component, for the
// Supabase fetch) since useTranslation needs the client-side language
// context - same reason ProjectsGrid is its own client component too.
export function ProjectsHeading() {
  const { t } = useTranslation();

  return (
    <SectionHeading
      eyebrow={t('projects.eyebrow')}
      title={t('projects.title')}
      description={t('projects.description')}
    />
  );
}
