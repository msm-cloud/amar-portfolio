import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { createStaticClient } from '@/lib/supabase/server';

// Regenerate at most once an hour - cheap for crawlers, and fresh enough
// that a newly published project/post shows up without a full redeploy
// (same revalidate window as /projects/[slug]'s own ISR fallback).
export const revalidate = 3600;

// Uses createStaticClient (not createClient) - same reason as
// generateStaticParams in /projects/[slug]/page.tsx: this can run outside
// an actual request (at build time / on a background revalidation), where
// Next.js disallows the cookie-aware client's cookies() call.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createStaticClient();

  const [{ data: projects }, { data: posts }] = await Promise.all([
    supabase
      .from('projects')
      .select('slug, updated_at')
      .eq('status', 'published'),
    supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('status', 'published'),
  ]);

  const projectEntries: MetadataRoute.Sitemap = (projects ?? []).map(
    (project) => ({
      url: `${siteConfig.url}/projects/${project.slug}`,
      lastModified: project.updated_at,
    })
  );

  const postEntries: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: post.updated_at,
  }));

  return [
    { url: siteConfig.url, lastModified: new Date(), priority: 1 },
    { url: `${siteConfig.url}/blog`, lastModified: new Date() },
    ...projectEntries,
    ...postEntries,
  ];
}
