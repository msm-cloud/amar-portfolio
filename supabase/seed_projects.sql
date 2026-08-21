-- supabase/seed_projects.sql
--
-- One-time seed: inserts the same 5 projects that used to live as static
-- placeholder data (src/lib/placeholder-data.ts, now retired) as real rows
-- in the `projects` table, so the site doesn't look empty while the admin
-- panel is the only way to add more.
--
-- Run once via the Supabase Dashboard: SQL Editor -> New query -> paste
-- this entire file -> Run. Safe to re-run - `on conflict (slug) do
-- nothing` skips rows that already exist instead of erroring or
-- duplicating them.
--
-- `content`/`content_bn` are HTML (matching what the admin panel's Tiptap
-- editor produces for real projects going forward), not the old
-- plain-text "\n\n"-separated paragraphs - the public project detail page
-- renders this column as sanitized HTML now.

insert into public.projects (
  title, title_bn, slug, description, description_bn,
  content, content_bn, category, tags, cover_image_url,
  project_url, github_url, is_featured, display_order, status
) values

(
  'NexaBank Digital Operations Dashboard',
  'নেক্সাব্যাংক ডিজিটাল অপারেশনস ড্যাশবোর্ড',
  'nexabank-digital-operations-dashboard',
  'An internal web dashboard for daily branch operations — transaction monitoring, reconciliation, and reporting in one place.',
  'দৈনন্দিন শাখা কার্যক্রমের জন্য একটি অভ্যন্তরীণ ওয়েব ড্যাশবোর্ড — লেনদেন পর্যবেক্ষণ, মিলকরণ এবং প্রতিবেদন একই জায়গায়।',
  '<p>Built for a mid-sized retail bank''s operations team to replace a spreadsheet-driven workflow. The dashboard surfaces daily transaction volume, flags reconciliation mismatches automatically, and generates the end-of-day report that used to take an analyst most of an afternoon to assemble by hand.</p><p>The brief came directly from spending years on the operations side of financial-sector work myself: the dashboard is built around the reports and checks an ops team actually runs every day, not a generic admin template. Role-based access keeps branch staff, supervisors, and auditors each seeing only what''s relevant to them.</p><p>Stack: Next.js App Router, Supabase (Postgres + Row Level Security for the role-based access), TypeScript throughout, Tailwind CSS for the UI.</p>',
  '<p>একটি মাঝারি আকারের রিটেইল ব্যাংকের অপারেশনস টিমের জন্য তৈরি, যা স্প্রেডশিট-নির্ভর কর্মপ্রবাহ প্রতিস্থাপন করে। ড্যাশবোর্ডটি দৈনিক লেনদেনের পরিমাণ প্রদর্শন করে, মিলকরণের অসামঞ্জস্য স্বয়ংক্রিয়ভাবে চিহ্নিত করে, এবং দিন-শেষের প্রতিবেদন তৈরি করে যা আগে একজন বিশ্লেষকের প্রায় পুরো বিকেল সময় নিত।</p><p>এই প্রকল্পের ধারণা এসেছে সরাসরি আর্থিক খাতে বছরের পর বছর অপারেশন সাইডে কাজ করার অভিজ্ঞতা থেকে: ড্যাশবোর্ডটি একটি সাধারণ অ্যাডমিন টেমপ্লেট নয়, বরং একটি অপারেশনস টিম প্রতিদিন যেসব প্রতিবেদন ও যাচাই পরিচালনা করে তার ভিত্তিতে তৈরি। ভূমিকা-ভিত্তিক অ্যাক্সেস নিশ্চিত করে যে শাখার কর্মী, সুপারভাইজার এবং অডিটররা প্রত্যেকে শুধু তাদের প্রাসঙ্গিক তথ্যই দেখতে পান।</p><p>স্ট্যাক: Next.js App Router, Supabase (Postgres + ভূমিকা-ভিত্তিক অ্যাক্সেসের জন্য Row Level Security), সম্পূর্ণ TypeScript, UI-এর জন্য Tailwind CSS।</p>',
  'Web Development',
  array['Next.js', 'Supabase', 'TypeScript', 'Banking'],
  null,
  'https://example.com',
  'https://github.com/example/nexabank-dashboard',
  true,
  1,
  'published'
),

