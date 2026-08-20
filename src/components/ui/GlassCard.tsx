import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Glassmorphism card: translucent surface + backdrop blur + subtle border.
 * Uses semantic tokens (--card, --border) rather than hardcoded colors, so
 * it adapts automatically when the `.dark` class toggles — no `dark:`
 * variants needed here.
 */
export function GlassCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border/60 bg-card/60 p-8 shadow-xl backdrop-blur-xl',
        className
      )}
    >
      {children}
    </div>
  );
}
