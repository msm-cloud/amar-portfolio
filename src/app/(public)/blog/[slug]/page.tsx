import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DOMPurify from 'isomorphic-dompurify';
import { ArrowLeft, Newspaper } from 'lucide-react';
import { CoverImage } from '@/components/ui/CoverImage';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { GiscusComments } from '@/components/blog/GiscusComments';
import { createClient } from '@/lib/supabase/server';
import { estimateReadingTime, formatPublishedDate } from '@/lib/blog';

// Real Supabase data - see the note in src/lib/blog.ts about bilingual
// blog support being a later enhancement, not built here.

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
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to Blog
        </Link>

        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {post.title}
        </h1>

        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <span>{formatPublishedDate(post.published_at)}</span>
          <span aria-hidden>·</span>
          <span>{estimateReadingTime(post.content)} min read</span>
        </div>

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
