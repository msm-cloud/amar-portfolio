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
