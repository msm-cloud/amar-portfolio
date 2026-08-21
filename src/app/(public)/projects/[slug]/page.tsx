import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DOMPurify from 'isomorphic-dompurify';
import { createClient, createStaticClient } from '@/lib/supabase/server';
import { ProjectDetailContent } from './project-detail-content';

// Real Supabase data (not placeholder-data.ts) - RLS already restricts
// anon/public SELECT to status = 'published' rows (the
// projects_select_published policy), but the query is explicit about it
// too, matching the same defense-in-depth convention as the /blog post
// page.

// Time-based ISR fallback so a project published directly in Supabase
// (bypassing revalidatePath - e.g. an edit made straight in the
// dashboard) still shows up within the hour. The admin CRUD server
// actions (projects.ts) already call revalidatePath(`/projects/${slug}`)
// on every create/update for the common case, so most edits appear
// immediately - this is just the safety net.
export const revalidate = 3600;

async function getPublishedProjectBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  return data;
}

// Pre-renders every currently-published slug at build time; `dynamicParams`
// defaults to true, so a slug published after the build (not in this list
// yet) still renders on its first request instead of 404ing, then joins
// the static cache for subsequent requests - exactly the "new projects
// show up without a full rebuild" behavior this needs.
//
// Uses createStaticClient (not createClient) - this runs at build time,
// and Next.js disallows calling cookies() (which the regular
// cookie-aware client needs) outside of an actual request.
export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from('projects')
    .select('slug')
    .eq('status', 'published');

  return (data ?? []).map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    return { title: 'Project not found' };
  }

  // Metadata is server-rendered before the language toggle can run, so
  // this always uses the English title/description - matching what a
  // search engine / share-link preview would see regardless of the
  // visitor's later in-page language choice.
  return {
    title: project.title,
    description: project.description ?? undefined,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  // Sanitize before dangerouslySetInnerHTML, same as the blog post page -
  // content is admin/editor-authored (RLS-protected write access), but
  // rendering it raw to every public visitor is still worth defending.
  // Done here (server-side) rather than in the client component so
  // isomorphic-dompurify never has to ship to the browser bundle.
  const safeContentHtml = DOMPurify.sanitize(project.content ?? '');
  const safeContentBnHtml = project.content_bn
    ? DOMPurify.sanitize(project.content_bn)
    : null;

  return (
    <ProjectDetailContent
      project={project}
      safeContentHtml={safeContentHtml}
      safeContentBnHtml={safeContentBnHtml}
    />
  );
}