(
  'Meghna Microfinance Loan Portal',
  'মেঘনা মাইক্রোফাইন্যান্স লোন পোর্টাল',
  'meghna-microfinance-loan-portal',
  'A client-facing portal for a microfinance institution to manage loan applications, repayment schedules, and disbursement status.',
  'একটি মাইক্রোফাইন্যান্স প্রতিষ্ঠানের জন্য একটি ক্লায়েন্ট-মুখী পোর্টাল, যেখানে ঋণ আবেদন, পরিশোধের সময়সূচি এবং বিতরণের অবস্থা পরিচালনা করা যায়।',
  '<p>A microfinance institution needed to move loan applications online without asking rural and semi-urban borrowers to navigate anything complicated. The result is a deliberately simple, mobile-first portal: applicants track their application status, view their repayment schedule, and get notified of disbursement, all in a handful of clear screens.</p><p>Behind the scenes, staff manage the underwriting workflow through a matching internal panel, backed by the same database. Repayment schedule calculations follow the institution''s actual amortization rules rather than a generic formula.</p><p>Stack: React, Node.js, PostgreSQL. Delivered as a client project — source is private, but the live portal is linked below.</p>',
  '<p>একটি মাইক্রোফাইন্যান্স প্রতিষ্ঠানের প্রয়োজন ছিল ঋণ আবেদন অনলাইনে নিয়ে আসা, তবে গ্রামীণ ও আধা-শহুরে ঋণগ্রহীতাদের জটিল কিছু ব্যবহার করতে না বলে। ফলাফল হলো একটি ইচ্ছাকৃতভাবে সহজ, মোবাইল-ফার্স্ট পোর্টাল: আবেদনকারীরা তাদের আবেদনের অবস্থা দেখতে পান, পরিশোধের সময়সূচি দেখতে পান এবং বিতরণের বিজ্ঞপ্তি পান — সবকিছুই কয়েকটি স্পষ্ট স্ক্রিনে।</p><p>পর্দার আড়ালে, কর্মীরা একই ডেটাবেজ-ভিত্তিক একটি মিলযুক্ত অভ্যন্তরীণ প্যানেলের মাধ্যমে আন্ডাররাইটিং কর্মপ্রবাহ পরিচালনা করেন। পরিশোধের সময়সূচির হিসাব প্রতিষ্ঠানের প্রকৃত অ্যামর্টাইজেশন নিয়ম অনুসরণ করে, কোনো সাধারণ সূত্র নয়।</p><p>স্ট্যাক: React, Node.js, PostgreSQL। একটি ক্লায়েন্ট প্রকল্প হিসেবে সরবরাহ করা হয়েছে — সোর্স কোড প্রাইভেট, তবে লাইভ পোর্টালের লিংক নিচে দেওয়া আছে।</p>',
  'Web Development',
  array['React', 'Node.js', 'PostgreSQL', 'Finance'],
  null,
  'https://example.com',
  null,
  true,
  2,
  'published'
),

