'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { buttonVariants } from '@/components/ui/Button';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { fadeInUp, staggerContainer } from '@/lib/animations';

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

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
            {/* PLACEHOLDER - replace via admin panel */}
            Shahid
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl font-medium text-primary sm:text-2xl"
          >
            {/* PLACEHOLDER - replace via admin panel */}
            Web Developer &amp; Graphic Designer — Building Digital Solutions
            for Financial Institutions
          </motion.p>

          <motion.p
            variants={fadeInUp}
            className="max-w-xl text-base text-muted-foreground sm:text-lg"
          >
            {/* PLACEHOLDER - replace via admin panel */}
            With years of experience spanning web development, graphic design,
            and financial-sector administration, I build reliable, polished
            digital solutions that hold up under real operational demands.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-2">
            {/* Scrolls to the Projects section once it's built (later step) */}
            <a
              href="#projects"
              className={buttonVariants({ variant: 'primary', size: 'lg' })}
            >
              View Projects
            </a>
            {/* PLACEHOLDER - replace via admin panel */}
            <a
              href="#"
              className={buttonVariants({ variant: 'outline', size: 'lg' })}
            >
              Download Resume
            </a>
          </motion.div>
        </motion.div>
      </SectionContainer>
    </section>
  );
}
