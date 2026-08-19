/**
 * types/
 * -----
 * Shared TypeScript types and interfaces used across the app.
 * Keep this file for cross-cutting types (e.g. nav items, site config shape).
 * Feature-specific types can live closer to their feature once the app grows.
 */

export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

// ============================================================================
// Domain types
// ----------------------------------------------------------------------------
// Clean, app-facing types mirroring the database schema (see
// types/database.ts and supabase/migrations/), but without Supabase's
// Insert/Update/Row wrapper metadata. Use these everywhere in the app
// instead of reaching into `Database['public']['Tables'][...]['Row']`
// directly — if the DB shape changes, only this file (and the mapping code
// that reads from Supabase) needs to change.
// ============================================================================

export type ProfileRole = 'admin' | 'editor';
export type ContentStatus = 'draft' | 'published';

export interface Profile {
  id: string;
  fullName: string | null;
  role: ProfileRole;
  avatarUrl: string | null;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  titleBn: string | null;
  slug: string;
  description: string | null;
  descriptionBn: string | null;
  content: string | null;
  contentBn: string | null;
  category: string | null;
  tags: string[];
  coverImageUrl: string | null;
  projectUrl: string | null;
  githubUrl: string | null;
  isFeatured: boolean;
  displayOrder: number;
  status: ContentStatus;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  nameBn: string | null;
  category: string | null;
  proficiencyLevel: number | null;
  iconName: string | null;
  displayOrder: number;
}

export interface Experience {
  id: string;
  title: string;
  titleBn: string | null;
  organization: string;
  organizationBn: string | null;
  description: string | null;
  descriptionBn: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  displayOrder: number;
}

export interface Certification {
  id: string;
  title: string;
  titleBn: string | null;
  issuingOrganization: string;
  issuingOrganizationBn: string | null;
  issueDate: string | null;
  credentialUrl: string | null;
  imageUrl: string | null;
  displayOrder: number;
}

export interface Testimonial {
  id: string;
  authorName: string;
  authorTitle: string | null;
  authorTitleBn: string | null;
  authorCompany: string | null;
  content: string;
  contentBn: string | null;
  avatarUrl: string | null;
  isFeatured: boolean;
  displayOrder: number;
}

export interface BlogPost {
  id: string;
  title: string;
  titleBn: string | null;
  slug: string;
  excerpt: string | null;
  excerptBn: string | null;
  content: string | null;
  contentBn: string | null;
  coverImageUrl: string | null;
  status: ContentStatus;
  publishedAt: string | null;
  author: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// ============================================================================
// Auth
// ----------------------------------------------------------------------------
// Minimal, app-facing shape for the signed-in admin/editor user — a trimmed
// combination of the Supabase auth user and their `profiles` row. Use this
// instead of passing around the full `@supabase/supabase-js` `User` object.
// ============================================================================

export interface AuthUser {
  id: string;
  email: string | null;
}

/** The signed-in user plus their profile — only ever exists for a session
 * that passed the admin/editor role check in middleware. */
export interface AuthenticatedAdmin {
  user: AuthUser;
  profile: Profile;
}
