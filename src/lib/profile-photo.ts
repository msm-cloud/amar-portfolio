/**
 * lib/profile-photo.ts
 * ---------------------
 * Shared constraints for the Hero profile photo upload, used by both
 * components/admin/SiteSettingsForm.tsx (pre-upload validation, for fast
 * feedback) and server/actions/settings.ts's updateSiteSettings (the
 * actual authoritative check - the client-side one is a convenience,
 * never trust it alone). Kept in one place so the two can't drift apart.
 */
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5MB
export const ALLOWED_PHOTO_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];
