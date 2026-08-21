import {
  Award,
  Banknote,
  Code2,
  GraduationCap,
  Landmark,
  Palette,
  type LucideIcon,
} from 'lucide-react';
import type { Database } from '@/types/database';
import type { Language } from '@/lib/language-context';

/**
 * lib/placeholder-data.ts
 * -----------------------
 * PLACEHOLDER DATA for every section that will eventually read from
 * Supabase — replace with real queries once the admin panel's content
 * management is built (e.g.
 * `await supabase.from('projects').select('*').eq('status', 'published')`).
 *
 * Every export here is typed directly as its table's real Row shape (see
 * src/types/database.ts / supabase/migrations/), not a hand-rolled
 * subset — every field a real query would return is present, using the
 * exact same field names, so swapping an array out for a Supabase query
 * result is mechanical: no renaming, no reshaping. (This has already
 * caught a real bug once — a missing column on the projects data failed
 * `pnpm build`'s type check immediately.)
 *
 * Cover/credential images are all `null` on purpose (no real assets yet)
 * — the UI (`CoverImage` component) falls back to a gradient + icon when
 * a `*_image_url` is null, which is what you'll actually see.
 *
 * Bilingual content: every `*_bn` column is now populated with a natural
 * (not machine-translated-sounding) Bangla version, matching the real
 * schema's bilingual-toggle design (see supabase/migrations/README.md).
 * Use `pickBilingual(row.field, row.field_bn, language)` to read the
 * right one. `category` fields have no `_bn` column (by design — see the
 * migration's own comment on why controlled-vocabulary fields aren't
 * duplicated); `translateCategory()` below covers the category values
 * actually used in this placeholder data instead.
 */

const now = '2026-01-01T00:00:00.000Z';

/** Reads the right language out of a `{ field, field_bn }` pair, falling
 * back to English if a Bangla value isn't set (matches how a real CMS
 * with partially-translated content would behave). */
export function pickBilingual(
  en: string,
  bn: string | null | undefined,
  language: Language
): string {
  if (language === 'bn' && bn) return bn;
  return en;
}

// ============================================================================
// Projects
// ============================================================================

export type PlaceholderProject =
  Database['public']['Tables']['projects']['Row'];

