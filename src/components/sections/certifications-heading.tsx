'use client';

import { SectionHeading } from '@/components/ui/SectionHeading';
import { useTranslation } from '@/lib/use-translation';

// Split out from Certifications.tsx (an async Server Component, for the
// Supabase fetch) since useTranslation needs the client-side language
// context - same pattern as Projects' projects-heading.tsx.
export function CertificationsHeading() {
  const { t } = useTranslation();

  return (
    <SectionHeading
      eyebrow={t('certifications.eyebrow')}
      title={t('certifications.title')}
    />
  );
}
