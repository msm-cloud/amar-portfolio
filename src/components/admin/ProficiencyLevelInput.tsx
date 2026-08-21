'use client';

import { cn } from '@/lib/utils';

const MAX_LEVEL = 5;

/**
 * Clickable 1-5 dot picker for `skills.proficiency_level` - same dot
 * styling as the public `ProficiencyDots` (components/ui/), but
 * interactive. Kept as a separate admin-only component rather than adding
 * an onClick prop to ProficiencyDots itself, since that one is a public,
 * presentational-only primitive used on the live site.
 */
export function ProficiencyLevelInput({
  name,
  value,
  onChange,
}: {
  name: string;
  value: number;
  onChange: (level: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-muted-foreground">
        Proficiency Level
      </label>
      <input type="hidden" name={name} value={value} readOnly />
      <div className="flex items-center gap-1.5">
        {Array.from({ length: MAX_LEVEL }, (_, i) => {
          const level = i + 1;
          return (
            <button
              key={level}
              type="button"
              onClick={() => onChange(level)}
              aria-label={`Set proficiency to ${level} out of ${MAX_LEVEL}`}
              aria-pressed={value === level}
              className="p-0.5"
            >
              <span
                aria-hidden
                className={cn(
                  'block h-3 w-3 rounded-full transition-colors',
                  level <= value
                    ? 'bg-primary'
                    : 'bg-border hover:bg-muted-foreground/40'
                )}
              />
            </button>
          );
        })}
        <span className="ml-2 text-sm text-muted-foreground">{value} / 5</span>
      </div>
    </div>
  );
}
