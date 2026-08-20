import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getPlaceholderProjectBySlug,
  PLACEHOLDER_PROJECTS,
} from '@/lib/placeholder-data';
import { ProjectDetailContent } from './project-detail-content';

// PLACEHOLDER data source - src/lib/placeholder-data.ts. Once the admin
// panel's content management is built, generateStaticParams and the page
// body below both swap to a Supabase query keyed on `slug`.

export function generateStaticParams() {
  return PLACEHOLDER_PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getPlaceholderProjectBySlug(slug);

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
  const project = getPlaceholderProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetailContent project={project} />;
}
