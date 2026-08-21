import { SectionContainer } from '@/components/ui/SectionContainer';
import { createClient } from '@/lib/supabase/server';
import { ExperienceHeading } from './experience-heading';
import { ExperienceTimeline } from './experience-timeline';

// Real Supabase data (not placeholder-data.ts) - experience has no
// `status` column (always public, per supabase/migrations/README.md), so
// unlike Projects/blog there's no draft/published filter needed here.
// Ordered by start_date descending - a resume timeline reads by when
// something happened, not by an admin-curated display_order (that column
// still exists and is used, but only for the *admin* list's reorder
// buttons - see moveExperience's own note on why).
export async function Experience() {
  const supabase = await createClient();
  const { data: entries, error } = await supabase
    .from('experience')
    .select('*')
    .order('start_date', { ascending: false });

  return (
    <SectionContainer id="experience">
      <ExperienceHeading />
      <ExperienceTimeline entries={entries ?? []} error={Boolean(error)} />
    </SectionContainer>
  );
}
