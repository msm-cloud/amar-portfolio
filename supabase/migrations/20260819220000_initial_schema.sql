-- ============================================================================
-- Amar Portfolio — Initial database schema
-- ============================================================================
-- Tables: profiles, projects, skills, experience, certifications,
--         testimonials, blog_posts, contact_messages
--
-- Design notes:
--   - IDs are uuid (gen_random_uuid()), except `profiles.id`, which IS the
--     Supabase auth.users id (1:1 relationship).
--   - `status` / `role` fields use `text` + `check` constraints rather than
--     Postgres enum types, so adding a new value later is a plain
--     `ALTER TABLE ... DROP CONSTRAINT / ADD CONSTRAINT`, not an enum
--     migration.
--   - Bilingual content: every free-text field a visitor would actually
--     read gets a parallel `<field>_bn` column for Bangla. Fields that are
--     identifiers, URLs, dates, numbers, or booleans do NOT get a `_bn`
--     twin (translating a slug or an image URL makes no sense). `category`
--     fields (projects.category, skills.category) are treated as a
--     controlled vocabulary / filter key, not display prose, so they are
--     also left untranslated — translate their display labels in the UI
--     layer (e.g. an i18n map) instead of duplicating the column, so
--     filtering logic doesn't have to compare across two languages.
--     `author_name` / `author_company` on testimonials are proper nouns
--     and are likewise left untranslated.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ============================================================================
-- profiles
-- ============================================================================
-- One row per Supabase auth user. Created automatically via the
-- handle_new_user() trigger below whenever a new user signs up.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  avatar_url text,
  created_at timestamptz not null default now()
);

comment on table public.profiles is 'One row per auth.users user; carries the admin/editor role used by RLS policies.';

-- Auto-create a profile row whenever a new auth user signs up.
-- New users default to 'editor' — promote the first user to 'admin'
-- manually via SQL (see supabase/migrations/README.md).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- projects
-- ============================================================================

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  title_bn text,
  slug text not null unique,
  description text,
  description_bn text,
  content text,
  content_bn text,
  category text,
  tags text[] not null default '{}',
  cover_image_url text,
  project_url text,
  github_url text,
  is_featured boolean not null default false,
  display_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.projects is 'Portfolio project case studies.';

create index projects_status_idx on public.projects (status);
create index projects_category_idx on public.projects (category);
create index projects_display_order_idx on public.projects (display_order);

-- ============================================================================
-- skills
-- ============================================================================

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_bn text,
  category text,
  proficiency_level integer check (proficiency_level between 1 and 5),
  icon_name text,
  display_order integer not null default 0
);

comment on table public.skills is 'Skills list, grouped by category (Frontend/Backend/Design/Tools/...).';

create index skills_category_idx on public.skills (category);

-- ============================================================================
-- experience
-- ============================================================================

create table public.experience (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  title_bn text,
  organization text not null,
  organization_bn text,
  description text,
  description_bn text,
  start_date date not null,
  end_date date,
  is_current boolean not null default false,
  display_order integer not null default 0,
  constraint experience_end_date_check check (
    is_current = true or end_date is not null
  )
);

comment on table public.experience is 'Work experience timeline entries.';

-- ============================================================================
-- certifications
-- ============================================================================

create table public.certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  title_bn text,
  issuing_organization text not null,
  issuing_organization_bn text,
  issue_date date,
  credential_url text,
  image_url text,
  display_order integer not null default 0
);

comment on table public.certifications is 'Certifications / credentials list.';

-- ============================================================================
-- testimonials
-- ============================================================================

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_title text,
  author_title_bn text,
  author_company text,
  content text not null,
  content_bn text,
  avatar_url text,
  is_featured boolean not null default false,
  display_order integer not null default 0
);

comment on table public.testimonials is 'Client/colleague testimonials.';

-- ============================================================================
-- blog_posts
-- ============================================================================

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  title_bn text,
  slug text not null unique,
  excerpt text,
  excerpt_bn text,
  content text,
  content_bn text,
  cover_image_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  author uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.blog_posts is 'Blog posts, HTML content from a rich text editor (added in a later step).';

