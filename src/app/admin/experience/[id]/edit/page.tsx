import { notFound, redirect } from 'next/navigation';
import { ExperienceForm } from '@/components/admin/ExperienceForm';
import { createClient } from '@/lib/supabase/server';

export default async function EditExperiencePage({
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

  const { data: experience } = await supabase
    .from('experience')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!experience) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">
        Edit Experience
      </h1>
      <div className="mt-6 max-w-2xl">
        <ExperienceForm mode="edit" experience={experience} />
      </div>
    </div>
  );
}
