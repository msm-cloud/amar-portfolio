'use client';

import { SectionHeading } from '@/components/ui/SectionHeading';
import { useTranslation } from '@/lib/use-translation';

// Split out from Testimonials.tsx (an async Server Component, for the
// Supabase fetch) since useTranslation needs the client-side language
// context - same pattern as Projects' projects-heading.tsx.
export function TestimonialsHeading() {
  const { t } = useTranslation();

  return (
    <SectionHeading
      eyebrow={t('testimonials.eyebrow')}
      title={t('testimonials.title')}
    />
  );
}
