import { useEffect, useState } from 'react';

/**
 * Tracks which of the given section ids is currently "active" (roughly:
 * the one occupying the top of the viewport), via IntersectionObserver.
 * Used for nav-link highlighting as the user scrolls.
 *
 * `sectionIds` should be referentially stable (e.g. computed once via
 * useMemo with an empty dep array) — a new array identity on every render
 * would tear down and recreate the observer needlessly.
 */
export function useActiveSection(sectionIds: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    // Consider a section "active" once it's within the top third of the
    // viewport and until it's mostly scrolled past — approximates "the
    // section the user is currently reading" better than a plain
    // fully-visible check.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const topMost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b
        );
        setActiveId(topMost.target.id);
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}
