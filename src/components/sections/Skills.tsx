'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  Atom,
  Briefcase,
  Database,
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
import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { fadeInUp, staggerContainer } from '@/lib/animations';

interface SkillItem {
  name: string;
  icon: LucideIcon;
  /** 1-5, rendered as filled/unfilled dots via ProficiencyDots. */
  level: number;
}

interface SkillCategory {
  category: string;
  skills: SkillItem[];
}

const LEVEL_LABELS: Record<number, string> = {
  1: 'Beginner',
  2: 'Familiar',
  3: 'Intermediate',
  4: 'Advanced',
  5: 'Expert',
};

// PLACEHOLDER - replace with real Supabase data once the admin panel's
// content management is built. lucide-react has no brand logos, so icons
// below are the closest reasonable generic match, not official logos.
const SKILL_CATEGORIES: SkillCategory[] = [
  {
    category: 'Frontend',
    skills: [
      { name: 'React', icon: Atom, level: 5 },
      { name: 'Next.js', icon: Triangle, level: 5 },
      { name: 'TypeScript', icon: FileCode2, level: 4 },
      { name: 'Tailwind CSS', icon: Wind, level: 5 },
    ],
  },
  {
    category: 'Backend',
    skills: [
      { name: 'Node.js', icon: Server, level: 4 },
      { name: 'PostgreSQL', icon: Database, level: 4 },
      { name: 'Supabase', icon: DatabaseZap, level: 4 },
    ],
  },
  {
    category: 'Design',
    skills: [
      { name: 'Figma', icon: PenTool, level: 5 },
      { name: 'Photoshop', icon: ImageIcon, level: 4 },
      { name: 'Illustrator', icon: Paintbrush, level: 4 },
      { name: 'UI/UX Design', icon: Palette, level: 5 },
    ],
  },
  {
    category: 'Tools & Other',
    skills: [
      { name: 'Git', icon: GitBranch, level: 4 },
      { name: 'Excel / Data Analysis', icon: FileSpreadsheet, level: 4 },
      { name: 'MS Office', icon: Briefcase, level: 4 },
      // PLACEHOLDER - swap for whatever software is actually used day to
      // day; kept generic since this varies a lot by employer.
      { name: 'Banking Operations Software', icon: Landmark, level: 3 },
    ],
  },
];

export function Skills() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <SectionContainer id="skills">
      <SectionHeading
        eyebrow="Skills"
        title="Tools & Technologies I Work With"
        description="Grouped by area — hover a card for the exact skill name if the icon alone isn't obvious."
      />

      <motion.div
        className="flex flex-col gap-6"
        variants={staggerContainer}
        initial={shouldReduceMotion ? 'visible' : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {SKILL_CATEGORIES.map((group) => (
          <motion.div key={group.category} variants={fadeInUp}>
            <GlassCard className="p-6 sm:p-8">
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                {group.category}
              </h3>

              {/*
               * size="small" is required here, not cosmetic: BentoCard
               * defaults to size="medium" (col-span-2), which would make
               * every chip eat 2 columns and wreck this grid. See the
               * note in components/ui/README.md.
               */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {group.skills.map((skill) => {
                  const Icon = skill.icon;
                  return (
                    <BentoCard
                      key={skill.name}
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
                        level={skill.level}
                        label={LEVEL_LABELS[skill.level]}
                      />
                    </BentoCard>
                  );
                })}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </SectionContainer>
  );
}
