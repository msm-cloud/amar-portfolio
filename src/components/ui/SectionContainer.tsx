import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Consistent max-width + horizontal padding wrapper. Wrap every page
 * section's content in this so spacing/alignment stays uniform site-wide.
 */
export function SectionContainer({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        'mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8',
        className
      )}
    >
      {children}
    </section>
  );
}
