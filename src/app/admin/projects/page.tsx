import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Pencil, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { buttonVariants } from '@/components/ui/Button';
import { CoverImage } from '@/components/ui/CoverImage';
import { createClient } from '@/lib/supabase/server';
import { getCategoryIcon } from '@/lib/placeholder-data';
import { DeleteProjectButton } from './delete-project-button';
import { MoveProjectButtons } from './move-project-buttons';

export default async function AdminProjectsListPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defense in depth - see the same note in admin/dashboard/page.tsx.
  if (!user) {
    redirect('/admin/login');
  }

  // No status filter here (unlike the public homepage listing) - RLS's
  // projects_select_admin_editor policy already lets any admin/editor
  // session see drafts too, which is the whole point of this list. Same
  // ordering moveProject's swap logic assumes: display_order first,
  // created_at as the tie-break for rows that still share a value (e.g.
  // freshly created projects, which all default to 0).
  const { data: projects, error } = await supabase
    .from('projects')
    .select(
      'id, title, category, cover_image_url, status, is_featured, display_order'
    )
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Projects</h1>
        <Link
          href="/admin/projects/new"
          className={buttonVariants({ variant: 'primary', size: 'sm' })}
        >
          <Plus className="mr-1.5 h-4 w-4" aria-hidden />
          New Project
        </Link>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">
          Failed to load projects. Please refresh and try again.
        </p>
      )}

      {!error && (projects?.length ?? 0) === 0 && (
        <p className="mt-6 text-sm text-muted-foreground">
          No projects yet — click &quot;New Project&quot; to add the first
          one.
        </p>
      )}

      {!error && (projects?.length ?? 0) > 0 && (
        <ul className="mt-6 flex flex-col divide-y divide-border">
          {projects!.map((project, index) => {
            const CategoryIcon = getCategoryIcon(project.category);

            return (
              <li key={project.id} className="flex items-center gap-4 py-4">
                <MoveProjectButtons
                  id={project.id}
                  disableUp={index === 0}
                  disableDown={index === projects!.length - 1}
                />

                <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg">
                  <CoverImage
                    src={project.cover_image_url}
                    alt={project.title}
                    icon={CategoryIcon}
                    className="h-full w-full"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate text-sm font-medium text-foreground">
                      {project.title}
                    </span>
                    <Badge
                      className={
                        project.status === 'published'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }
                    >
                      {project.status === 'published' ? 'Published' : 'Draft'}
                    </Badge>
                    {project.is_featured && (
                      <Badge className="bg-accent/15 text-accent">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {project.category || 'Uncategorized'} · Order{' '}
                    {project.display_order}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className={buttonVariants({
                      variant: 'outline',
                      size: 'sm',
                    })}
                  >
                    <Pencil className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                    Edit
                  </Link>
                  <DeleteProjectButton id={project.id} title={project.title} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
