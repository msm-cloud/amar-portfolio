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
//
// The placeholder project array itself has been retired - Projects.tsx and
// /projects/[slug] now read real rows from Supabase (see
// supabase/seed_projects.sql for the one-time script that seeds the same
// 5 projects that used to live here as static data). getCategoryIcon and
// translateCategory below are still generic, data-source-agnostic helpers
// used by both the real Projects section and Skills.tsx's categories, so
// they stay.

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
