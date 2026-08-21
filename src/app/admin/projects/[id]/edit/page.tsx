import { notFound, redirect } from 'next/navigation';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { createClient } from '@/lib/supabase/server';

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defense in depth - see the same note in admin/dashboard/page.tsx.
  // Both 'admin' and 'editor' roles reach this page fine - see the same
  // note in new/page.tsx.
  if (!user) {
    redirect('/admin/login');
  }

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!project) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Edit Project</h1>
      <div className="mt-6 max-w-3xl">
        <ProjectForm mode="edit" project={project} />
      </div>
    </div>
  );
}
