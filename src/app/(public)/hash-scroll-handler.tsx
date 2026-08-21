'use client';

import { useEffect } from 'react';

/**
 * Jumps to the section named by the URL's hash (e.g. "#testimonials") on
 * mount, instead of relying on the browser's/Next.js Link's own fragment
 * handling — verified unreliable here: landing on "/#testimonials" (both
 * via a cross-page Link click and a fresh direct navigation) left the
 * page scrolled to the top instead of at the section.
 *
 * Renders nothing - side-effect only. Mounted once on the homepage
 * (app/(public)/page.tsx), the only page with these section ids.
 * SectionNavLink (components/ui/) handles the separate "already on the
 * homepage, clicked a nav link" case itself, since that's a same-page
 * click needing a *smooth* scroll, not a jump on load.
 */
export function HashScrollHandler() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const id = hash.slice(1);
    const target = document.getElementById(id);
    target?.scrollIntoView({ behavior: 'auto', block: 'start' });
  }, []);

  return null;
}
