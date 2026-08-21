'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { MouseEvent, ReactNode } from 'react';
import type { NavItem } from '@/types';

/**
 * Renders a single navItems entry (see config/site.ts) as a Link,
 * correctly handling both href shapes it can have:
 *
 * - A real route (e.g. "/blog") - plain Link navigation, nothing special.
 * - A homepage section anchor (e.g. "/#about") - always points at the
 *   homepage first, not a bare "#about", so it actually navigates
 *   somewhere when clicked from /blog, /projects/[slug], /admin/*, or any
 *   other non-homepage route (the bug this component exists to fix).
 *   Next.js's own Link already scrolls to the hash's element on landing
 *   when navigating cross-page, so that case needs no extra handling.
 *
 *   When already ON the homepage, clicking one of these shouldn't
 *   navigate at all - just scroll smoothly to the section. Link's default
 *   same-page hash handling can't be relied on for this consistently, so
 *   that case is handled explicitly: preventDefault, scrollIntoView, and
 *   sync the address bar via pushState (matching what a plain in-page
 *   `<a href="#id">` used to do here, before this component existed).
 */
export function SectionNavLink({
  item,
  className,
  onNavigate,
  children,
}: {
  item: NavItem;
  className?: string;
  onNavigate?: () => void;
  children: ReactNode;
}) {
  const pathname = usePathname();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onNavigate?.();

    if (!item.href.startsWith('/#') || pathname !== '/') {
      return;
    }

    event.preventDefault();
    const id = item.key ?? item.href.slice(2);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', item.href);
    }
  }

  return (
    <Link href={item.href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
