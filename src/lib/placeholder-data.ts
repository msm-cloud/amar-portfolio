import { Banknote, Code2, Palette, type LucideIcon } from 'lucide-react';
import type { Database } from '@/types/database';

/**
 * lib/placeholder-data.ts
 * -----------------------
 * PLACEHOLDER DATA — replace with real Supabase queries once the admin
 * panel's content management is built (e.g.
 * `await supabase.from('projects').select('*').eq('status', 'published')`).
 *
 * Typed directly as the `projects` table's real Row shape (see
 * src/types/database.ts / supabase/migrations/), not a hand-rolled
 * subset — every field a real query would return is present here, using
 * the exact same field names, so swapping this array for a Supabase
 * query result is mechanical: no renaming, no reshaping.
 *
 * Cover images are all `null` on purpose (no real assets yet) — the UI
 * (`CoverImage` component) falls back to a gradient + icon when
 * `cover_image_url` is null, which is what you'll actually see.
 */

export type PlaceholderProject =
  Database['public']['Tables']['projects']['Row'];

const now = '2026-01-01T00:00:00.000Z';

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
