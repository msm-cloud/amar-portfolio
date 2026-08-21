-- ============================================================================
-- Amar Portfolio — "profile-photos" Storage bucket
-- ============================================================================
-- Public bucket for the Hero section's profile photo upload
-- (site_settings.profile_photo_url). Storage buckets/policies are just
-- regular Postgres tables (storage.buckets / storage.objects) under RLS,
-- so this is a normal migration like any other - no separate Dashboard
-- step needed, though the Dashboard's Storage UI would show the same
-- result if you'd rather click through it instead.
-- ============================================================================

-- `public = true` serves objects over a plain public URL with no signed-
-- token requirement (what getPublicUrl() in the app expects). The
-- `on conflict do nothing` makes this safe to re-run if the bucket
-- somehow already exists.
insert into storage.buckets (id, name, public)
values ('profile-photos', 'profile-photos', true)
on conflict (id) do nothing;

-- Public read - belt-and-suspenders alongside the bucket's own `public`
-- flag above (RLS on storage.objects still gates listing/reading rows
-- through the API even for a "public" bucket).
create policy "profile_photos_select_public"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'profile-photos');

-- Only admin/editor accounts can upload/replace/remove files here -
-- reuses the same is_admin_or_editor() helper every other write policy
-- in this app uses.
create policy "profile_photos_insert_admin_editor"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'profile-photos' and public.is_admin_or_editor());

create policy "profile_photos_update_admin_editor"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'profile-photos' and public.is_admin_or_editor())
  with check (bucket_id = 'profile-photos' and public.is_admin_or_editor());

create policy "profile_photos_delete_admin_editor"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'profile-photos' and public.is_admin_or_editor());
