import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DOMPurify from 'isomorphic-dompurify';
import { Newspaper } from 'lucide-react';
import { CoverImage } from '@/components/ui/CoverImage';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { GiscusComments } from '@/components/blog/GiscusComments';
import { createClient } from '@/lib/supabase/server';
import { BlogBackLink, BlogPostMeta } from './blog-post-chrome';

// Real Supabase data - see the note in src/lib/blog.ts about bilingual
// blog *content* support being a later enhancement, not built here. The
// static chrome around it (back link, date/reading-time labels) is
// bilingual though - see blog-post-chrome.tsx.

async function getPublishedPostBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    return { title: 'Post not found' };
  }

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.cover_image_url ? [{ url: post.cover_image_url }] : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Sanitize before dangerouslySetInnerHTML: content is admin/editor-
  // authored (RLS-protected write access), but rendering it raw to every
  // public visitor is still worth defending - see isomorphic-dompurify in
  // package.json.
  const safeContentHtml = DOMPurify.sanitize(post.content ?? '');

  return (
    <main className="flex flex-1 flex-col">
      <CoverImage
        src={post.cover_image_url}
        alt={post.title}
        icon={Newspaper}
        className="h-64 w-full sm:h-80 lg:h-96"
      />

      <SectionContainer className="max-w-3xl">
        <BlogBackLink />

        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {post.title}
        </h1>

        <BlogPostMeta publishedAt={post.published_at} content={post.content} />

        <div
          className="prose prose-neutral dark:prose-invert mt-10 max-w-none border-t border-border pt-8"
          dangerouslySetInnerHTML={{ __html: safeContentHtml }}
        />

        <div className="mt-12 border-t border-border pt-8">
          <GiscusComments />
        </div>
      </SectionContainer>
    </main>
  );
}
