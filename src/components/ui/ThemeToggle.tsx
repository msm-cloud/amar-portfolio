'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useHasMounted } from '@/hooks/useHasMounted';
import { cn } from '@/lib/utils';

/**
 * Sun/moon toggle between light and dark theme. Persists via next-themes
 * (localStorage), defaulting to the system preference until the user
 * overrides it.
 *
 * Renders an empty placeholder until mounted: the resolved theme is
 * genuinely unknown on the server (it depends on the browser's stored
 * preference), so rendering an icon before mount would either mismatch
 * hydration or flash the wrong icon.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const hasMounted = useHasMounted();

  if (!hasMounted) {
    return <div aria-hidden className={cn('h-9 w-9 rounded-lg', className)} />;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