export const PLACEHOLDER_PROJECTS: PlaceholderProject[] = [
  {
    id: 'proj-nexabank-dashboard',
    title: 'NexaBank Digital Operations Dashboard',
    title_bn: 'নেক্সাব্যাংক ডিজিটাল অপারেশনস ড্যাশবোর্ড',
    slug: 'nexabank-digital-operations-dashboard',
    description:
      'An internal web dashboard for daily branch operations — transaction monitoring, reconciliation, and reporting in one place.',
    description_bn:
      'দৈনন্দিন শাখা কার্যক্রমের জন্য একটি অভ্যন্তরীণ ওয়েব ড্যাশবোর্ড — লেনদেন পর্যবেক্ষণ, মিলকরণ এবং প্রতিবেদন একই জায়গায়।',
    content:
      "Built for a mid-sized retail bank's operations team to replace a spreadsheet-driven workflow. The dashboard surfaces daily transaction volume, flags reconciliation mismatches automatically, and generates the end-of-day report that used to take an analyst most of an afternoon to assemble by hand.\n\nThe brief came directly from spending years on the operations side of financial-sector work myself: the dashboard is built around the reports and checks an ops team actually runs every day, not a generic admin template. Role-based access keeps branch staff, supervisors, and auditors each seeing only what's relevant to them.\n\nStack: Next.js App Router, Supabase (Postgres + Row Level Security for the role-based access), TypeScript throughout, Tailwind CSS for the UI.",
    content_bn:
      'একটি মাঝারি আকারের রিটেইল ব্যাংকের অপারেশনস টিমের জন্য তৈরি, যা স্প্রেডশিট-নির্ভর কর্মপ্রবাহ প্রতিস্থাপন করে। ড্যাশবোর্ডটি দৈনিক লেনদেনের পরিমাণ প্রদর্শন করে, মিলকরণের অসামঞ্জস্য স্বয়ংক্রিয়ভাবে চিহ্নিত করে, এবং দিন-শেষের প্রতিবেদন তৈরি করে যা আগে একজন বিশ্লেষকের প্রায় পুরো বিকেল সময় নিত।\n\nএই প্রকল্পের ধারণা এসেছে সরাসরি আর্থিক খাতে বছরের পর বছর অপারেশন সাইডে কাজ করার অভিজ্ঞতা থেকে: ড্যাশবোর্ডটি একটি সাধারণ অ্যাডমিন টেমপ্লেট নয়, বরং একটি অপারেশনস টিম প্রতিদিন যেসব প্রতিবেদন ও যাচাই পরিচালনা করে তার ভিত্তিতে তৈরি। ভূমিকা-ভিত্তিক অ্যাক্সেস নিশ্চিত করে যে শাখার কর্মী, সুপারভাইজার এবং অডিটররা প্রত্যেকে শুধু তাদের প্রাসঙ্গিক তথ্যই দেখতে পান।\n\nস্ট্যাক: Next.js App Router, Supabase (Postgres + ভূমিকা-ভিত্তিক অ্যাক্সেসের জন্য Row Level Security), সম্পূর্ণ TypeScript, UI-এর জন্য Tailwind CSS।',
    category: 'Web Development',
    tags: ['Next.js', 'Supabase', 'TypeScript', 'Banking'],
    cover_image_url: null,
    project_url: 'https://example.com',
    github_url: 'https://github.com/example/nexabank-dashboard',
    is_featured: true,
    display_order: 1,
    status: 'published',
    created_by: null,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'proj-meghna-microfinance',
    title: 'Meghna Microfinance Loan Portal',
    title_bn: 'মেঘনা মাইক্রোফাইন্যান্স লোন পোর্টাল',
    slug: 'meghna-microfinance-loan-portal',
    description:
      'A client-facing portal for a microfinance institution to manage loan applications, repayment schedules, and disbursement status.',
    description_bn:
      'একটি মাইক্রোফাইন্যান্স প্রতিষ্ঠানের জন্য একটি ক্লায়েন্ট-মুখী পোর্টাল, যেখানে ঋণ আবেদন, পরিশোধের সময়সূচি এবং বিতরণের অবস্থা পরিচালনা করা যায়।',
    content:
      "A microfinance institution needed to move loan applications online without asking rural and semi-urban borrowers to navigate anything complicated. The result is a deliberately simple, mobile-first portal: applicants track their application status, view their repayment schedule, and get notified of disbursement, all in a handful of clear screens.\n\nBehind the scenes, staff manage the underwriting workflow through a matching internal panel, backed by the same database. Repayment schedule calculations follow the institution's actual amortization rules rather than a generic formula.\n\nStack: React, Node.js, PostgreSQL. Delivered as a client project — source is private, but the live portal is linked below.",
    content_bn:
      'একটি মাইক্রোফাইন্যান্স প্রতিষ্ঠানের প্রয়োজন ছিল ঋণ আবেদন অনলাইনে নিয়ে আসা, তবে গ্রামীণ ও আধা-শহুরে ঋণগ্রহীতাদের জটিল কিছু ব্যবহার করতে না বলে। ফলাফল হলো একটি ইচ্ছাকৃতভাবে সহজ, মোবাইল-ফার্স্ট পোর্টাল: আবেদনকারীরা তাদের আবেদনের অবস্থা দেখতে পান, পরিশোধের সময়সূচি দেখতে পান এবং বিতরণের বিজ্ঞপ্তি পান — সবকিছুই কয়েকটি স্পষ্ট স্ক্রিনে।\n\nপর্দার আড়ালে, কর্মীরা একই ডেটাবেজ-ভিত্তিক একটি মিলযুক্ত অভ্যন্তরীণ প্যানেলের মাধ্যমে আন্ডাররাইটিং কর্মপ্রবাহ পরিচালনা করেন। পরিশোধের সময়সূচির হিসাব প্রতিষ্ঠানের প্রকৃত অ্যামর্টাইজেশন নিয়ম অনুসরণ করে, কোনো সাধারণ সূত্র নয়।\n\nস্ট্যাক: React, Node.js, PostgreSQL। একটি ক্লায়েন্ট প্রকল্প হিসেবে সরবরাহ করা হয়েছে — সোর্স কোড প্রাইভেট, তবে লাইভ পোর্টালের লিংক নিচে দেওয়া আছে।',
    category: 'Web Development',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Finance'],
    cover_image_url: null,
    project_url: 'https://example.com',
    github_url: null,
    is_featured: true,
    display_order: 2,
    status: 'published',
    created_by: null,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'proj-aranya-brand-identity',
    title: 'Aranya Handicrafts Brand Identity',
    title_bn: 'অরণ্য হ্যান্ডিক্রাফটস ব্র্যান্ড আইডেন্টিটি',
    slug: 'aranya-handicrafts-brand-identity',
    description:
      'Full brand identity for an artisan handicrafts cooperative — logo, color system, packaging, and a printed catalog.',
    description_bn:
      'একটি কারুশিল্প সমবায়ের জন্য সম্পূর্ণ ব্র্যান্ড আইডেন্টিটি — লোগো, রঙের সিস্টেম, প্যাকেজিং এবং একটি মুদ্রিত ক্যাটালগ।',
    content:
      "A handicrafts cooperative needed a brand identity that felt handmade and warm without looking amateur — a common tension for artisan brands competing against mass-market packaging. The mark draws on traditional weaving patterns, translated into a simple geometric logotype that still reproduces cleanly at small sizes (a tag on a woven basket, a stamp on a box).\n\nDeliverables covered the full identity system: logo and variations, a color palette pulled from the cooperative's actual dye materials, packaging templates, and a printed product catalog for trade shows.\n\nTools: Illustrator for the mark and vector system, Photoshop for photography retouching and packaging mockups.",
    content_bn:
      'একটি কারুশিল্প সমবায়ের এমন একটি ব্র্যান্ড আইডেন্টিটি দরকার ছিল যা হাতে তৈরি ও উষ্ণ অনুভূত হবে, কিন্তু অপেশাদার দেখাবে না — কারুশিল্প ব্র্যান্ডগুলোর জন্য এটি একটি সাধারণ চ্যালেঞ্জ, যখন তারা ব্যাপক-বাজারের প্যাকেজিংয়ের বিরুদ্ধে প্রতিযোগিতা করে। এই লোগোটি ঐতিহ্যবাহী বুনন নকশা থেকে অনুপ্রাণিত, যা একটি সরল জ্যামিতিক লোগোটাইপে রূপান্তরিত হয়েছে যা ছোট আকারেও স্পষ্টভাবে ফুটে ওঠে (একটি বোনা ঝুড়ির ট্যাগে, বা একটি বাক্সের স্ট্যাম্পে)।\n\nডেলিভারেবলসের মধ্যে ছিল সম্পূর্ণ আইডেন্টিটি সিস্টেম: লোগো ও এর ভ্যারিয়েশন, সমবায়ের প্রকৃত রঞ্জক উপাদান থেকে নেওয়া একটি রঙের প্যালেট, প্যাকেজিং টেমপ্লেট এবং ট্রেড শোর জন্য একটি মুদ্রিত পণ্য ক্যাটালগ।\n\nটুলস: লোগো ও ভেক্টর সিস্টেমের জন্য Illustrator, ফটোগ্রাফি রিটাচিং ও প্যাকেজিং মকআপের জন্য Photoshop।',
    category: 'Design',
    tags: ['Branding', 'Illustrator', 'Photoshop'],
    cover_image_url: null,
    project_url: null,
    github_url: null,
    is_featured: false,
    display_order: 3,
    status: 'published',
    created_by: null,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'proj-personal-budget-tracker',
    title: 'Personal Budget Tracker',
    title_bn: 'পার্সোনাল বাজেট ট্র্যাকার',
    slug: 'personal-budget-tracker',
    description:
      'An open-source personal finance app for tracking spending against monthly budgets by category, with simple charts.',
    description_bn:
      'একটি ওপেন-সোর্স ব্যক্তিগত অর্থ ব্যবস্থাপনা অ্যাপ, যা ক্যাটাগরি অনুযায়ী মাসিক বাজেটের বিপরীতে খরচ ট্র্যাক করে, সাথে সহজ চার্ট।',
    content:
      "A side project born out of wanting a budgeting app that does exactly one thing well: compare actual spending against a monthly budget, per category, without the account-linking, subscriptions, or feature bloat of most commercial budgeting apps.\n\nEntries are logged manually (by design — it keeps the data model simple and avoids bank-linking security concerns entirely), categorized, and charted against each category's monthly limit. Built and open-sourced as a way to keep React and Tailwind skills sharp between client work.\n\nStack: React, Tailwind CSS, stored locally in the browser (no backend required).",
    content_bn:
      'একটি সাইড প্রজেক্ট, যার জন্ম হয়েছিল এমন একটি বাজেটিং অ্যাপের প্রয়োজন থেকে যা একটি কাজ ভালোভাবে করে: ক্যাটাগরি অনুযায়ী প্রকৃত খরচকে মাসিক বাজেটের বিপরীতে তুলনা করা — বেশিরভাগ কমার্শিয়াল বাজেটিং অ্যাপের অ্যাকাউন্ট-লিংকিং, সাবস্ক্রিপশন বা অতিরিক্ত ফিচার ছাড়াই।\n\nএন্ট্রিগুলো ম্যানুয়ালি লগ করা হয় (ইচ্ছাকৃতভাবে — এটি ডেটা মডেলকে সহজ রাখে এবং ব্যাংক-লিংকিং সংক্রান্ত নিরাপত্তা উদ্বেগ সম্পূর্ণভাবে এড়িয়ে যায়), ক্যাটাগরাইজ করা হয় এবং প্রতিটি ক্যাটাগরির মাসিক সীমার বিপরীতে চার্ট করা হয়। ক্লায়েন্ট কাজের ফাঁকে React ও Tailwind দক্ষতা ধরে রাখার একটি উপায় হিসেবে তৈরি ও ওপেন-সোর্স করা হয়েছে।\n\nস্ট্যাক: React, Tailwind CSS, ব্রাউজারে স্থানীয়ভাবে সংরক্ষিত (কোনো ব্যাকএন্ড প্রয়োজন নেই)।',
    category: 'Web App',
    tags: ['React', 'Tailwind CSS'],
    cover_image_url: null,
    project_url: 'https://example.com',
    github_url: 'https://github.com/example/personal-budget-tracker',
    is_featured: false,
    display_order: 4,
    status: 'published',
    created_by: null,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'proj-city-savings-print-campaign',
    title: 'City Savings Cooperative — Print Campaign',
    title_bn: 'সিটি সেভিংস কো-অপারেটিভ — প্রিন্ট ক্যাম্পেইন',
    slug: 'city-savings-cooperative-print-campaign',
    description:
      'A print and in-branch campaign encouraging members to switch to paperless statements, designed for a savings cooperative.',
    description_bn:
      'একটি সেভিংস কো-অপারেটিভের জন্য ডিজাইন করা একটি প্রিন্ট ও ইন-ব্রাঞ্চ ক্যাম্পেইন, যা সদস্যদের পেপারলেস স্টেটমেন্টে যেতে উৎসাহিত করে।',
    content:
      "A savings cooperative wanted to move more members onto paperless statements ahead of a system migration, but their existing member base skewed toward people who trusted paper. The campaign leaned into that directly rather than fighting it: plain-language posters and flyers explaining exactly what would (and wouldn't) change, distributed across branch locations and mailed with the final paper statement.\n\nDesign work covered the full print set — branch posters, counter flyers, and statement-insert cards — kept consistent with the cooperative's existing brand rather than introducing a new visual identity.\n\nTools: InDesign for layout, Illustrator for supporting iconography.",
    content_bn:
      'একটি সেভিংস কো-অপারেটিভ চেয়েছিল সিস্টেম মাইগ্রেশনের আগে আরও বেশি সদস্যকে পেপারলেস স্টেটমেন্টে নিয়ে যেতে, কিন্তু তাদের বিদ্যমান সদস্যরা মূলত কাগজে বিশ্বাসী ছিলেন। ক্যাম্পেইনটি এই বিষয়টিকে সরাসরি মোকাবিলা করেছে, এড়িয়ে না গিয়ে: সহজ ভাষায় পোস্টার ও ফ্লায়ার, যা স্পষ্টভাবে ব্যাখ্যা করে কী পরিবর্তন হবে (এবং কী হবে না), যা শাখাগুলোতে বিতরণ করা হয়েছে এবং চূড়ান্ত কাগজের স্টেটমেন্টের সাথে মেইল করা হয়েছে।\n\nডিজাইনের কাজের মধ্যে ছিল সম্পূর্ণ প্রিন্ট সেট — শাখার পোস্টার, কাউন্টার ফ্লায়ার এবং স্টেটমেন্ট-ইনসার্ট কার্ড — যা সমবায়ের বিদ্যমান ব্র্যান্ডের সাথে সামঞ্জস্যপূর্ণ রাখা হয়েছে, নতুন কোনো ভিজ্যুয়াল আইডেন্টিটি প্রবর্তন না করে।\n\nটুলস: লেআউটের জন্য InDesign, সহায়ক আইকনোগ্রাফির জন্য Illustrator।',
    category: 'Design',
    tags: ['Print Design', 'InDesign', 'Branding', 'Finance'],
    cover_image_url: null,
    project_url: null,
    github_url: null,
    is_featured: false,
    display_order: 5,
    status: 'published',
    created_by: null,
    created_at: now,
    updated_at: now,
  },
];

