/**
 * lib/utils.ts
 * ------------
 * Shared, generic utility functions used across the app. Keep this file
 * framework-agnostic (no React/Next imports) — component-specific helpers
 * belong next to the component instead.
 */

/**
 * Merge class names, filtering out falsy values.
 * Minimal stand-in for `clsx`/`cn` until (if) that dependency is added.
 */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * First letter of up to the first two words of a name, e.g. "Rina Chowdhury"
 * -> "RC". Used for the colored-circle avatar fallback wherever a real
 * `avatar_url`/`image_url` isn't set (testimonials today; any future
 * person-with-photo feature can reuse this instead of re-deriving it).
 */
export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const initials = words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
  return initials || '?';
}
