'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { BentoCard } from '@/components/ui/BentoCard';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useLanguage } from '@/lib/language-context';
import { useTranslation } from '@/lib/use-translation';
import { pickBilingual } from '@/lib/placeholder-data';
import type { Database } from '@/types/database';
import { GithubActivityCard } from './GithubActivityCard';

type SiteSettingsRow = Database['public']['Tables']['site_settings']['Row'];

interface StatDisplay {
  value: string;
  label: string;
}

function statsFrom(
  settings: SiteSettingsRow | null,
  language: 'en' | 'bn'
): StatDisplay[] {
  if (!settings) return [];

  const pairs: Array<[string | null, string | null, string | null, string | null]> = [
    [
      settings.stat_1_value,
      settings.stat_1_value_bn,
      settings.stat_1_label,
      settings.stat_1_label_bn,
    ],
    [
      settings.stat_2_value,
      settings.stat_2_value_bn,
      settings.stat_2_label,
      settings.stat_2_label_bn,
    ],
    [
      settings.stat_3_value,
      settings.stat_3_value_bn,
      settings.stat_3_label,
      settings.stat_3_label_bn,
    ],
  ];

  return pairs
    .filter(([value, , label]) => value || label)
    .map(([value, valueBn, label, labelBn]) => ({
      value: pickBilingual(value ?? '', valueBn, language),
      label: pickBilingual(label ?? '', labelBn, language),
    }));
}

export function AboutContent({
  settings,
}: {
  settings: SiteSettingsRow | null;
}) {
  const shouldReduceMotion = useReducedMotion();
  const { language } = useLanguage();
  const { t } = useTranslation();

  const bio = settings
    ? pickBilingual(settings.about_bio ?? '', settings.about_bio_bn, language)
    : '';
  const stats = statsFrom(settings, language);

  return (
    <SectionContainer id="about">
      <SectionHeading
        eyebrow={t('about.eyebrow')}
        title={t('about.title')}
        description={t('about.description')}
      />

      {/*
       * Grid-span classes live on these motion.div wrappers, not on the
       * nested BentoCard — CSS grid only respects col-span/row-span on the
       * DIRECT child of the grid container. Putting the span classes one
       * level deeper (e.g. on BentoCard's `size` prop) would silently be a
       * no-op. Mobile stacks to 1 column automatically (no sm: prefix
       * needed below the sm breakpoint).
       */}
      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        variants={staggerContainer}
        initial={shouldReduceMotion ? 'visible' : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {bio && (
          <motion.div variants={fadeInUp} className="sm:col-span-3">
            <BentoCard className="h-full">
              <p className="text-base leading-relaxed text-foreground">
                {bio}
              </p>
            </BentoCard>
          </motion.div>
        )}

        {stats.map((stat, index) => (
          <motion.div key={index} variants={fadeInUp}>
            <BentoCard className="flex h-full flex-col items-center justify-center gap-1 text-center">
              <p className="text-2xl font-semibold text-primary">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </BentoCard>
          </motion.div>
        ))}

        <motion.div variants={fadeInUp} className="sm:col-span-3">
          <GithubActivityCard />
        </motion.div>
      </motion.div>
    </SectionContainer>
  );
}
