-- ============================================================================
-- Amar Portfolio — site_settings.resume_url
-- ============================================================================
-- Adds the Hero section's "Download Resume" button target - an admin-
-- uploaded PDF's public URL (see the "resume" Storage bucket added
-- alongside this in 20260821090300_resume_storage.sql). Nullable: the
-- button hides itself entirely on the public site until a resume has
-- actually been uploaded (see hero-content.tsx) - no migration-time
-- default/seed value needed the way site_settings' other columns got one.
-- ============================================================================

alter table public.site_settings add column resume_url text;
