import {
  Award,
  Banknote,
  Code2,
  GraduationCap,
  Landmark,
  Palette,
  type LucideIcon,
} from 'lucide-react';
import type { Language } from '@/lib/language-context';

/**
 * lib/placeholder-data.ts
 * -----------------------
 * Originally held PLACEHOLDER DATA for every section reading from
 * Supabase - Projects, Experience, Certifications, and Testimonials have
 * all since migrated to real queries (see each section's own comment for
 * where its seed SQL lives), so what's left here is the generic,
 * data-source-agnostic helpers those sections (and Skills, still
 * placeholder) share: `pickBilingual` (bilingual-toggle fallback),
 * `getCategoryIcon`/`translateCategory` (project categories),
 * `formatMonthYear`/`formatExperienceDateRange` (date formatting), and
 * `getCertificationIcon`. None of these import `Database` or depend on
 * any specific table's Row shape anymore - they take plain values or
 * small structural types instead, so they work equally well against
 * placeholder data or a real Supabase row.
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
// on why they don't get a `_bn` column. Covers every project category
// value plus Skills.tsx's own categories. Individual skill/tag names
// (React, TypeScript, Banking, ...) are intentionally NOT translated -
// they're proper nouns / established English tech terms, same convention
// as person and company names elsewhere in this data.
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
//
// The placeholder experience array itself has been retired -
// Experience.tsx now reads real rows from Supabase (see
// supabase/seed_experience.sql for the one-time script that seeds the
// same 4 entries that used to live here as static data).
// formatExperienceDateRange below is still a generic, data-source-agnostic
// helper (takes a plain structural shape, not a "Placeholder" type), so it
// stays.

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
  entry: { start_date: string; end_date: string | null; is_current: boolean },
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
//
// The placeholder certifications array itself has been retired -
// Certifications.tsx now reads real rows from Supabase (see
// supabase/seed_certifications.sql for the one-time script that seeds the
// same 4 entries that used to live here as static data).
// getCertificationIcon below is still a generic, data-source-agnostic
// helper (takes a plain structural shape, not a "Placeholder" type), so it
// stays.

/** Best-effort icon for a certification's badge, based on its title/org. */
export function getCertificationIcon(cert: {
  title: string;
  issuing_organization: string;
}): LucideIcon {
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
//
// The placeholder testimonials array itself has been retired -
// Testimonials.tsx now reads real rows from Supabase (see
// supabase/seed_testimonials.sql for the one-time script that seeds the
// same 6 testimonials that used to live here as static data).
