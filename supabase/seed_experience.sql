-- supabase/seed_experience.sql
--
-- One-time seed: inserts the same 4 experience entries that used to live
-- as static placeholder data (src/lib/placeholder-data.ts, now retired)
-- as real rows in the `experience` table.
--
-- Run once via the Supabase Dashboard: SQL Editor -> New query -> paste
-- this entire file -> Run.
--
-- Same "only if empty" idempotency guard as seed_skills.sql - experience
-- has no natural unique column to use `on conflict` with.

do $$
begin
  if not exists (select 1 from public.experience limit 1) then
    insert into public.experience (
      title, title_bn, organization, organization_bn,
      description, description_bn, start_date, end_date, is_current, display_order
    ) values

    (
      'Freelance Web Developer & Graphic Designer',
      'ফ্রিল্যান্স ওয়েব ডেভেলপার ও গ্রাফিক ডিজাইনার',
      'Self-Employed',
      'স্ব-নিযুক্ত',
      'Design and build websites, web apps, and brand identities for clients — including financial institutions — end to end: from UI design through frontend, backend, and database work.',
      'ক্লায়েন্টদের জন্য ওয়েবসাইট, ওয়েব অ্যাপ এবং ব্র্যান্ড আইডেন্টিটি ডিজাইন ও নির্মাণ করি — আর্থিক প্রতিষ্ঠানসহ — ইউআই ডিজাইন থেকে শুরু করে ফ্রন্টএন্ড, ব্যাকএন্ড ও ডেটাবেজ পর্যন্ত সম্পূর্ণভাবে।',
      '2024-01-01',
      null,
      true,
      1
    ),

    (
      'Operations Officer',
      'অপারেশনস অফিসার',
      'City Savings Cooperative',
      'সিটি সেভিংস কো-অপারেটিভ',
      'Managed daily branch operations, transaction reconciliation, and reporting for a savings cooperative. The same operational rigor — accuracy, auditability, no room for "close enough" — now shapes how I build software.',
      'একটি সেভিংস কো-অপারেটিভের দৈনন্দিন শাখা কার্যক্রম, লেনদেন মিলকরণ এবং প্রতিবেদন প্রস্তুতির দায়িত্ব পালন করেছি। নির্ভুলতা ও জবাবদিহিতার সেই একই কঠোর মান — যেখানে "মোটামুটি ঠিক আছে" বলে কিছু নেই — এখন আমার সফটওয়্যার তৈরির ধরনকে প্রভাবিত করে।',
      '2021-06-01',
      '2023-12-31',
      false,
      2
    ),

    (
      'Web Developer',
      'ওয়েব ডেভেলপার',
      'Pixel & Ledger Studio',
      'পিক্সেল অ্যান্ড লেজার স্টুডিও',
      'Built client websites and web apps end to end, handling both frontend design and backend implementation for small-business and local-organization clients.',
      'ক্লায়েন্টদের জন্য ওয়েবসাইট ও ওয়েব অ্যাপ সম্পূর্ণভাবে তৈরি করেছি, ছোট ব্যবসা ও স্থানীয় প্রতিষ্ঠানের ক্লায়েন্টদের জন্য ফ্রন্টএন্ড ডিজাইন ও ব্যাকএন্ড বাস্তবায়ন উভয়ই সামলেছি।',
      '2019-01-01',
      '2021-05-31',
      false,
      3
    ),

    (
      'Graphic Design Intern',
      'গ্রাফিক ডিজাইন ইন্টার্ন',
      'Studio Nirjhor',
      'স্টুডিও নির্ঝর',
      'Assisted senior designers on branding and print projects — logo exploration, packaging mockups, and print-ready file preparation.',
      'সিনিয়র ডিজাইনারদের ব্র্যান্ডিং ও প্রিন্ট প্রজেক্টে সহায়তা করেছি — লোগো এক্সপ্লোরেশন, প্যাকেজিং মকআপ এবং প্রিন্ট-রেডি ফাইল প্রস্তুতিতে।',
      '2018-06-01',
      '2018-12-31',
      false,
      4
    );
  end if;
end $$;