export function getPlaceholderProjectBySlug(
  slug: string
): PlaceholderProject | undefined {
  return PLACEHOLDER_PROJECTS.find((project) => project.slug === slug);
}

/** Best-effort icon for a project's cover-image fallback, based on category. */
export function getCategoryIcon(category: string | null): LucideIcon {
  const normalized = (category ?? '').toLowerCase();
  if (normalized.includes('finance') || normalized.includes('bank')) {
    return Banknote;
  }
  if (
    normalized.includes('design') ||
    normalized.includes('brand') ||
    normalized.includes('print')
  ) {
    return Palette;
  }
  return Code2;
}

// Category values are a controlled vocabulary (used for the fallback-icon
// heuristic above too), not free text - see the migration's own comment
// on why they don't get a `_bn` column. Covers every category value used
// in PLACEHOLDER_PROJECTS and Skills.tsx's categories. Individual skill/
// tag names (React, TypeScript, Banking, ...) are intentionally NOT
// translated - they're proper nouns / established English tech terms,
// same convention as person and company names elsewhere in this data.
const CATEGORY_TRANSLATIONS: Record<string, string> = {
  Frontend: 'ফ্রন্টএন্ড',
  Backend: 'ব্যাকএন্ড',
  Design: 'ডিজাইন',
  'Tools & Other': 'টুলস ও অন্যান্য',
  'Web Development': 'ওয়েব ডেভেলপমেন্ট',
  'Web App': 'ওয়েব অ্যাপ',
};

