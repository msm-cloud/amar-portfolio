'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import {
  formatExperienceDateRange,
  PLACEHOLDER_EXPERIENCE,
} from '@/lib/placeholder-data';

export function Experience() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <SectionContainer id="experience">
      <SectionHeading eyebrow="Experience" title="Career Journey" />

      {/*
       * Timeline: each entry carries its own left border + dot (not one
       * shared absolutely-positioned line down the whole list), so it
       * naturally handles entries of different heights with no manual
       * position math. On sm+ the date and content sit in two columns;
       * below sm the grid collapses and they stack (date above content).
       */}
      <motion.div
        variants={staggerContainer}
        initial={shouldReduceMotion ? 'visible' : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {PLACEHOLDER_EXPERIENCE.map((entry) => (
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
                {formatExperienceDateRange(entry)}
              </p>
              {entry.is_current && (
                <Badge className="mt-1 inline-block">Present</Badge>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {entry.title}
              </h3>
              <p className="text-sm font-medium text-primary">
                {entry.organization}
              </p>
              {entry.description && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {entry.description}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </SectionContainer>
  );
}
