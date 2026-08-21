'use client';

import { useReducedMotion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useLanguage } from '@/lib/language-context';
import { useTranslation } from '@/lib/use-translation';
import {
  pickBilingual,
  PLACEHOLDER_TESTIMONIALS,
  type PlaceholderTestimonial,
} from '@/lib/placeholder-data';
import { cn, getInitials } from '@/lib/utils';

// The design system only has two brand accent tokens (--primary, --accent -
// see globals.css), so the avatar circles cycle between those two rather
// than introducing off-system colors. Alternating means neighboring cards
// in the marquee never repeat the same tint back-to-back.
const AVATAR_STYLES = ['bg-primary/10 text-primary', 'bg-accent/15 text-accent'];

function TestimonialCard({
  testimonial,
  colorIndex,
}: {
  testimonial: PlaceholderTestimonial;
  colorIndex: number;
}) {
  const { language } = useLanguage();
  const content = pickBilingual(
    testimonial.content,
    testimonial.content_bn,
    language
  );
  const title = pickBilingual(
    testimonial.author_title ?? '',
    testimonial.author_title_bn,
    language
  );
  // author_company has no _bn column (proper noun - see placeholder-data.ts).
  const subtitle = [title, testimonial.author_company]
    .filter(Boolean)
    .join(' · ');

  return (
    <GlassCard className="flex w-80 shrink-0 flex-col gap-4 sm:w-96">
      <p className="text-sm leading-relaxed text-foreground">
        &ldquo;{content}&rdquo;
      </p>
      <div className="mt-auto flex items-center gap-3">
        <span
          aria-hidden
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
            AVATAR_STYLES[colorIndex % AVATAR_STYLES.length]
          )}
        >
          {getInitials(testimonial.author_name)}
        </span>
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

export function Testimonials() {
  const shouldReduceMotion = useReducedMotion();
  const { t } = useTranslation();

  return (
    <SectionContainer id="testimonials">
      <SectionHeading
        eyebrow={t('testimonials.eyebrow')}
        title={t('testimonials.title')}
      />

      {shouldReduceMotion ? (
        // prefers-reduced-motion: a static grid, no animation at all,
        // rather than just freezing the marquee mid-scroll.
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PLACEHOLDER_TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              colorIndex={index}
            />
          ))}
        </div>
      ) : (
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
            {[...PLACEHOLDER_TESTIMONIALS, ...PLACEHOLDER_TESTIMONIALS].map(
              (testimonial, index) => (
                <TestimonialCard
                  key={`${testimonial.id}-${index}`}
                  testimonial={testimonial}
                  colorIndex={index}
                />
              )
            )}
          </div>
        </div>
      )}
    </SectionContainer>
  );
}
