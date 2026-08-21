'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useLanguage } from '@/lib/language-context';
import { useTranslation } from '@/lib/use-translation';
import { formatExperienceDateRange, pickBilingual } from '@/lib/placeholder-data';
import type { Database } from '@/types/database';

type ExperienceRow = Database['public']['Tables']['experience']['Row'];

export function ExperienceTimeline({
  entries,
  error,
}: {
  entries: ExperienceRow[];
  error: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const presentLabel = t('experience.present');

  if (error) {
    return (
      <p className="text-sm text-red-600 dark:text-red-400">
        Failed to load experience. Please refresh and try again.
      </p>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-12 text-center">
        <Briefcase
          className="mx-auto h-8 w-8 text-muted-foreground"
          aria-hidden
        />
        <p className="mt-4 text-sm text-muted-foreground">
          No experience listed yet — check back soon.
        </p>
      </div>
    );
  }

  return (
    /*
     * Timeline: each entry carries its own left border + dot (not one
     * shared absolutely-positioned line down the whole list), so it
     * naturally handles entries of different heights with no manual
     * position math. On sm+ the date and content sit in two columns;
     * below sm the grid collapses and they stack (date above content).
     */
    <motion.div
      variants={staggerContainer}
      initial={shouldReduceMotion ? 'visible' : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      {entries.map((entry) => (
        <motion.div
          key={entry.id}
          variants={fadeInUp}
          className="relative border-l-2 border-border py-1 pb-10 pl-8 last:border-transparent last:pb-0 sm:grid sm:grid-cols-[140px_1fr] sm:gap-8 sm:pl-10"
        >
          <span
            aria-hidden
            className="absolute top-2 -left-[9px] h-4 w-4 rounded-full border-2 border-primary bg-background"
          />

          <div className="mb-1 sm:mb-0 sm:text-right">
            <p className="text-sm font-medium text-muted-foreground">
              {formatExperienceDateRange(entry, presentLabel)}
            </p>
            {entry.is_current && (
              <Badge className="mt-1 inline-block">{presentLabel}</Badge>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {pickBilingual(entry.title, entry.title_bn, language)}
            </h3>
            <p className="text-sm font-medium text-primary">
              {pickBilingual(
                entry.organization,
                entry.organization_bn,
                language
              )}
            </p>
            {entry.description && (
              <p className="mt-2 text-sm text-muted-foreground">
                {pickBilingual(
                  entry.description,
                  entry.description_bn,
                  language
                )}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
