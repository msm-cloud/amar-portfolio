-- ============================================================================
-- Amar Portfolio — site_settings (Hero/About content, singleton)
-- ============================================================================
-- Holds the Hero + About sections' content (name, tagline, bio, the 3
-- stat cards, profile photo) that used to be hardcoded placeholder text
-- in Hero.tsx/About.tsx - editable from /admin/settings from now on.
--
-- Singleton pattern: `id integer primary key default 1 check (id = 1)`
-- guarantees exactly one row can ever exist - inserting a second row with
-- id = 1 violates the primary key, and any other id violates the check
-- constraint. There's deliberately no insert/delete RLS policy below (see
-- the note there): the app only ever needs to read the one row and
-- update it in place, never create or remove it.
-- ============================================================================

create table public.site_settings (
  id integer primary key default 1 check (id = 1),
  full_name text not null,
  full_name_bn text,
  tagline text,
  tagline_bn text,
  hero_description text,
  hero_description_bn text,
  about_bio text,
  about_bio_bn text,
  profile_photo_url text,
  stat_1_value text,
  stat_1_label text,
  stat_1_value_bn text,
  stat_1_label_bn text,
  stat_2_value text,
  stat_2_label text,
  stat_2_value_bn text,
  stat_2_label_bn text,
  stat_3_value text,
  stat_3_label text,
  stat_3_value_bn text,
  stat_3_label_bn text,
  updated_at timestamptz not null default now()
);

comment on table public.site_settings is 'Singleton config for the Hero/About sections'' content - always exactly one row (id = 1).';

-- Reuses the same set_updated_at() trigger function already defined for
-- projects/blog_posts in the initial migration.
create trigger set_site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- Seed the single row with the same content Hero.tsx/About.tsx had
-- hardcoded, so the site's copy doesn't change the moment this ships -
-- only the admin panel becomes the way to edit it from here on.
insert into public.site_settings (
  id, full_name, full_name_bn, tagline, tagline_bn,
  hero_description, hero_description_bn, about_bio, about_bio_bn,
  profile_photo_url,
  stat_1_value, stat_1_label, stat_1_value_bn, stat_1_label_bn,
  stat_2_value, stat_2_label, stat_2_value_bn, stat_2_label_bn,
  stat_3_value, stat_3_label, stat_3_value_bn, stat_3_label_bn
) values (
  1,
  'Shahid',
  'শাহিদ',
  'Web Developer & Graphic Designer — Building Digital Solutions for Financial Institutions',
  'ওয়েব ডেভেলপার ও গ্রাফিক ডিজাইনার — আর্থিক প্রতিষ্ঠানের জন্য ডিজিটাল সমাধান তৈরি করি',
  'With years of experience spanning web development, graphic design, and financial-sector administration, I build reliable, polished digital solutions that hold up under real operational demands.',
  'ওয়েব ডেভেলপমেন্ট, গ্রাফিক ডিজাইন এবং আর্থিক খাতের প্রশাসনিক কাজে বছরের অভিজ্ঞতা নিয়ে, আমি এমন নির্ভরযোগ্য ও পরিপাটি ডিজিটাল সমাধান তৈরি করি যা বাস্তব কর্মক্ষেত্রের চাপ সামলাতে সক্ষম।',
  'I''m a web developer and graphic designer who also spent years in financial-sector administration — a combination that shapes how I build. I care about interfaces that are not just visually polished but genuinely dependable under real operational load, the same standard I held to when handling day-to-day financial operations. I work across the full stack, from backend data models to pixel-level design details. My goal on every project is software that a financial institution could actually trust in production, not just a portfolio piece.',
  'আমি একজন ওয়েব ডেভেলপার ও গ্রাফিক ডিজাইনার, যিনি একই সাথে বছরের পর বছর আর্থিক খাতের প্রশাসনিক কাজেও যুক্ত ছিলেন — এই মিশ্রণই আমার কাজের ধরন গড়ে তুলেছে। আমি এমন ইন্টারফেস তৈরিতে বিশ্বাসী যা শুধু দৃষ্টিনন্দনই নয়, বরং বাস্তব কর্মচাপেও নির্ভরযোগ্য — ঠিক যে মানদণ্ড আমি প্রতিদিনের আর্থিক কার্যক্রম পরিচালনার সময় বজায় রেখেছি। আমি ব্যাকএন্ড ডেটা মডেল থেকে শুরু করে পিক্সেল পর্যায়ের ডিজাইন খুঁটিনাটি পর্যন্ত, পুরো স্ট্যাক জুড়ে কাজ করি। প্রতিটি প্রজেক্টে আমার লক্ষ্য এমন সফটওয়্যার তৈরি করা, যা একটি আর্থিক প্রতিষ্ঠান সত্যিকার অর্থে প্রোডাকশনে বিশ্বাস করতে পারে — শুধু পোর্টফোলিওর জন্য নয়।',
  null,
  '5+', 'Years Experience', '৫+', 'বছরের অভিজ্ঞতা',
  'Web + Design', 'Dev & Graphic Design', 'ওয়েব + ডিজাইন', 'ডেভেলপমেন্ট ও গ্রাফিক ডিজাইন',
  'Financial Sector', 'Operations Background', 'আর্থিক খাত', 'অপারেশনাল অভিজ্ঞতা'
);

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table public.site_settings enable row level security;

create policy "site_settings_select_public"
  on public.site_settings for select
  to anon, authenticated
  using (true);

-- Update-only, deliberately - see the singleton note at the top of this
-- file. Admins/editors edit the one row in place; nothing in the app
-- ever needs to insert a second one or delete the only one.
create policy "site_settings_write_admin_editor"
  on public.site_settings for update
  to authenticated
  using (public.is_admin_or_editor())
  with check (public.is_admin_or_editor());