(
  'Aranya Handicrafts Brand Identity',
  'অরণ্য হ্যান্ডিক্রাফটস ব্র্যান্ড আইডেন্টিটি',
  'aranya-handicrafts-brand-identity',
  'Full brand identity for an artisan handicrafts cooperative — logo, color system, packaging, and a printed catalog.',
  'একটি কারুশিল্প সমবায়ের জন্য সম্পূর্ণ ব্র্যান্ড আইডেন্টিটি — লোগো, রঙের সিস্টেম, প্যাকেজিং এবং একটি মুদ্রিত ক্যাটালগ।',
  '<p>A handicrafts cooperative needed a brand identity that felt handmade and warm without looking amateur — a common tension for artisan brands competing against mass-market packaging. The mark draws on traditional weaving patterns, translated into a simple geometric logotype that still reproduces cleanly at small sizes (a tag on a woven basket, a stamp on a box).</p><p>Deliverables covered the full identity system: logo and variations, a color palette pulled from the cooperative''s actual dye materials, packaging templates, and a printed product catalog for trade shows.</p><p>Tools: Illustrator for the mark and vector system, Photoshop for photography retouching and packaging mockups.</p>',
  '<p>একটি কারুশিল্প সমবায়ের এমন একটি ব্র্যান্ড আইডেন্টিটি দরকার ছিল যা হাতে তৈরি ও উষ্ণ অনুভূত হবে, কিন্তু অপেশাদার দেখাবে না — কারুশিল্প ব্র্যান্ডগুলোর জন্য এটি একটি সাধারণ চ্যালেঞ্জ, যখন তারা ব্যাপক-বাজারের প্যাকেজিংয়ের বিরুদ্ধে প্রতিযোগিতা করে। এই লোগোটি ঐতিহ্যবাহী বুনন নকশা থেকে অনুপ্রাণিত, যা একটি সরল জ্যামিতিক লোগোটাইপে রূপান্তরিত হয়েছে যা ছোট আকারেও স্পষ্টভাবে ফুটে ওঠে (একটি বোনা ঝুড়ির ট্যাগে, বা একটি বাক্সের স্ট্যাম্পে)।</p><p>ডেলিভারেবলসের মধ্যে ছিল সম্পূর্ণ আইডেন্টিটি সিস্টেম: লোগো ও এর ভ্যারিয়েশন, সমবায়ের প্রকৃত রঞ্জক উপাদান থেকে নেওয়া একটি রঙের প্যালেট, প্যাকেজিং টেমপ্লেট এবং ট্রেড শোর জন্য একটি মুদ্রিত পণ্য ক্যাটালগ।</p><p>টুলস: লোগো ও ভেক্টর সিস্টেমের জন্য Illustrator, ফটোগ্রাফি রিটাচিং ও প্যাকেজিং মকআপের জন্য Photoshop।</p>',
  'Design',
  array['Branding', 'Illustrator', 'Photoshop'],
  null,
  null,
  null,
  false,
  3,
  'published'
),

(
  'Personal Budget Tracker',
  'পার্সোনাল বাজেট ট্র্যাকার',
  'personal-budget-tracker',
  'An open-source personal finance app for tracking spending against monthly budgets by category, with simple charts.',
  'একটি ওপেন-সোর্স ব্যক্তিগত অর্থ ব্যবস্থাপনা অ্যাপ, যা ক্যাটাগরি অনুযায়ী মাসিক বাজেটের বিপরীতে খরচ ট্র্যাক করে, সাথে সহজ চার্ট।',
  '<p>A side project born out of wanting a budgeting app that does exactly one thing well: compare actual spending against a monthly budget, per category, without the account-linking, subscriptions, or feature bloat of most commercial budgeting apps.</p><p>Entries are logged manually (by design — it keeps the data model simple and avoids bank-linking security concerns entirely), categorized, and charted against each category''s monthly limit. Built and open-sourced as a way to keep React and Tailwind skills sharp between client work.</p><p>Stack: React, Tailwind CSS, stored locally in the browser (no backend required).</p>',
  '<p>একটি সাইড প্রজেক্ট, যার জন্ম হয়েছিল এমন একটি বাজেটিং অ্যাপের প্রয়োজন থেকে যা একটি কাজ ভালোভাবে করে: ক্যাটাগরি অনুযায়ী প্রকৃত খরচকে মাসিক বাজেটের বিপরীতে তুলনা করা — বেশিরভাগ কমার্শিয়াল বাজেটিং অ্যাপের অ্যাকাউন্ট-লিংকিং, সাবস্ক্রিপশন বা অতিরিক্ত ফিচার ছাড়াই।</p><p>এন্ট্রিগুলো ম্যানুয়ালি লগ করা হয় (ইচ্ছাকৃতভাবে — এটি ডেটা মডেলকে সহজ রাখে এবং ব্যাংক-লিংকিং সংক্রান্ত নিরাপত্তা উদ্বেগ সম্পূর্ণভাবে এড়িয়ে যায়), ক্যাটাগরাইজ করা হয় এবং প্রতিটি ক্যাটাগরির মাসিক সীমার বিপরীতে চার্ট করা হয়। ক্লায়েন্ট কাজের ফাঁকে React ও Tailwind দক্ষতা ধরে রাখার একটি উপায় হিসেবে তৈরি ও ওপেন-সোর্স করা হয়েছে।</p><p>স্ট্যাক: React, Tailwind CSS, ব্রাউজারে স্থানীয়ভাবে সংরক্ষিত (কোনো ব্যাকএন্ড প্রয়োজন নেই)।</p>',
  'Web App',
  array['React', 'Tailwind CSS'],
  null,
  'https://example.com',
  'https://github.com/example/personal-budget-tracker',
  false,
  4,
  'published'
),

