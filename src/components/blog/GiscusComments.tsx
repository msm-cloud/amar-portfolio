'use client';

import Giscus from '@giscus/react';
import { useTheme } from 'next-themes';
import { useHasMounted } from '@/hooks/useHasMounted';
import { useLanguage } from '@/lib/language-context';

/**
 * Giscus (GitHub Discussions) comment widget for blog posts. Theme is
 * synced with next-themes' resolved theme - @giscus/react re-posts the
 * theme to its iframe whenever the `theme` prop changes, so toggling the
 * site's theme while comments are open updates them live, no extra work
 * needed here beyond passing a reactive value.
 *
 * Gated on useHasMounted(): resolvedTheme is undefined until next-themes
 * has hydrated, and rendering the iframe with a guessed theme first would
 * just cause a visible flash/reload when the real theme kicks in.
 */
export function GiscusComments() {
  const { resolvedTheme } = useTheme();
  const { language } = useLanguage();
  const hasMounted = useHasMounted();

  if (!hasMounted) {
    return <div aria-hidden className="h-40" />;
  }

  return (
    <Giscus
      repo="msm-cloud/amar-portfolio"
      repoId="R_kgDOT9sjLg"
      category="Announcements"
      categoryId="DIC_kwDOT9sjLs4DD0ZK"
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      lang={language === 'bn' ? 'bn' : 'en'}
      loading="lazy"
    />
  );
}
