'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { BentoCard } from '@/components/ui/BentoCard';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { pickText, useLanguage, type Bilingual } from '@/lib/language-context';
import { useTranslation } from '@/lib/use-translation';
import { GithubActivityCard } from './GithubActivityCard';

const BIO: Bilingual = {
  en: "I'm a web developer and graphic designer who also spent years in financial-sector administration — a combination that shapes how I build. I care about interfaces that are not just visually polished but genuinely dependable under real operational load, the same standard I held to when handling day-to-day financial operations. I work across the full stack, from backend data models to pixel-level design details. My goal on every project is software that a financial institution could actually trust in production, not just a portfolio piece.",
  bn: 'আমি একজন ওয়েব ডেভেলপার ও গ্রাফিক ডিজাইনার, যিনি একই সাথে বছরের পর বছর আর্থিক খাতের প্রশাসনিক কাজেও যুক্ত ছিলেন — এই মিশ্রণই আমার কাজের ধরন গড়ে তুলেছে। আমি এমন ইন্টারফেস তৈরিতে বিশ্বাসী যা শুধু দৃষ্টিনন্দনই নয়, বরং বাস্তব কর্মচাপেও নির্ভরযোগ্য — ঠিক যে মানদণ্ড আমি প্রতিদিনের আর্থিক কার্যক্রম পরিচালনার সময় বজায় রেখেছি। আমি ব্যাকএন্ড ডেটা মডেল থেকে শুরু করে পিক্সেল পর্যায়ের ডিজাইন খুঁটিনাটি পর্যন্ত, পুরো স্ট্যাক জুড়ে কাজ করি। প্রতিটি প্রজেক্টে আমার লক্ষ্য এমন সফটওয়্যার তৈরি করা, যা একটি আর্থিক প্রতিষ্ঠান সত্যিকার অর্থে প্রোডাকশনে বিশ্বাস করতে পারে — শুধু পোর্টফোলিওর জন্য নয়।',
};

// PLACEHOLDER - replace via admin panel. Keep this array in sync with
// whatever quick facts should show as stat tiles.
const STATS: Array<{ value: Bilingual; label: Bilingual }> = [
  {
    value: { en: '5+', bn: '৫+' },
    label: { en: 'Years Experience', bn: 'বছরের অভিজ্ঞতা' },
  },
  {
    value: { en: 'Web + Design', bn: 'ওয়েব + ডিজাইন' },
    label: { en: 'Dev & Graphic Design', bn: 'ডেভেলপমেন্ট ও গ্রাফিক ডিজাইন' },
  },
  {
    value: { en: 'Financial Sector', bn: 'আর্থিক খাত' },
    label: { en: 'Operations Background', bn: 'অপারেশনাল অভিজ্ঞতা' },
  },
];

export function About() {
  const shouldReduceMotion = useReducedMotion();
  const { language } = useLanguage();
  const { t } = useTranslation();

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
        <motion.div variants={fadeInUp} className="sm:col-span-3">
          <BentoCard className="h-full">
            <p className="text-base leading-relaxed text-foreground">
              {pickText(BIO, language)}
            </p>
          </BentoCard>
        </motion.div>

        {STATS.map((stat) => (
          <motion.div key={stat.label.en} variants={fadeInUp}>
            <BentoCard className="flex h-full flex-col items-center justify-center gap-1 text-center">
              <p className="text-2xl font-semibold text-primary">
                {pickText(stat.value, language)}
              </p>
              <p className="text-sm text-muted-foreground">
                {pickText(stat.label, language)}
              </p>
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