export function translateCategory(
  category: string | null,
  language: Language
): string {
  if (!category) return '';
  if (language === 'en') return category;
  return CATEGORY_TRANSLATIONS[category] ?? category;
}

// ============================================================================
// Experience
// ============================================================================

export type PlaceholderExperience =
  Database['public']['Tables']['experience']['Row'];

// PLACEHOLDER - replace with a real Supabase query
// (`await supabase.from('experience').select('*').order('display_order')`)
// once the admin panel's content management is built. Reverse
// chronological order, mixing financial-sector administration with web
// development/design work per the site owner's actual background.
export const PLACEHOLDER_EXPERIENCE: PlaceholderExperience[] = [
  {
    id: 'exp-freelance',
    title: 'Freelance Web Developer & Graphic Designer',
    title_bn: 'ফ্রিল্যান্স ওয়েব ডেভেলপার ও গ্রাফিক ডিজাইনার',
    organization: 'Self-Employed',
    organization_bn: 'স্ব-নিযুক্ত',
    description:
      'Design and build websites, web apps, and brand identities for clients — including financial institutions — end to end: from UI design through frontend, backend, and database work.',
    description_bn:
      'ক্লায়েন্টদের জন্য ওয়েবসাইট, ওয়েব অ্যাপ এবং ব্র্যান্ড আইডেন্টিটি ডিজাইন ও নির্মাণ করি — আর্থিক প্রতিষ্ঠানসহ — ইউআই ডিজাইন থেকে শুরু করে ফ্রন্টএন্ড, ব্যাকএন্ড ও ডেটাবেজ পর্যন্ত সম্পূর্ণভাবে।',
    start_date: '2024-01-01',
    end_date: null,
    is_current: true,
    display_order: 1,
  },
  {
    id: 'exp-city-savings',
    title: 'Operations Officer',
    title_bn: 'অপারেশনস অফিসার',
    organization: 'City Savings Cooperative',
    organization_bn: 'সিটি সেভিংস কো-অপারেটিভ',
    description:
      'Managed daily branch operations, transaction reconciliation, and reporting for a savings cooperative. The same operational rigor — accuracy, auditability, no room for "close enough" — now shapes how I build software.',
    description_bn:
      'একটি সেভিংস কো-অপারেটিভের দৈনন্দিন শাখা কার্যক্রম, লেনদেন মিলকরণ এবং প্রতিবেদন প্রস্তুতির দায়িত্ব পালন করেছি। নির্ভুলতা ও জবাবদিহিতার সেই একই কঠোর মান — যেখানে "মোটামুটি ঠিক আছে" বলে কিছু নেই — এখন আমার সফটওয়্যার তৈরির ধরনকে প্রভাবিত করে।',
    start_date: '2021-06-01',
    end_date: '2023-12-31',
    is_current: false,
    display_order: 2,
  },
  {
    id: 'exp-web-developer',
    title: 'Web Developer',
    title_bn: 'ওয়েব ডেভেলপার',
    organization: 'Pixel & Ledger Studio',
    organization_bn: 'পিক্সেল অ্যান্ড লেজার স্টুডিও',
    description:
      'Built client websites and web apps end to end, handling both frontend design and backend implementation for small-business and local-organization clients.',
    description_bn:
      'ক্লায়েন্টদের জন্য ওয়েবসাইট ও ওয়েব অ্যাপ সম্পূর্ণভাবে তৈরি করেছি, ছোট ব্যবসা ও স্থানীয় প্রতিষ্ঠানের ক্লায়েন্টদের জন্য ফ্রন্টএন্ড ডিজাইন ও ব্যাকএন্ড বাস্তবায়ন উভয়ই সামলেছি।',
    start_date: '2019-01-01',
    end_date: '2021-05-31',
    is_current: false,
    display_order: 3,
  },
  {
    id: 'exp-design-intern',
    title: 'Graphic Design Intern',
    title_bn: 'গ্রাফিক ডিজাইন ইন্টার্ন',
    organization: 'Studio Nirjhor',
    organization_bn: 'স্টুডিও নির্ঝর',
    description:
      'Assisted senior designers on branding and print projects — logo exploration, packaging mockups, and print-ready file preparation.',
    description_bn:
      'সিনিয়র ডিজাইনারদের ব্র্যান্ডিং ও প্রিন্ট প্রজেক্টে সহায়তা করেছি — লোগো এক্সপ্লোরেশন, প্যাকেজিং মকআপ এবং প্রিন্ট-রেডি ফাইল প্রস্তুতিতে।',
    start_date: '2018-06-01',
    end_date: '2018-12-31',
    is_current: false,
    display_order: 4,
  },
];

