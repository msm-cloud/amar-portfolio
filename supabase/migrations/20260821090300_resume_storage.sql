-- ============================================================================
-- Amar Portfolio — "resume" Storage bucket
-- ============================================================================
-- Public bucket for the Hero section's resume PDF upload
-- (site_settings.resume_url). Same pattern as
-- 20260821090100_profile_photos_storage.sql - see that file's own
-- comment for why this is plain SQL rather than a separate Dashboard step.
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('resume', 'resume', true)
on conflict (id) do nothing;

create policy "resume_select_public"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'resume');

create policy "resume_insert_admin_editor"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'resume' and public.is_admin_or_editor());

create policy "resume_update_admin_editor"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'resume' and public.is_admin_or_editor())
  with check (bucket_id = 'resume' and public.is_admin_or_editor());

create policy "resume_delete_admin_editor"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'resume' and public.is_admin_or_editor());
