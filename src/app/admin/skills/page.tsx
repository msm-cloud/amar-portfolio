import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Pencil, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { buttonVariants } from '@/components/ui/Button';
import { ProficiencyDots } from '@/components/ui/ProficiencyDots';
import { createClient } from '@/lib/supabase/server';
import { DeleteSkillButton } from './delete-skill-button';
import { MoveSkillButtons } from './move-skill-buttons';

export default async function AdminSkillsListPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defense in depth - see the same note in admin/dashboard/page.tsx.
  if (!user) {
    redirect('/admin/login');
  }

  // Flat list ordered by display_order (not grouped by category, unlike
  // the public section) - same ordering moveSkill's swap logic assumes.
  // `id` is the tie-break for rows sharing a display_order (skills has no
  // created_at column, unlike projects).
  const { data: skills, error } = await supabase
    .from('skills')
    .select('id, name, category, proficiency_level, display_order')
    .order('display_order', { ascending: true })
    .order('id', { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Skills</h1>
        <Link
          href="/admin/skills/new"
          className={buttonVariants({ variant: 'primary', size: 'sm' })}
        >
          <Plus className="mr-1.5 h-4 w-4" aria-hidden />
          New Skill
        </Link>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">
          Failed to load skills. Please refresh and try again.
        </p>
      )}

      {!error && (skills?.length ?? 0) === 0 && (
        <p className="mt-6 text-sm text-muted-foreground">
          No skills yet — click &quot;New Skill&quot; to add the first one.
        </p>
      )}

      {!error && (skills?.length ?? 0) > 0 && (
        <ul className="mt-6 flex flex-col divide-y divide-border">
          {skills!.map((skill, index) => (
            <li key={skill.id} className="flex items-center gap-4 py-4">
              <MoveSkillButtons
                id={skill.id}
                disableUp={index === 0}
                disableDown={index === skills!.length - 1}
              />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="truncate text-sm font-medium text-foreground">
                    {skill.name}
                  </span>
                  {skill.category && <Badge>{skill.category}</Badge>}
                </div>
                <div className="mt-1">
                  <ProficiencyDots level={skill.proficiency_level ?? 0} />
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/admin/skills/${skill.id}/edit`}
                  className={buttonVariants({
                    variant: 'outline',
                    size: 'sm',
                  })}
                >
                  <Pencil className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                  Edit
                </Link>
                <DeleteSkillButton id={skill.id} name={skill.name} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
