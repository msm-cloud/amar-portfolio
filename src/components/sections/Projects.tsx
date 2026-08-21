import { SectionContainer } from '@/components/ui/SectionContainer';
import { createClient } from '@/lib/supabase/server';
import { ProjectsGrid } from './projects-grid';
import { ProjectsHeading } from './projects-heading';

// Real Supabase data (not placeholder-data.ts) - RLS already restricts
// anon/public SELECT to status = 'published' rows (the
// projects_select_published policy), but the query is explicit about it
// too, matching the same defense-in-depth convention as the /blog
// listing. Featured projects sort first (for ProjectsGrid's bento-style
// large/wide tiles), then by the admin-controlled display_order.
export async function Projects() {
  const supabase = await createClient();
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'published')
    .order('is_featured', { ascending: false })
    .order('display_order', { ascending: true });

  return (
    <SectionContainer id="projects">
      <ProjectsHeading />
      <ProjectsGrid projects={projects ?? []} error={Boolean(error)} />
    </SectionContainer>
  );
}