(
  'City Savings Cooperative — Print Campaign',
  'সিটি সেভিংস কো-অপারেটিভ — প্রিন্ট ক্যাম্পেইন',
  'city-savings-cooperative-print-campaign',
  'A print and in-branch campaign encouraging members to switch to paperless statements, designed for a savings cooperative.',
  'একটি সেভিংস কো-অপারেটিভের জন্য ডিজাইন করা একটি প্রিন্ট ও ইন-ব্রাঞ্চ ক্যাম্পেইন, যা সদস্যদের পেপারলেস স্টেটমেন্টে যেতে উৎসাহিত করে।',
  '<p>A savings cooperative wanted to move more members onto paperless statements ahead of a system migration, but their existing member base skewed toward people who trusted paper. The campaign leaned into that directly rather than fighting it: plain-language posters and flyers explaining exactly what would (and wouldn''t) change, distributed across branch locations and mailed with the final paper statement.</p><p>Design work covered the full print set — branch posters, counter flyers, and statement-insert cards — kept consistent with the cooperative''s existing brand rather than introducing a new visual identity.</p><p>Tools: InDesign for layout, Illustrator for supporting iconography.</p>',
  '<p>একটি সেভিংস কো-অপারেটিভ চেয়েছিল সিস্টেম মাইগ্রেশনের আগে আরও বেশি সদস্যকে পেপারলেস স্টেটমেন্টে নিয়ে যেতে, কিন্তু তাদের বিদ্যমান সদস্যরা মূলত কাগজে বিশ্বাসী ছিলেন। ক্যাম্পেইনটি এই বিষয়টিকে সরাসরি মোকাবিলা করেছে, এড়িয়ে না গিয়ে: সহজ ভাষায় পোস্টার ও ফ্লায়ার, যা স্পষ্টভাবে ব্যাখ্যা করে কী পরিবর্তন হবে (এবং কী হবে না), যা শাখাগুলোতে বিতরণ করা হয়েছে এবং চূড়ান্ত কাগজের স্টেটমেন্টের সাথে মেইল করা হয়েছে।</p><p>ডিজাইনের কাজের মধ্যে ছিল সম্পূর্ণ প্রিন্ট সেট — শাখার পোস্টার, কাউন্টার ফ্লায়ার এবং স্টেটমেন্ট-ইনসার্ট কার্ড — যা সমবায়ের বিদ্যমান ব্র্যান্ডের সাথে সামঞ্জস্যপূর্ণ রাখা হয়েছে, নতুন কোনো ভিজ্যুয়াল আইডেন্টিটি প্রবর্তন না করে।</p><p>টুলস: লেআউটের জন্য InDesign, সহায়ক আইকনোগ্রাফির জন্য Illustrator।</p>',
  'Design',
  array['Print Design', 'InDesign', 'Branding', 'Finance'],
  null,
  null,
  null,
  false,
  5,
  'published'
)

on conflict (slug) do nothing;
