import { redirect } from 'next/navigation';
import { SkillForm } from '@/components/admin/SkillForm';
import { createClient } from '@/lib/supabase/server';

export default async function NewSkillPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defense in depth - see the same note in admin/dashboard/page.tsx.
  // Both 'admin' and 'editor' roles reach this page fine: the form itself
  // has no role-specific UI, and the actual write is authorized by RLS
  // (skills_write_admin_editor), not by anything checked here.
  if (!user) {
    redirect('/admin/login');
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">New Skill</h1>
      <div className="mt-6 max-w-xl">
        <SkillForm mode="create" />
      </div>
    </div>
  );
}
