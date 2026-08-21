/**
 * lib/resume.ts
 * --------------
 * Shared constraints for the Hero resume PDF upload, used by both
 * components/admin/SiteSettingsForm.tsx (pre-upload validation, for fast
 * feedback) and server/actions/settings.ts's updateSiteSettings (the
 * actual authoritative check - never trust the client-side one alone).
 * Same pattern as lib/profile-photo.ts.
 */
export const MAX_RESUME_BYTES = 5 * 1024 * 1024; // 5MB
export const ALLOWED_RESUME_TYPES = ['application/pdf'];
