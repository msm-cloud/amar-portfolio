/**
 * types/
 * -----
 * Shared TypeScript types and interfaces used across the app.
 * Keep this file for cross-cutting types (e.g. nav items, site config shape).
 * Feature-specific types can live closer to their feature once the app grows.
 */

export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
}
