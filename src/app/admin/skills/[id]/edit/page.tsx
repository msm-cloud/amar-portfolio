import { notFound, redirect } from 'next/navigation';
import { SkillForm } from '@/components/admin/SkillForm';
import { createClient } from '@/lib/supabase/server';

export default async function EditSkillPage({
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

  const { data: skill } = await supabase
    .from('skills')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!skill) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Edit Skill</h1>
      <div className="mt-6 max-w-xl">
        <SkillForm mode="edit" skill={skill} />
      </div>
    </div>
  );
}
