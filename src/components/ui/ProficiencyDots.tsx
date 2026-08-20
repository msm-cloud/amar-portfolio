import { cn } from '@/lib/utils';

const MAX_LEVEL = 5;

/**
 * Subtle proficiency indicator: filled/unfilled dots rather than a
 * percentage or progress bar. `level` is 1-5 filled dots out of 5 total.
 *
 * Accessible via a single `role="img"` + `aria-label` on the group (pass
 * a human label like "Advanced" if you have one, otherwise it falls back
 * to "N out of 5") — the individual dots are decorative and hidden from
 * assistive tech to avoid reading out 5 meaningless items.
 */
export function ProficiencyDots({
  level,
  label,
  className,
}: {
  level: number;
  label?: string;
  className?: string;
}) {
  const clampedLevel = Math.max(0, Math.min(MAX_LEVEL, level));

  return (
    <div
      role="img"
      aria-label={
        label
          ? `Proficiency: ${label}`
          : `Proficiency: ${clampedLevel} out of ${MAX_LEVEL}`
      }
      className={cn('flex items-center gap-1', className)}
    >
      {Array.from({ length: MAX_LEVEL }, (_, i) => (
        <span
          key={i}
          aria-hidden
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            i < clampedLevel ? 'bg-primary' : 'bg-border'
          )}
        />
      ))}
    </div>
  );
}
