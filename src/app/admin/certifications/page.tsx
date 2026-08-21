import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Pencil, Plus } from 'lucide-react';
import { buttonVariants } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/server';
import { formatMonthYear } from '@/lib/placeholder-data';
import { DeleteCertificationButton } from './delete-certification-button';
import { MoveCertificationButtons } from './move-certification-buttons';

export default async function AdminCertificationsListPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defense in depth - see the same note in admin/dashboard/page.tsx.
  if (!user) {
    redirect('/admin/login');
  }

  // Same ordering moveCertification's swap logic assumes. `id` is the
  // tie-break for rows sharing a display_order (certifications has no
  // created_at column, unlike projects).
  const { data: certifications, error } = await supabase
    .from('certifications')
    .select(
      'id, title, issuing_organization, issue_date, display_order'
    )
    .order('display_order', { ascending: true })
    .order('id', { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">
          Certifications
        </h1>
        <Link
          href="/admin/certifications/new"
          className={buttonVariants({ variant: 'primary', size: 'sm' })}
        >
          <Plus className="mr-1.5 h-4 w-4" aria-hidden />
          New Certification
        </Link>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">
          Failed to load certifications. Please refresh and try again.
        </p>
      )}

      {!error && (certifications?.length ?? 0) === 0 && (
        <p className="mt-6 text-sm text-muted-foreground">
          No certifications yet — click &quot;New Certification&quot; to add
          the first one.
        </p>
      )}

      {!error && (certifications?.length ?? 0) > 0 && (
        <ul className="mt-6 flex flex-col divide-y divide-border">
          {certifications!.map((cert, index) => (
            <li key={cert.id} className="flex items-center gap-4 py-4">
              <MoveCertificationButtons
                id={cert.id}
                disableUp={index === 0}
                disableDown={index === certifications!.length - 1}
              />

              <div className="min-w-0 flex-1">
                <span className="truncate text-sm font-medium text-foreground">
                  {cert.title}
                </span>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {cert.issuing_organization}
                  {cert.issue_date && ` · ${formatMonthYear(cert.issue_date)}`}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/admin/certifications/${cert.id}/edit`}
                  className={buttonVariants({
                    variant: 'outline',
                    size: 'sm',
                  })}
                >
                  <Pencil className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                  Edit
                </Link>
                <DeleteCertificationButton id={cert.id} title={cert.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