const MONTH_ABBREVIATIONS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** Formats an ISO 'YYYY-MM-DD' date as "Mon YYYY", without going through
 * `Date` (avoids timezone-shift bugs when parsing a bare date string).
 * English month abbreviations only for now, in both languages - like
 * dates elsewhere in this data, this is a controlled/formatted value
 * rather than translatable prose. */
export function formatMonthYear(isoDate: string): string {
  const [year, month] = isoDate.split('-');
  const monthLabel = MONTH_ABBREVIATIONS[Number(month) - 1] ?? '';
  return `${monthLabel} ${year}`.trim();
}

export function formatExperienceDateRange(
  entry: PlaceholderExperience,
  presentLabel: string
): string {
  const start = formatMonthYear(entry.start_date);
  const end =
    entry.is_current || !entry.end_date
      ? presentLabel
      : formatMonthYear(entry.end_date);
  return `${start} — ${end}`;
}

// ============================================================================
// Certifications
// ============================================================================

export type PlaceholderCertification =
  Database['public']['Tables']['certifications']['Row'];

// PLACEHOLDER - replace with a real Supabase query
// (`await supabase.from('certifications').select('*').order('display_order')`)
// once the admin panel's content management is built. Mix of formal
// education, a banking/finance credential, and tech/design certifications.
export const PLACEHOLDER_CERTIFICATIONS: PlaceholderCertification[] = [
  {
    id: 'cert-bsc-cs',
    title: 'B.Sc. in Computer Science',
    title_bn: 'কম্পিউটার সায়েন্সে বি.এসসি.',
    issuing_organization: 'University of Dhaka',
    issuing_organization_bn: 'ঢাকা বিশ্ববিদ্যালয়',
    issue_date: '2018-12-01',
    credential_url: null,
    image_url: null,
    display_order: 1,
  },
  {
    id: 'cert-bibm-diploma',
    title: 'Diploma in Banking',
    title_bn: 'ব্যাংকিং-এ ডিপ্লোমা',
    issuing_organization: 'Bangladesh Institute of Bank Management (BIBM)',
    issuing_organization_bn:
      'বাংলাদেশ ইনস্টিটিউট অফ ব্যাংক ম্যানেজমেন্ট (বিআইবিএম)',
    issue_date: '2022-03-01',
    credential_url: 'https://example.com',
    image_url: null,
    display_order: 2,
  },
  {
    id: 'cert-meta-frontend',
    title: 'Meta Front-End Developer Professional Certificate',
    title_bn: 'মেটা ফ্রন্ট-এন্ড ডেভেলপার প্রফেশনাল সার্টিফিকেট',
    issuing_organization: 'Meta (via Coursera)',
    issuing_organization_bn: 'মেটা (কোর্সেরার মাধ্যমে)',
    issue_date: '2023-08-01',
    credential_url: 'https://example.com',
    image_url: null,
    display_order: 3,
  },
  {
    id: 'cert-adobe-photoshop',
    title: 'Adobe Certified Professional — Photoshop',
    title_bn: 'অ্যাডোবি সার্টিফাইড প্রফেশনাল — ফটোশপ',
    issuing_organization: 'Adobe',
    issuing_organization_bn: 'অ্যাডোবি',
    issue_date: '2020-05-01',
    credential_url: 'https://example.com',
    image_url: null,
    display_order: 4,
  },
];

