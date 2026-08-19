import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

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
        'rounded-2xl border border-white/20 bg-white/60 p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5',
        className
      )}
    >
      {children}
    </div>
  );
}
