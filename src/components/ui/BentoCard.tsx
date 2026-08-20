import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type BentoCardSize = 'small' | 'medium' | 'large' | 'wide';

// Assumes a parent grid of 3 columns on sm+ (see the demo page for the
// matching `grid grid-cols-1 sm:grid-cols-3` container).
const SIZE_CLASSES: Record<BentoCardSize, string> = {
  small: 'sm:col-span-1 sm:row-span-1',
  medium: 'sm:col-span-2 sm:row-span-1',
  large: 'sm:col-span-2 sm:row-span-2',
  wide: 'sm:col-span-3 sm:row-span-1',
};

/**
 * Card for a bento-grid layout. `size` controls how many grid columns/rows
 * it spans, so a grid of BentoCards can mix small/medium/large/wide tiles
 * for visual variety.
 */
export function BentoCard({
  children,
  size = 'medium',
  className,
}: {
  children: ReactNode;
  size?: BentoCardSize;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md',
        SIZE_CLASSES[size],
        className
      )}
    >
      {children}
    </div>
  );
}
