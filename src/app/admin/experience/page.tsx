import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Pencil, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { buttonVariants } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/server';
import { formatMonthYear } from '@/lib/placeholder-data';
import { DeleteExperienceButton } from './delete-experience-button';
import { MoveExperienceButtons } from './move-experience-buttons';

export default async function AdminExperienceListPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defense in depth - see the same note in admin/dashboard/page.tsx.
  if (!user) {
    redirect('/admin/login');
  }

  // Ordered by display_order here (for the reorder buttons) - the public
  // Experience section sorts by start_date instead, see moveExperience's
  // own note on why that's a deliberate difference. `id` is the tie-break
  // for rows sharing a display_order (experience has no created_at
  // column, unlike projects).
  const { data: entries, error } = await supabase
    .from('experience')
    .select(
      'id, title, organization, start_date, end_date, is_current, display_order'
    )
    .order('display_order', { ascending: true })
    .order('id', { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Experience</h1>
        <Link
          href="/admin/experience/new"
          className={buttonVariants({ variant: 'primary', size: 'sm' })}
        >
          <Plus className="mr-1.5 h-4 w-4" aria-hidden />
          New Experience
        </Link>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">
          Failed to load experience entries. Please refresh and try again.
        </p>
      )}

      {!error && (entries?.length ?? 0) === 0 && (
        <p className="mt-6 text-sm text-muted-foreground">
          No experience entries yet — click &quot;New Experience&quot; to add
          the first one.
        </p>
      )}

      {!error && (entries?.length ?? 0) > 0 && (
        <ul className="mt-6 flex flex-col divide-y divide-border">
          {entries!.map((entry, index) => (
            <li key={entry.id} className="flex items-center gap-4 py-4">
              <MoveExperienceButtons
                id={entry.id}
                disableUp={index === 0}
                disableDown={index === entries!.length - 1}
              />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="truncate text-sm font-medium text-foreground">
                    {entry.title}
                  </span>
                  {entry.is_current && <Badge>Present</Badge>}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {entry.organization} · {formatMonthYear(entry.start_date)} —{' '}
                  {entry.is_current || !entry.end_date
                    ? 'Present'
                    : formatMonthYear(entry.end_date)}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/admin/experience/${entry.id}/edit`}
                  className={buttonVariants({
                    variant: 'outline',
                    size: 'sm',
                  })}
                >
                  <Pencil className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                  Edit
                </Link>
                <DeleteExperienceButton id={entry.id} title={entry.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
