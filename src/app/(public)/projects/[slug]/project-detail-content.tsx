'use client';

import Link from 'next/link';
import { ArrowLeft, Code2, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { buttonVariants } from '@/components/ui/Button';
import { CoverImage } from '@/components/ui/CoverImage';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { useLanguage } from '@/lib/language-context';
import { useTranslation } from '@/lib/use-translation';
import { getCategoryIcon, pickBilingual, translateCategory } from '@/lib/placeholder-data';
import type { Database } from '@/types/database';

type ProjectRow = Database['public']['Tables']['projects']['Row'];

// Client Component so it can read the language toggle - split out from
// page.tsx (a Server Component, which handles data fetching / notFound()
// / generateMetadata / generateStaticParams / HTML sanitizing) rather
// than converting the whole page, same reason as the blog post page.
export function ProjectDetailContent({
  project,
  safeContentHtml,
  safeContentBnHtml,
}: {
  project: ProjectRow;
  safeContentHtml: string;
  safeContentBnHtml: string | null;
}) {
  const { language } = useLanguage();
  const { t } = useTranslation();

  const CategoryIcon = getCategoryIcon(project.category);
  const title = pickBilingual(project.title, project.title_bn, language);
  const description = project.description
    ? pickBilingual(project.description, project.description_bn, language)
    : null;
  // Falls back to the English content whenever a project has no Bangla
  // content filled in yet, rather than showing blank text - same
  // fallback semantics as pickBilingual, applied to the pre-sanitized
  // HTML strings instead of plain content_bn/content.
  const contentHtml =
    language === 'bn' && safeContentBnHtml ? safeContentBnHtml : safeContentHtml;

  return (
    <main className="flex flex-1 flex-col">
      <CoverImage
        src={project.cover_image_url}
        alt={title}
        icon={CategoryIcon}
        className="h-64 w-full sm:h-80 lg:h-96"
      />

      <SectionContainer className="max-w-3xl">
        <Link
          href="/#projects"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t('projects.backToProjects')}
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          {project.category && (
            <Badge>{translateCategory(project.category, language)}</Badge>
          )}
          {project.tags.map((tag) => (
            <Badge key={tag} className="bg-muted text-muted-foreground">
              {tag}
            </Badge>
          ))}
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>

        {description && (
          <p className="mt-3 text-lg text-muted-foreground">{description}</p>
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
                {t('projects.liveSite')}
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
                {t('projects.viewCode')}
              </a>
            )}
          </div>
        )}

        <div
          className="prose prose-neutral dark:prose-invert mt-10 max-w-none border-t border-border pt-8"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </SectionContainer>
    </main>
  );
}
