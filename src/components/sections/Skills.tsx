import { SectionContainer } from '@/components/ui/SectionContainer';
import { createClient } from '@/lib/supabase/server';
import { SkillsGrid } from './skills-grid';
import { SkillsHeading } from './skills-heading';

// Real Supabase data (not placeholder-data.ts) - skills has no `status`
// column (always public, per supabase/migrations/README.md), so unlike
// Projects/blog there's no draft/published filter needed here.
export async function Skills() {
  const supabase = await createClient();
  const { data: skills, error } = await supabase
    .from('skills')
    .select('*')
    .order('display_order', { ascending: true })
    .order('id', { ascending: true });

  return (
    <SectionContainer id="skills">
      <SkillsHeading />
      <SkillsGrid skills={skills ?? []} error={Boolean(error)} />
    </SectionContainer>
  );
}
