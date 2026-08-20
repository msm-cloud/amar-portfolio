import Image from 'next/image';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Cover image with a graceful fallback: renders a real image when `src`
 * is set, otherwise a soft primary/accent gradient with a centered icon.
 * Used wherever content (projects, blog posts, ...) may not have a real
 * cover image yet.
 */
export function CoverImage({
  src,
  alt,
  icon: Icon,
  className,
}: {
  src: string | null;
  alt: string;
  icon: LucideIcon;
  className?: string;
}) {
  if (src) {
    // NOTE: once real cover images come from Supabase Storage, that
    // host will need adding to `images.remotePatterns` in
    // next.config.ts, or next/image will refuse to optimize it.
    return (
      <div className={cn('relative overflow-hidden bg-muted', className)}>
        <Image src={src} alt={alt} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        'flex items-center justify-center bg-gradient-to-br from-primary/20 via-accent/10 to-transparent',
        className
      )}
    >
      <Icon className="h-10 w-10 text-primary/70" aria-hidden />
    </div>
  );
}
