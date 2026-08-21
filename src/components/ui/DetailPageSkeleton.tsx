import { SectionContainer } from './SectionContainer';

/**
 * Shared loading skeleton for the blog post and project detail pages -
 * both share the same cover image + back-link + title + meta-row + prose
 * shape, so one skeleton covers both routes' loading.tsx (rendered
 * automatically by Next.js while each page's async Server Component
 * fetches its data, avoiding a blank flash).
 */
export function DetailPageSkeleton() {
  return (
    <main className="flex flex-1 flex-col">
      <div
        aria-hidden
        className="h-64 w-full animate-pulse bg-muted sm:h-80 lg:h-96"
      />
      <SectionContainer className="max-w-3xl">
        <div aria-hidden className="mb-8 h-4 w-24 animate-pulse rounded bg-muted" />
        <div aria-hidden className="h-9 w-3/4 animate-pulse rounded bg-muted" />
        <div aria-hidden className="mt-3 h-4 w-40 animate-pulse rounded bg-muted" />
        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-8">
          <div aria-hidden className="h-4 w-full animate-pulse rounded bg-muted" />
          <div aria-hidden className="h-4 w-full animate-pulse rounded bg-muted" />
          <div aria-hidden className="h-4 w-5/6 animate-pulse rounded bg-muted" />
        </div>
      </SectionContainer>
    </main>
  );
}
