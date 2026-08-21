'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Code2 } from 'lucide-react';
import { BentoCard } from '@/components/ui/BentoCard';
import { useTranslation } from '@/lib/use-translation';
import { cn } from '@/lib/utils';

const GITHUB_USERNAME = 'msm-cloud';
// ghchart.rshah.org renders a GitHub-style contribution heatmap as an SVG
// straight from the user's public contribution data - a plain <img>, no
// API key/auth and no rate limit the way the GitHub REST API would need.
// Color matches --color-indigo-500 (globals.css) for brand consistency.
const CHART_URL = `https://ghchart.rshah.org/6366f1/${GITHUB_USERNAME}`;

/**
 * Small "GitHub Activity" card - lucide-react has no GitHub logo (same
 * reason Footer's social icons use Code2 instead of a real mark), so this
 * reuses that same generic icon for consistency.
 *
 * The chart is a remote SVG from a third-party service, so it gets its
 * own loading skeleton and error fallback rather than trusting it to
 * always be fast/up - `unoptimized` on next/image skips Next's image
 * pipeline (no point optimizing an SVG it doesn't control), same choice
 * made for testimonial avatar URLs elsewhere in this app.
 */
export function GithubActivityCard() {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(
    'loading'
  );
  const { t } = useTranslation();

  return (
    <BentoCard className="flex flex-col gap-3">
      <a
        href={`https://github.com/${GITHUB_USERNAME}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex w-fit items-center gap-2"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary/20">
          <Code2 className="h-4 w-4" aria-hidden />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-foreground transition-colors duration-200 group-hover:text-primary">
            {t('github.heading')}
          </h3>
          <p className="text-xs text-muted-foreground">
            github.com/{GITHUB_USERNAME}
          </p>
        </div>
      </a>

      <div className="relative h-[140px] w-full overflow-x-auto">
        {status === 'error' ? (
          <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
            {t('github.loadError')}
          </p>
        ) : (
          <>
            {status === 'loading' && (
              <div
                aria-hidden
                className="absolute inset-0 animate-pulse rounded-lg bg-muted"
              />
            )}
            <Image
              src={CHART_URL}
              alt={`${GITHUB_USERNAME}'s GitHub contribution activity`}
              unoptimized
              width={720}
              height={112}
              className={cn(
                'min-w-[600px]',
                status !== 'loaded' && 'opacity-0'
              )}
              onLoad={() => setStatus('loaded')}
              onError={() => setStatus('error')}
            />
          </>
        )}
      </div>
    </BentoCard>
  );
}
