'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { buttonVariants } from '@/components/ui/Button';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { pickText, useLanguage } from '@/lib/language-context';
import { useTranslation } from '@/lib/use-translation';

// PLACEHOLDER - replace via admin panel. Inline (not placeholder-data.ts)
// since the Hero owns this content and nothing else reads it.
const NAME = { en: 'Shahid', bn: 'শাহিদ' };
const TAGLINE = {
  en: 'Web Developer & Graphic Designer — Building Digital Solutions for Financial Institutions',
  bn: 'ওয়েব ডেভেলপার ও গ্রাফিক ডিজাইনার — আর্থিক প্রতিষ্ঠানের জন্য ডিজিটাল সমাধান তৈরি করি',
};
const DESCRIPTION = {
  en: 'With years of experience spanning web development, graphic design, and financial-sector administration, I build reliable, polished digital solutions that hold up under real operational demands.',
  bn: 'ওয়েব ডেভেলপমেন্ট, গ্রাফিক ডিজাইন এবং আর্থিক খাতের প্রশাসনিক কাজে বছরের অভিজ্ঞতা নিয়ে, আমি এমন নির্ভরযোগ্য ও পরিপাটি ডিজিটাল সমাধান তৈরি করি যা বাস্তব কর্মক্ষেত্রের চাপ সামলাতে সক্ষম।',
};

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const { language } = useLanguage();
  const { t } = useTranslation();

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
            {pickText(NAME, language)}
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl font-medium text-primary sm:text-2xl"
          >
            {pickText(TAGLINE, language)}
          </motion.p>

          <motion.p
            variants={fadeInUp}
            className="max-w-xl text-base text-muted-foreground sm:text-lg"
          >
            {pickText(DESCRIPTION, language)}
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-2">
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
      </SectionContainer>
    </section>
  );
}
