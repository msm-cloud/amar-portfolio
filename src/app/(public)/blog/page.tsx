import { createClient } from '@/lib/supabase/server';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { BlogList } from './blog-list';

// Real Supabase data (not placeholder-data.ts) - this is the first
// section reading live content instead of the placeholder system. RLS
// already restricts anon/public SELECT to status = 'published' rows
// (blog_posts_select_published policy), but the query is explicit about
// it too, as a defense-in-depth match for the brief's requirement.
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
        <SectionHeading eyebrow="Blog" title="Writing & Notes" />

        {error ? (
          <p className="text-sm text-red-600 dark:text-red-400">
            Failed to load posts. Please refresh and try again.
          </p>
        ) : (
          <BlogList posts={posts ?? []} />
        )}
      </SectionContainer>
    </main>
  );
}