create index blog_posts_status_idx on public.blog_posts (status);

-- ============================================================================
-- contact_messages
-- ============================================================================

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

comment on table public.contact_messages is 'Messages submitted via the public contact form.';

-- ============================================================================
-- updated_at auto-touch trigger (projects, blog_posts)
-- ============================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

create trigger set_blog_posts_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

-- ============================================================================
-- Role-check helper functions (security definer, so RLS policies that call
-- these don't recursively re-trigger RLS on `profiles` itself)
-- ============================================================================

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.is_admin_or_editor()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor')
  );
$$;

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.skills enable row level security;
alter table public.experience enable row level security;
alter table public.certifications enable row level security;
alter table public.testimonials enable row level security;
alter table public.blog_posts enable row level security;
alter table public.contact_messages enable row level security;

-- ---- profiles ----
-- Users can read their own profile; admins can read every profile.
-- Only admins can create/modify/delete profiles beyond the signup trigger
-- (which runs as security definer and so is unaffected by RLS).

create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "profiles_select_admin"
  on public.profiles for select
  to authenticated
  using (public.is_admin());

create policy "profiles_write_admin"
  on public.profiles for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---- projects ----

create policy "projects_select_published"
  on public.projects for select
  to anon, authenticated
  using (status = 'published');

create policy "projects_select_admin_editor"
  on public.projects for select
  to authenticated
  using (public.is_admin_or_editor());

create policy "projects_write_admin_editor"
  on public.projects for all
  to authenticated
  using (public.is_admin_or_editor())
  with check (public.is_admin_or_editor());

-- ---- skills (no status field -> always public) ----

create policy "skills_select_public"
  on public.skills for select
  to anon, authenticated
  using (true);

create policy "skills_write_admin_editor"
  on public.skills for all
  to authenticated
  using (public.is_admin_or_editor())
  with check (public.is_admin_or_editor());

-- ---- experience (no status field -> always public) ----

create policy "experience_select_public"
  on public.experience for select
  to anon, authenticated
  using (true);

create policy "experience_write_admin_editor"
  on public.experience for all
  to authenticated
  using (public.is_admin_or_editor())
  with check (public.is_admin_or_editor());

-- ---- certifications (no status field -> always public) ----

create policy "certifications_select_public"
  on public.certifications for select
  to anon, authenticated
  using (true);

create policy "certifications_write_admin_editor"
  on public.certifications for all
  to authenticated
  using (public.is_admin_or_editor())
  with check (public.is_admin_or_editor());

-- ---- testimonials (no status field -> always public) ----

create policy "testimonials_select_public"
  on public.testimonials for select
  to anon, authenticated
  using (true);

create policy "testimonials_write_admin_editor"
  on public.testimonials for all
  to authenticated
  using (public.is_admin_or_editor())
  with check (public.is_admin_or_editor());

-- ---- blog_posts ----

create policy "blog_posts_select_published"
  on public.blog_posts for select
  to anon, authenticated
  using (status = 'published');

create policy "blog_posts_select_admin_editor"
  on public.blog_posts for select
  to authenticated
  using (public.is_admin_or_editor());

create policy "blog_posts_write_admin_editor"
  on public.blog_posts for all
  to authenticated
  using (public.is_admin_or_editor())
  with check (public.is_admin_or_editor());

-- ---- contact_messages ----
-- Anyone (including anonymous visitors) can submit the contact form.
-- Only admins/editors can read, mark as read, or delete messages.

create policy "contact_messages_insert_public"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

create policy "contact_messages_select_admin_editor"
  on public.contact_messages for select
  to authenticated
  using (public.is_admin_or_editor());

create policy "contact_messages_update_admin_editor"
  on public.contact_messages for update
  to authenticated
  using (public.is_admin_or_editor())
  with check (public.is_admin_or_editor());

create policy "contact_messages_delete_admin_editor"
  on public.contact_messages for delete
  to authenticated
  using (public.is_admin_or_editor());
