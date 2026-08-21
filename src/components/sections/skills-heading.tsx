'use client';

import { SectionHeading } from '@/components/ui/SectionHeading';
import { useTranslation } from '@/lib/use-translation';

// Split out from Skills.tsx (an async Server Component, for the Supabase
// fetch) since useTranslation needs the client-side language context -
// same pattern as Projects' projects-heading.tsx.
export function SkillsHeading() {
  const { t } = useTranslation();

  return (
    <SectionHeading
      eyebrow={t('skills.eyebrow')}
      title={t('skills.title')}
      description={t('skills.description')}
    />
  );
}
