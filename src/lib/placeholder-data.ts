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
 */

const now = '2026-01-01T00:00:00.000Z';

// ============================================================================
// Projects
// ============================================================================

export type PlaceholderProject =
  Database['public']['Tables']['projects']['Row'];

export const PLACEHOLDER_PROJECTS: PlaceholderProject[] = [
  {
    id: 'proj-nexabank-dashboard',
    title: 'NexaBank Digital Operations Dashboard',
    title_bn: null,
    slug: 'nexabank-digital-operations-dashboard',
    description:
      'An internal web dashboard for daily branch operations — transaction monitoring, reconciliation, and reporting in one place.',
    description_bn: null,
    content:
      "Built for a mid-sized retail bank's operations team to replace a spreadsheet-driven workflow. The dashboard surfaces daily transaction volume, flags reconciliation mismatches automatically, and generates the end-of-day report that used to take an analyst most of an afternoon to assemble by hand.\n\nThe brief came directly from spending years on the operations side of financial-sector work myself: the dashboard is built around the reports and checks an ops team actually runs every day, not a generic admin template. Role-based access keeps branch staff, supervisors, and auditors each seeing only what's relevant to them.\n\nStack: Next.js App Router, Supabase (Postgres + Row Level Security for the role-based access), TypeScript throughout, Tailwind CSS for the UI.",
    content_bn: null,
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
    title_bn: null,
    slug: 'meghna-microfinance-loan-portal',
    description:
      'A client-facing portal for a microfinance institution to manage loan applications, repayment schedules, and disbursement status.',
    description_bn: null,
    content:
      "A microfinance institution needed to move loan applications online without asking rural and semi-urban borrowers to navigate anything complicated. The result is a deliberately simple, mobile-first portal: applicants track their application status, view their repayment schedule, and get notified of disbursement, all in a handful of clear screens.\n\nBehind the scenes, staff manage the underwriting workflow through a matching internal panel, backed by the same database. Repayment schedule calculations follow the institution's actual amortization rules rather than a generic formula.\n\nStack: React, Node.js, PostgreSQL. Delivered as a client project — source is private, but the live portal is linked below.",
    content_bn: null,
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
    title_bn: null,
    slug: 'aranya-handicrafts-brand-identity',
    description:
      'Full brand identity for an artisan handicrafts cooperative — logo, color system, packaging, and a printed catalog.',
    description_bn: null,
    content:
      "A handicrafts cooperative needed a brand identity that felt handmade and warm without looking amateur — a common tension for artisan brands competing against mass-market packaging. The mark draws on traditional weaving patterns, translated into a simple geometric logotype that still reproduces cleanly at small sizes (a tag on a woven basket, a stamp on a box).\n\nDeliverables covered the full identity system: logo and variations, a color palette pulled from the cooperative's actual dye materials, packaging templates, and a printed product catalog for trade shows.\n\nTools: Illustrator for the mark and vector system, Photoshop for photography retouching and packaging mockups.",
    content_bn: null,
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
    title_bn: null,
    slug: 'personal-budget-tracker',
    description:
      'An open-source personal finance app for tracking spending against monthly budgets by category, with simple charts.',
    description_bn: null,
    content:
      "A side project born out of wanting a budgeting app that does exactly one thing well: compare actual spending against a monthly budget, per category, without the account-linking, subscriptions, or feature bloat of most commercial budgeting apps.\n\nEntries are logged manually (by design — it keeps the data model simple and avoids bank-linking security concerns entirely), categorized, and charted against each category's monthly limit. Built and open-sourced as a way to keep React and Tailwind skills sharp between client work.\n\nStack: React, Tailwind CSS, stored locally in the browser (no backend required).",
    content_bn: null,
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
    title_bn: null,
    slug: 'city-savings-cooperative-print-campaign',
    description:
      'A print and in-branch campaign encouraging members to switch to paperless statements, designed for a savings cooperative.',
    description_bn: null,
    content:
      "A savings cooperative wanted to move more members onto paperless statements ahead of a system migration, but their existing member base skewed toward people who trusted paper. The campaign leaned into that directly rather than fighting it: plain-language posters and flyers explaining exactly what would (and wouldn't) change, distributed across branch locations and mailed with the final paper statement.\n\nDesign work covered the full print set — branch posters, counter flyers, and statement-insert cards — kept consistent with the cooperative's existing brand rather than introducing a new visual identity.\n\nTools: InDesign for layout, Illustrator for supporting iconography.",
    content_bn: null,
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
    title_bn: null,
    organization: 'Self-Employed',
    organization_bn: null,
    description:
      'Design and build websites, web apps, and brand identities for clients — including financial institutions — end to end: from UI design through frontend, backend, and database work.',
    description_bn: null,
    start_date: '2024-01-01',
    end_date: null,
    is_current: true,
    display_order: 1,
  },
  {
    id: 'exp-city-savings',
    title: 'Operations Officer',
    title_bn: null,
    organization: 'City Savings Cooperative',
    organization_bn: null,
    description:
      'Managed daily branch operations, transaction reconciliation, and reporting for a savings cooperative. The same operational rigor — accuracy, auditability, no room for "close enough" — now shapes how I build software.',
    description_bn: null,
    start_date: '2021-06-01',
    end_date: '2023-12-31',
    is_current: false,
    display_order: 2,
  },
  {
    id: 'exp-web-developer',
    title: 'Web Developer',
    title_bn: null,
    organization: 'Pixel & Ledger Studio',
    organization_bn: null,
    description:
      'Built client websites and web apps end to end, handling both frontend design and backend implementation for small-business and local-organization clients.',
    description_bn: null,
    start_date: '2019-01-01',
    end_date: '2021-05-31',
    is_current: false,
    display_order: 3,
  },
  {
    id: 'exp-design-intern',
    title: 'Graphic Design Intern',
    title_bn: null,
    organization: 'Studio Nirjhor',
    organization_bn: null,
    description:
      'Assisted senior designers on branding and print projects — logo exploration, packaging mockups, and print-ready file preparation.',
    description_bn: null,
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
 * `Date` (avoids timezone-shift bugs when parsing a bare date string). */
export function formatMonthYear(isoDate: string): string {
  const [year, month] = isoDate.split('-');
  const monthLabel = MONTH_ABBREVIATIONS[Number(month) - 1] ?? '';
  return `${monthLabel} ${year}`.trim();
}

export function formatExperienceDateRange(
  entry: PlaceholderExperience
): string {
  const start = formatMonthYear(entry.start_date);
  const end =
    entry.is_current || !entry.end_date
      ? 'Present'
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
    title_bn: null,
    issuing_organization: 'University of Dhaka',
    issuing_organization_bn: null,
    issue_date: '2018-12-01',
    credential_url: null,
    image_url: null,
    display_order: 1,
  },
  {
    id: 'cert-bibm-diploma',
    title: 'Diploma in Banking',
    title_bn: null,
    issuing_organization: 'Bangladesh Institute of Bank Management (BIBM)',
    issuing_organization_bn: null,
    issue_date: '2022-03-01',
    credential_url: 'https://example.com',
    image_url: null,
    display_order: 2,
  },
  {
    id: 'cert-meta-frontend',
    title: 'Meta Front-End Developer Professional Certificate',
    title_bn: null,
    issuing_organization: 'Meta (via Coursera)',
    issuing_organization_bn: null,
    issue_date: '2023-08-01',
    credential_url: 'https://example.com',
    image_url: null,
    display_order: 3,
  },
  {
    id: 'cert-adobe-photoshop',
    title: 'Adobe Certified Professional — Photoshop',
    title_bn: null,
    issuing_organization: 'Adobe',
    issuing_organization_bn: null,
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
