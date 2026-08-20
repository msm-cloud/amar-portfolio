import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Code2, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { buttonVariants } from '@/components/ui/Button';
import { CoverImage } from '@/components/ui/CoverImage';
import { SectionContainer } from '@/components/ui/SectionContainer';
import {
  getCategoryIcon,
  getPlaceholderProjectBySlug,
  PLACEHOLDER_PROJECTS,
} from '@/lib/placeholder-data';

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

  const CategoryIcon = getCategoryIcon(project.category);
  // Placeholder content uses "\n\n" as a paragraph break; a real rich-text
  // field (HTML from an editor) will replace this rendering entirely.
  const paragraphs = (project.content ?? '')
    .split('\n\n')
    .filter((p) => p.trim().length > 0);

  return (
    <main className="flex flex-1 flex-col">
      <CoverImage
        src={project.cover_image_url}
        alt={project.title}
        icon={CategoryIcon}
        className="h-64 w-full sm:h-80 lg:h-96"
      />

      <SectionContainer className="max-w-3xl">
        <Link
          href="/#projects"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to Projects
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          {project.category && <Badge>{project.category}</Badge>}
          {project.tags.map((tag) => (
            <Badge key={tag} className="bg-muted text-muted-foreground">
              {tag}
            </Badge>
          ))}
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {project.title}
        </h1>

        {project.description && (
          <p className="mt-3 text-lg text-muted-foreground">
            {project.description}
          </p>
        )}

        {(project.project_url || project.github_url) && (
          <div className="mt-6 flex flex-wrap gap-3">
            {project.project_url && (
              <a
                href={project.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: 'primary' })}
              >
                <ExternalLink className="mr-2 h-4 w-4" aria-hidden />
                Live Site
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: 'outline' })}
              >
                <Code2 className="mr-2 h-4 w-4" aria-hidden />
                View Code
              </a>
            )}
          </div>
        )}

        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-8">
          {paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className="leading-relaxed text-foreground/90 whitespace-pre-line"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </SectionContainer>
    </main>
  );
}
