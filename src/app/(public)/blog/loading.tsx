import { BentoCard } from '@/components/ui/BentoCard';
import { SectionContainer } from '@/components/ui/SectionContainer';

// Rendered automatically by Next.js while page.tsx's async Server
// Component fetches posts, avoiding a blank flash. Card count/shape
// mirrors BlogList's actual grid so the swap-in doesn't jump around.
export default function Loading() {
  return (
    <main className="flex flex-1 flex-col">
      <SectionContainer>
        <div className="mb-10 max-w-2xl">
          <div aria-hidden className="mb-2 h-4 w-16 animate-pulse rounded bg-muted" />
          <div aria-hidden className="h-8 w-72 animate-pulse rounded bg-muted" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <BentoCard key={i} className="flex flex-col gap-3 overflow-hidden">
              <div aria-hidden className="h-40 w-full animate-pulse rounded-xl bg-muted" />
              <div aria-hidden className="h-5 w-3/4 animate-pulse rounded bg-muted" />
              <div aria-hidden className="h-4 w-full animate-pulse rounded bg-muted" />
              <div aria-hidden className="mt-auto h-3 w-1/3 animate-pulse rounded bg-muted" />
            </BentoCard>
          ))}
        </div>
      </SectionContainer>
    </main>
  );
}