/** Best-effort icon for a certification's badge, based on its title/org. */
export function getCertificationIcon(
  cert: PlaceholderCertification
): LucideIcon {
  const normalized = `${cert.title} ${cert.issuing_organization}`.toLowerCase();
  if (
    normalized.includes('university') ||
    normalized.includes('b.sc') ||
    normalized.includes('degree')
  ) {
    return GraduationCap;
  }
  if (normalized.includes('bank') || normalized.includes('finance')) {
    return Landmark;
  }
  if (
    normalized.includes('design') ||
    normalized.includes('adobe') ||
    normalized.includes('photoshop')
  ) {
    return Palette;
  }
  return Award;
}

// ============================================================================
// Testimonials
// ============================================================================

export type PlaceholderTestimonial =
  Database['public']['Tables']['testimonials']['Row'];

// PLACEHOLDER - replace with a real Supabase query
// (`await supabase.from('testimonials').select('*').order('display_order')`)
// once the admin panel's content management is built. A believable mix of
// clients and a colleague, spanning web dev, graphic design, and the
// financial-sector projects specifically (two of these reference the exact
// NexaBank/Meghna Microfinance projects in PLACEHOLDER_PROJECTS above, so
// the testimonial and the project it's about actually agree with each
// other). `author_company` has no `_bn` column (proper noun, same
// convention as project/tag names elsewhere in this file) - only
// `author_title` and `content` get a Bangla version. `avatar_url` is null
// throughout (no real photos yet) - the UI falls back to author initials
// in a colored circle, same "null means fall back to a generated visual"
// convention as `cover_image_url` for projects.
export const PLACEHOLDER_TESTIMONIALS: PlaceholderTestimonial[] = [
  {
    id: 'test-tanvir-nexabank',
    author_name: 'Tanvir Ahmed',
    author_title: 'Operations Manager',
    author_title_bn: 'অপারেশনস ম্যানেজার',
    author_company: 'NexaBank',
    content:
      "The operations dashboard he built cut our end-of-day reporting from a full afternoon to about twenty minutes. What made the difference is that he'd actually worked in banking operations himself, so he understood what we needed before we finished explaining it.",
    content_bn:
      'তিনি যে অপারেশনস ড্যাশবোর্ড তৈরি করেছেন, তা আমাদের দিন-শেষের রিপোর্টিং একটা পুরো বিকেল থেকে কমিয়ে মাত্র বিশ মিনিটে নামিয়ে এনেছে। পার্থক্যটা তৈরি হয়েছে কারণ তিনি নিজেই ব্যাংকিং অপারেশনসে কাজ করেছেন, তাই আমরা বোঝানো শেষ করার আগেই তিনি আমাদের প্রয়োজন বুঝে ফেলেছিলেন।',
    avatar_url: null,
    is_featured: true,
    display_order: 1,
  },
  {
    id: 'test-rina-loopline',
    author_name: 'Rina Chowdhury',
    author_title: 'Product Manager',
    author_title_bn: 'প্রোডাক্ট ম্যানেজার',
    author_company: 'Loopline Technologies',
    content:
      "Shahid rebuilt our marketing site from scratch and it's the first version we've actually been proud to link people to. Fast, clean, and he explained every decision instead of just handing over a black box.",
    content_bn:
      "শাহিদ আমাদের মার্কেটিং সাইটটি একদম নতুন করে তৈরি করে দিয়েছেন, এবং এটাই প্রথম ভার্সন যা আমরা গর্বের সাথে অন্যদের সাথে শেয়ার করতে পারি। দ্রুত, পরিচ্ছন্ন, এবং প্রতিটি সিদ্ধান্তের কারণ তিনি ব্যাখ্যা করেছেন, শুধু একটা 'ব্ল্যাক বক্স' ধরিয়ে দেননি।",
    avatar_url: null,
    is_featured: true,
    display_order: 2,
  },
  {
    id: 'test-nusrat-aranya',
    author_name: 'Nusrat Jahan',
    author_title: 'Founder',
    author_title_bn: 'প্রতিষ্ঠাতা',
    author_company: 'Aranya Handicrafts Cooperative',
    content:
      'Our brand identity finally looks like the handmade, high-quality work our weavers actually produce. The logo holds up on a tiny woven tag just as well as it does on a shop sign.',
    content_bn:
      'আমাদের ব্র্যান্ড আইডেন্টিটি এখন সত্যিই আমাদের তাঁতিদের হাতে তৈরি উচ্চমানের কাজের মতোই দেখায়। লোগোটা একটা ছোট বোনা ট্যাগেও যেমন ভালো দেখায়, দোকানের সাইনবোর্ডেও ঠিক তেমনই।',
    avatar_url: null,
    is_featured: false,
    display_order: 3,
  },
  {
    id: 'test-farhana-meghna',
    author_name: 'Farhana Yasmin',
    author_title: 'Program Director',
    author_title_bn: 'প্রোগ্রাম ডিরেক্টর',
    author_company: 'Meghna Microfinance',
    content:
      "We needed a loan portal simple enough for borrowers who'd never used one before, and that's exactly what we got. Support after launch has been just as responsive as the build itself.",
    content_bn:
      'আমাদের এমন একটি লোন পোর্টাল দরকার ছিল যা এমন ঋণগ্রহীতাদের জন্যও সহজ হবে যারা আগে কখনো এমন কিছু ব্যবহার করেননি — এবং ঠিক তেমনটাই আমরা পেয়েছি। লঞ্চের পরের সাপোর্টও ঠিক ততটাই নির্ভরযোগ্য।',
    avatar_url: null,
    is_featured: false,
    display_order: 4,
  },
  {
    id: 'test-imran-pixelandledger',
    author_name: 'Imran Kabir',
    author_title: 'Lead Developer',
    author_title_bn: 'লিড ডেভেলপার',
    author_company: 'Pixel & Ledger Studio',
    content:
      "Worked alongside Shahid for two years — he's the person on the team who catches the edge case everyone else missed, and does it without making a big deal out of it.",
    content_bn:
      'শাহিদের সাথে দুই বছর একসাথে কাজ করেছি — টিমে তিনিই সেই মানুষ যিনি সবার নজর এড়িয়ে যাওয়া খুঁটিনাটি সমস্যাটা ধরে ফেলেন, তাও কোনো রকম হইচই ছাড়াই।',
    avatar_url: null,
    is_featured: false,
    display_order: 5,
  },
  {
    id: 'test-sadia-bloom',
    author_name: 'Sadia Islam',
    author_title: 'Owner',
    author_title_bn: 'স্বত্বাধিকারী',
    author_company: 'Bloom & Co.',
    content:
      'From logo to launch, the whole process was smooth. He kept things on schedule, communicated clearly, and the site has genuinely brought in more customers.',
    content_bn:
      'লোগো থেকে শুরু করে লঞ্চ পর্যন্ত, পুরো প্রক্রিয়াটা ছিল সাবলীল। তিনি সময়মতো কাজ শেষ করেছেন, স্পষ্টভাবে যোগাযোগ রেখেছেন, আর সাইটটি সত্যিই আরও বেশি গ্রাহক নিয়ে এসেছে।',
    avatar_url: null,
    is_featured: false,
    display_order: 6,
  },
];
