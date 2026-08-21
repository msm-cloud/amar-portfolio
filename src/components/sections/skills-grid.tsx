'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  Atom,
  Briefcase,
  Code2,
  Database as DatabaseIcon,
  DatabaseZap,
  FileCode2,
  FileSpreadsheet,
  GitBranch,
  Image as ImageIcon,
  Landmark,
  Paintbrush,
  Palette,
  PenTool,
  Server,
  Triangle,
  Wind,
  type LucideIcon,
} from 'lucide-react';
import { BentoCard } from '@/components/ui/BentoCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProficiencyDots } from '@/components/ui/ProficiencyDots';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useLanguage } from '@/lib/language-context';
import { useTranslation } from '@/lib/use-translation';
import type { Database } from '@/types/database';

type SkillRow = Database['public']['Tables']['skills']['Row'];

// lucide-react has ~1500 icons - importing all of them isn't practical for
// a plain-text `icon_name` field, so this covers what the seeded skills
// use plus reasonable general-purpose picks. An icon_name that isn't here
// (typo, or a real lucide icon just not added yet) falls back to Code2
// rather than crashing - see resolveIcon below.
const ICON_MAP: Record<string, LucideIcon> = {
  Atom,
  Triangle,
  FileCode2,
  Wind,
  Server,
  Database: DatabaseIcon,
  DatabaseZap,
  PenTool,
  Image: ImageIcon,
  Paintbrush,
  Palette,
  GitBranch,
  FileSpreadsheet,
  Briefcase,
  Landmark,
  Code2,
};

function resolveIcon(iconName: string | null): LucideIcon {
  if (!iconName) return Code2;
  return ICON_MAP[iconName] ?? Code2;
}

// Fixed display order for the known categories (matches the admin form's
// dropdown) - anything else (shouldn't normally happen, since the admin
// form is a closed set, but the column itself is plain `text`) sorts
// after these, alphabetically.
const CATEGORY_ORDER = ['Frontend', 'Backend', 'Design', 'Tools & Other'];

const CATEGORY_LABELS_BN: Record<string, string> = {
  Frontend: 'ফ্রন্টএন্ড',
  Backend: 'ব্যাকএন্ড',
  Design: 'ডিজাইন',
  'Tools & Other': 'টুলস ও অন্যান্য',
};

function groupByCategory(skills: SkillRow[]): [string, SkillRow[]][] {
  const groups = new Map<string, SkillRow[]>();
  for (const skill of skills) {
    const category = skill.category || 'Other';
    const existing = groups.get(category);
    if (existing) {
      existing.push(skill);
    } else {
      groups.set(category, [skill]);
    }
  }

  return [...groups.entries()].sort(([a], [b]) => {
    const indexA = CATEGORY_ORDER.indexOf(a);
    const indexB = CATEGORY_ORDER.indexOf(b);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b);
  });
}

export function SkillsGrid({
  skills,
  error,
}: {
  skills: SkillRow[];
  error: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();
  const { language } = useLanguage();
  const { t } = useTranslation();

  if (error) {
    return (
      <p className="text-sm text-red-600 dark:text-red-400">
        Failed to load skills. Please refresh and try again.
      </p>
    );
  }

  if (skills.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-12 text-center">
        <Code2 className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden />
        <p className="mt-4 text-sm text-muted-foreground">
          No skills listed yet — check back soon.
        </p>
      </div>
    );
  }

  const groupedSkills = groupByCategory(skills);

  return (
    <motion.div
      className="flex flex-col gap-6"
      variants={staggerContainer}
      initial={shouldReduceMotion ? 'visible' : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      {groupedSkills.map(([category, categorySkills]) => (
        <motion.div key={category} variants={fadeInUp}>
          <GlassCard className="p-6 sm:p-8">
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              {language === 'bn'
                ? (CATEGORY_LABELS_BN[category] ?? category)
                : category}
            </h3>

            {/*
             * size="small" is required here, not cosmetic: BentoCard
             * defaults to size="medium" (col-span-2), which would make
             * every chip eat 2 columns and wreck this grid. See the note
             * in components/ui/README.md.
             */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {categorySkills.map((skill) => {
                const Icon = resolveIcon(skill.icon_name);
                const level = skill.proficiency_level ?? 0;
                return (
                  <BentoCard
                    key={skill.id}
                    size="small"
                    className="flex flex-col items-center gap-2 p-4 text-center"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {skill.name}
                    </span>
                    <ProficiencyDots
                      level={level}
                      label={t(`skills.levels.${level}`)}
                    />
                  </BentoCard>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </motion.div>
  );
}
