import { createClient } from '@/lib/supabase/server';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { BlogHeading } from './blog-heading';
import { BlogList } from './blog-list';

// Real Supabase data (not placeholder-data.ts) - this is the first
// section reading live content instead of the placeholder system. RLS
// already restricts anon/public SELECT to status = 'published' rows
// (blog_posts_select_published policy), but the query is explicit about
// it too, as a defense-in-depth match for the brief's requirement.
//
// Static UI chrome (heading, empty/error state) is bilingual - BlogHeading
// and BlogList are both Client Components for the language context, same
// split as every other migrated section. Post title/excerpt/content stay
// in whatever single language the admin wrote them in - see the note in
// src/lib/blog.ts on why full bilingual *post content* isn't built here.
export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  return (
    <main className="flex flex-1 flex-col">
      <SectionContainer>
        <BlogHeading />
        <BlogList posts={posts ?? []} error={Boolean(error)} />
      </SectionContainer>
    </main>
  );
}
