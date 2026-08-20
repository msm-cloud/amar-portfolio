'use client';

import { motion } from 'framer-motion';
import { siteConfig } from '@/config/site';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { BentoCard } from '@/components/ui/BentoCard';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

// TEMPORARY: this page exists only to visually verify the design system
// foundation (fonts, colors, theme toggle, UI primitives, animations)
// before real content sections are built in the next step. It will be
// replaced entirely.
export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <SectionContainer className="flex flex-col items-center gap-10 text-center">
        <div className="flex w-full items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {siteConfig.name} — design system preview
          </span>
          <ThemeToggle />
        </div>

        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {siteConfig.name}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base text-muted-foreground">
            {siteConfig.description} Content coming soon.
          </p>
        </div>

        <GlassCard className="w-full max-w-sm text-left">
          <h2 className="mb-1 text-lg font-semibold text-foreground">
            GlassCard
          </h2>
          <p className="text-sm text-muted-foreground">
            Translucent surface with backdrop blur, adapting to the current
            theme via the <code className="text-primary">--card</code> /{' '}
            <code className="text-primary">--border</code> tokens.
          </p>
        </GlassCard>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </SectionContainer>

      <SectionContainer>
        <SectionHeading
          eyebrow="Design system"
          title="BentoCard grid"
          description="Mixed tile sizes composed in a 3-column grid, revealing with the fadeInUp / staggerContainer animation variants."
        />

        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.div variants={fadeInUp}>
            <BentoCard size="large" className="h-full min-h-48">
              <h3 className="text-lg font-semibold text-foreground">Large</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Spans 2 columns and 2 rows — good for a featured project or
                headline stat.
              </p>
            </BentoCard>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <BentoCard size="small" className="h-full min-h-48">
              <h3 className="text-lg font-semibold text-foreground">Small</h3>
              <p className="mt-2 text-sm text-muted-foreground">1×1 tile.</p>
            </BentoCard>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <BentoCard size="small" className="h-full min-h-48">
              <h3 className="text-lg font-semibold text-foreground">Accent</h3>
              <p className="mt-2 text-sm text-accent-foreground">
                <span className="rounded-md bg-accent px-2 py-1 text-xs font-medium text-accent-foreground">
                  Amber accent
                </span>
              </p>
            </BentoCard>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <BentoCard size="wide" className="min-h-32">
              <h3 className="text-lg font-semibold text-foreground">Wide</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Spans the full 3-column width — good for a testimonial or CTA
                strip.
              </p>
            </BentoCard>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <BentoCard size="medium" className="h-full min-h-32">
              <h3 className="text-lg font-semibold text-foreground">Medium</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Spans 2 columns, 1 row.
              </p>
            </BentoCard>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <BentoCard size="small" className="h-full min-h-32">
              <h3 className="text-lg font-semibold text-foreground">Small</h3>
              <p className="mt-2 text-sm text-muted-foreground">1×1 tile.</p>
            </BentoCard>
          </motion.div>
        </motion.div>
      </SectionContainer>
    </main>
  );
}
