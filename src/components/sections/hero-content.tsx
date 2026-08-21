'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { User } from 'lucide-react';
import { buttonVariants } from '@/components/ui/Button';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { pickBilingual } from '@/lib/placeholder-data';
import { useLanguage } from '@/lib/language-context';
import { useTranslation } from '@/lib/use-translation';
import { getInitials } from '@/lib/utils';
import type { Database } from '@/types/database';

type SiteSettingsRow = Database['public']['Tables']['site_settings']['Row'];

export function HeroContent({
  settings,
}: {
  settings: SiteSettingsRow | null;
}) {
  const shouldReduceMotion = useReducedMotion();
  const { language } = useLanguage();
  const { t } = useTranslation();

  // A missing settings row (query failed) falls back to the same values
  // the migration seeds it with, so the hero never shows blank text.
  const fullName = settings
    ? pickBilingual(settings.full_name, settings.full_name_bn, language)
    : 'Shahid';
  const tagline = settings
    ? pickBilingual(settings.tagline ?? '', settings.tagline_bn, language)
    : '';
  const description = settings
    ? pickBilingual(
        settings.hero_description ?? '',
        settings.hero_description_bn,
        language
      )
    : '';
  const photoUrl = settings?.profile_photo_url ?? null;

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* Background treatment: soft primary/accent gradient blobs + a very
          faint grid, echoing the bento/glass language without competing
          with the foreground content. Decorative only. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <SectionContainer className="w-full py-24">
        <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center">
          <motion.div
            variants={fadeInUp}
            initial={shouldReduceMotion ? 'visible' : 'hidden'}
            animate="visible"
            className="shrink-0"
          >
            <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-border/60 shadow-xl sm:h-40 sm:w-40">
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt={fullName}
                  fill
                  sizes="(min-width: 640px) 10rem, 8rem"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 via-accent/10 to-transparent text-3xl font-semibold text-primary">
                  {fullName.trim() ? (
                    getInitials(fullName)
                  ) : (
                    <User className="h-10 w-10" aria-hidden />
                  )}
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial={shouldReduceMotion ? 'visible' : 'hidden'}
            animate="visible"
            className="flex max-w-3xl flex-col items-start gap-6"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
            >
              {fullName}
            </motion.h1>

            {tagline && (
              <motion.p
                variants={fadeInUp}
                className="text-xl font-medium text-primary sm:text-2xl"
              >
                {tagline}
              </motion.p>
            )}

            {description && (
              <motion.p
                variants={fadeInUp}
                className="max-w-xl text-base text-muted-foreground sm:text-lg"
              >
                {description}
              </motion.p>
            )}

            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap gap-4 pt-2"
            >
              {/* Scrolls to the Projects section */}
              <a
                href="#projects"
                className={buttonVariants({ variant: 'primary', size: 'lg' })}
              >
                {t('hero.viewProjects')}
              </a>
              {/* PLACEHOLDER - replace via admin panel */}
              <a
                href="#"
                className={buttonVariants({ variant: 'outline', size: 'lg' })}
              >
                {t('hero.downloadResume')}
              </a>
            </motion.div>
          </motion.div>
        </div>
      </SectionContainer>
    </section>
  );
}
