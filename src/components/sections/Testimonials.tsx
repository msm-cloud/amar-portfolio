import { SectionContainer } from '@/components/ui/SectionContainer';
import { createClient } from '@/lib/supabase/server';
import { TestimonialsHeading } from './testimonials-heading';
import { TestimonialsMarquee } from './testimonials-marquee';

// Real Supabase data (not placeholder-data.ts) - testimonials has no
// `status` column (always public, per supabase/migrations/README.md), so
// unlike Projects/blog there's no draft/published filter needed here.
export async function Testimonials() {
  const supabase = await createClient();
  const { data: testimonials, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('display_order', { ascending: true })
    .order('id', { ascending: true });

  return (
    <SectionContainer id="testimonials">
      <TestimonialsHeading />
      <TestimonialsMarquee
        testimonials={testimonials ?? []}
        error={Boolean(error)}
      />
    </SectionContainer>
  );
}
