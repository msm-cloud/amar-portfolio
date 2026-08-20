import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Small pill for a category/tag label. Defaults to the primary-tinted
 * style (for the main category); pass `className` to restyle for a
 * secondary look (e.g. individual tags — see ProjectCard).
 */
export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary',
        className
      )}
    >
      {children}
    </span>
  );
}
