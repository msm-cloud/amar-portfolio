-- supabase/seed_testimonials.sql
--
-- One-time seed: inserts the same 6 testimonials that used to live as
-- static placeholder data (src/lib/placeholder-data.ts, now retired) as
-- real rows in the `testimonials` table.
--
-- Run once via the Supabase Dashboard: SQL Editor -> New query -> paste
-- this entire file -> Run.
--
-- Same "only if empty" idempotency guard as seed_skills.sql etc. -
-- testimonials has no natural unique column to use `on conflict` with.
--
-- `avatar_url` is null throughout (no real photos yet) - the admin form
-- and public marquee both fall back to the author's initials in a
-- colored circle when it's blank.

do $$
begin
  if not exists (select 1 from public.testimonials limit 1) then
    insert into public.testimonials (
      author_name, author_title, author_title_bn, author_company,
      content, content_bn, avatar_url, is_featured, display_order
    ) values

    (
      'Tanvir Ahmed',
      'Operations Manager',
      'অপারেশনস ম্যানেজার',
      'NexaBank',
      'The operations dashboard he built cut our end-of-day reporting from a full afternoon to about twenty minutes. What made the difference is that he''d actually worked in banking operations himself, so he understood what we needed before we finished explaining it.',
      'তিনি যে অপারেশনস ড্যাশবোর্ড তৈরি করেছেন, তা আমাদের দিন-শেষের রিপোর্টিং একটা পুরো বিকেল থেকে কমিয়ে মাত্র বিশ মিনিটে নামিয়ে এনেছে। পার্থক্যটা তৈরি হয়েছে কারণ তিনি নিজেই ব্যাংকিং অপারেশনসে কাজ করেছেন, তাই আমরা বোঝানো শেষ করার আগেই তিনি আমাদের প্রয়োজন বুঝে ফেলেছিলেন।',
      null,
      true,
      1
    ),

    (
      'Rina Chowdhury',
      'Product Manager',
      'প্রোডাক্ট ম্যানেজার',
      'Loopline Technologies',
      'Shahid rebuilt our marketing site from scratch and it''s the first version we''ve actually been proud to link people to. Fast, clean, and he explained every decision instead of just handing over a black box.',
      'শাহিদ আমাদের মার্কেটিং সাইটটি একদম নতুন করে তৈরি করে দিয়েছেন, এবং এটাই প্রথম ভার্সন যা আমরা গর্বের সাথে অন্যদের সাথে শেয়ার করতে পারি। দ্রুত, পরিচ্ছন্ন, এবং প্রতিটি সিদ্ধান্তের কারণ তিনি ব্যাখ্যা করেছেন, শুধু একটা ''ব্ল্যাক বক্স'' ধরিয়ে দেননি।',
      null,
      true,
      2
    ),

    (
      'Nusrat Jahan',
      'Founder',
      'প্রতিষ্ঠাতা',
      'Aranya Handicrafts Cooperative',
      'Our brand identity finally looks like the handmade, high-quality work our weavers actually produce. The logo holds up on a tiny woven tag just as well as it does on a shop sign.',
      'আমাদের ব্র্যান্ড আইডেন্টিটি এখন সত্যিই আমাদের তাঁতিদের হাতে তৈরি উচ্চমানের কাজের মতোই দেখায়। লোগোটা একটা ছোট বোনা ট্যাগেও যেমন ভালো দেখায়, দোকানের সাইনবোর্ডেও ঠিক তেমনই।',
      null,
      false,
      3
    ),

    (
      'Farhana Yasmin',
      'Program Director',
      'প্রোগ্রাম ডিরেক্টর',
      'Meghna Microfinance',
      'We needed a loan portal simple enough for borrowers who''d never used one before, and that''s exactly what we got. Support after launch has been just as responsive as the build itself.',
      'আমাদের এমন একটি লোন পোর্টাল দরকার ছিল যা এমন ঋণগ্রহীতাদের জন্যও সহজ হবে যারা আগে কখনো এমন কিছু ব্যবহার করেননি — এবং ঠিক তেমনটাই আমরা পেয়েছি। লঞ্চের পরের সাপোর্টও ঠিক ততটাই নির্ভরযোগ্য।',
      null,
      false,
      4
    ),

    (
      'Imran Kabir',
      'Lead Developer',
      'লিড ডেভেলপার',
      'Pixel & Ledger Studio',
      'Worked alongside Shahid for two years — he''s the person on the team who catches the edge case everyone else missed, and does it without making a big deal out of it.',
      'শাহিদের সাথে দুই বছর একসাথে কাজ করেছি — টিমে তিনিই সেই মানুষ যিনি সবার নজর এড়িয়ে যাওয়া খুঁটিনাটি সমস্যাটা ধরে ফেলেন, তাও কোনো রকম হইচই ছাড়াই।',
      null,
      false,
      5
    ),

    (
      'Sadia Islam',
      'Owner',
      'স্বত্বাধিকারী',
      'Bloom & Co.',
      'From logo to launch, the whole process was smooth. He kept things on schedule, communicated clearly, and the site has genuinely brought in more customers.',
      'লোগো থেকে শুরু করে লঞ্চ পর্যন্ত, পুরো প্রক্রিয়াটা ছিল সাবলীল। তিনি সময়মতো কাজ শেষ করেছেন, স্পষ্টভাবে যোগাযোগ রেখেছেন, আর সাইটটি সত্যিই আরও বেশি গ্রাহক নিয়ে এসেছে।',
      null,
      false,
      6
    );
  end if;
end $$;
