-- ============================================================================
-- Amar Portfolio — "content-images" Storage bucket
-- ============================================================================
-- Public bucket for images uploaded from the admin panel: project cover
-- images and images inserted into rich-text content (projects, blog posts).
-- Same shape as the "profile-photos" bucket: public read, writes limited to
-- admin/editor accounts via public.is_admin_or_editor().
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('content-images', 'content-images', true)
on conflict (id) do nothing;

create policy "content_images_select_public"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'content-images');

create policy "content_images_insert_admin_editor"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'content-images' and public.is_admin_or_editor());

create policy "content_images_update_admin_editor"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'content-images' and public.is_admin_or_editor())
  with check (bucket_id = 'content-images' and public.is_admin_or_editor());

create policy "content_images_delete_admin_editor"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'content-images' and public.is_admin_or_editor());
