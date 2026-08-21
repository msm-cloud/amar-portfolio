/**
 * lib/blog.ts
 * -----------
 * Small helpers shared between the public blog listing/detail pages and
 * the admin blog list. Blog posts are real Supabase data (not part of the
 * placeholder-data.ts system used elsewhere), so these operate on
 * `Database['public']['Tables']['blog_posts']['Row']` directly rather
 * than a placeholder shape.
 *
 * Bilingual note: blog_posts has title_bn/excerpt_bn/content_bn columns
 * already (same schema pattern as everywhere else), but the public blog
 * pages deliberately only ever render the single language the admin
 * actually wrote (`title`/`excerpt`/`content`) - reading the _bn columns
 * for post *content* is a later enhancement, not built here. The static
 * chrome around that content (headings, "Back to Blog", empty/error
 * states, the "X min read" label) IS wired into the language toggle
 * though - see blog-heading.tsx, blog-list.tsx, and
 * blog/[slug]/blog-post-chrome.tsx.
 */

const WORDS_PER_MINUTE = 200;

/** Rough reading-time estimate from HTML content: strips tags, counts
 * words, divides by an average reading speed. Always at least 1 minute. */
export function estimateReadingTime(html: string | null): number {
  if (!html) return 1;
  const text = html.replace(/<[^>]*>/g, ' ');
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

/** Formats a full ISO timestamp (e.g. `published_at`, a `timestamptz`) as
 * "Month D, YYYY". Safe to parse directly with `Date` (unlike the bare
 * `YYYY-MM-DD` dates elsewhere in this app) since a timestamptz carries an
 * explicit instant, not just a calendar date. */
export function formatPublishedDate(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
