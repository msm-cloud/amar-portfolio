-- supabase/seed_certifications.sql
--
-- One-time seed: inserts the same 4 certifications that used to live as
-- static placeholder data (src/lib/placeholder-data.ts, now retired) as
-- real rows in the `certifications` table.
--
-- Run once via the Supabase Dashboard: SQL Editor -> New query -> paste
-- this entire file -> Run.
--
-- Same "only if empty" idempotency guard as seed_skills.sql -
-- certifications has no natural unique column to use `on conflict` with.

do $$
begin
  if not exists (select 1 from public.certifications limit 1) then
    insert into public.certifications (
      title, title_bn, issuing_organization, issuing_organization_bn,
      issue_date, credential_url, image_url, display_order
    ) values

    (
      'B.Sc. in Computer Science',
      'কম্পিউটার সায়েন্সে বি.এসসি.',
      'University of Dhaka',
      'ঢাকা বিশ্ববিদ্যালয়',
      '2018-12-01',
      null,
      null,
      1
    ),

    (
      'Diploma in Banking',
      'ব্যাংকিং-এ ডিপ্লোমা',
      'Bangladesh Institute of Bank Management (BIBM)',
      'বাংলাদেশ ইনস্টিটিউট অফ ব্যাংক ম্যানেজমেন্ট (বিআইবিএম)',
      '2022-03-01',
      'https://example.com',
      null,
      2
    ),

    (
      'Meta Front-End Developer Professional Certificate',
      'মেটা ফ্রন্ট-এন্ড ডেভেলপার প্রফেশনাল সার্টিফিকেট',
      'Meta (via Coursera)',
      'মেটা (কোর্সেরার মাধ্যমে)',
      '2023-08-01',
      'https://example.com',
      null,
      3
    ),

    (
      'Adobe Certified Professional — Photoshop',
      'অ্যাডোবি সার্টিফাইড প্রফেশনাল — ফটোশপ',
      'Adobe',
      'অ্যাডোবি',
      '2020-05-01',
      'https://example.com',
      null,
      4
    );
  end if;
end $$;
