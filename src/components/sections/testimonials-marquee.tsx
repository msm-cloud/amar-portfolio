'use client';

import Image from 'next/image';
import { useReducedMotion } from 'framer-motion';
import { MessageSquareQuote } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useLanguage } from '@/lib/language-context';
import { pickBilingual } from '@/lib/placeholder-data';
import { cn, getInitials } from '@/lib/utils';
import type { Database } from '@/types/database';

type TestimonialRow = Database['public']['Tables']['testimonials']['Row'];

// The design system only has two brand accent tokens (--primary, --accent -
// see globals.css), so the avatar circles cycle between those two rather
// than introducing off-system colors. Alternating means neighboring cards
// in the marquee never repeat the same tint back-to-back.
const AVATAR_STYLES = ['bg-primary/10 text-primary', 'bg-accent/15 text-accent'];

function TestimonialCard({
  testimonial,
  colorIndex,
}: {
  testimonial: TestimonialRow;
  colorIndex: number;
}) {
  const { language } = useLanguage();
  const content = pickBilingual(
    testimonial.content,
    testimonial.content_bn,
    language
  );
  // author_title has no admin-editable _bn field yet (only content does -
  // see TestimonialForm), but the column exists and older seeded rows have
  // it filled in, so still read it via pickBilingual rather than dropping
  // it. author_company has no _bn column at all (proper noun).
  const title = pickBilingual(
    testimonial.author_title ?? '',
    testimonial.author_title_bn,
    language
  );
  const subtitle = [title, testimonial.author_company]
    .filter(Boolean)
    .join(' · ');

  return (
    <GlassCard className="flex w-80 shrink-0 flex-col gap-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl sm:w-96">
      <p className="text-sm leading-relaxed text-foreground">
        &ldquo;{content}&rdquo;
      </p>
      <div className="mt-auto flex items-center gap-3">
        {testimonial.avatar_url ? (
          // unoptimized: avatar URLs are free-text admin input, so there's
          // no fixed set of hosts to whitelist in next.config.ts's
          // images.remotePatterns the way CoverImage eventually will need
          // for Supabase Storage - this just renders the image as-is,
          // skipping next/image's optimization pipeline.
          <Image
            src={testimonial.avatar_url}
            alt=""
            aria-hidden
            unoptimized
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
              AVATAR_STYLES[colorIndex % AVATAR_STYLES.length]
            )}
          >
            {getInitials(testimonial.author_name)}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {testimonial.author_name}
          </p>
          {subtitle && (
            <p className="truncate text-xs text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </GlassCard>
  );
}

export function TestimonialsMarquee({
  testimonials,
  error,
}: {
  testimonials: TestimonialRow[];
  error: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (error) {
    return (
      <p className="text-sm text-red-600 dark:text-red-400">
        Failed to load testimonials. Please refresh and try again.
      </p>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-12 text-center">
        <MessageSquareQuote
          className="mx-auto h-8 w-8 text-muted-foreground"
          aria-hidden
        />
        <p className="mt-4 text-sm text-muted-foreground">
          No testimonials yet — check back soon.
        </p>
      </div>
    );
  }

  if (shouldReduceMotion) {
    // prefers-reduced-motion: a static grid, no animation at all, rather
    // than just freezing the marquee mid-scroll.
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
            colorIndex={index}
          />
        ))}
      </div>
    );
  }

  return (
    // Track is the list rendered twice back-to-back, animated exactly
    // -50% via the `marquee` keyframe (globals.css) - since both halves
    // are identical, the loop point is invisible, however many
    // testimonials there are or however wide the cards render. `group`
    // + `group-hover:[animation-play-state:paused]` pauses the whole
    // track on hover so a reader can finish a card; the edge mask fades
    // cards in/out instead of hard-cutting them at the container edge.
    <div className="group overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
      <div
        className={cn(
          'flex w-max gap-4',
          'animate-marquee group-hover:[animation-play-state:paused]',
          // Slower on mobile (more time to read per card on a narrow
          // screen), a bit brisker from sm: up.
          '[--marquee-duration:60s] sm:[--marquee-duration:40s]'
        )}
      >
        {[...testimonials, ...testimonials].map((testimonial, index) => (
          <TestimonialCard
            key={`${testimonial.id}-${index}`}
            testimonial={testimonial}
            colorIndex={index}
          />
        ))}
      </div>
    </div>
  );
}
