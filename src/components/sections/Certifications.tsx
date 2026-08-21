import { SectionContainer } from '@/components/ui/SectionContainer';
import { createClient } from '@/lib/supabase/server';
import { CertificationsGrid } from './certifications-grid';
import { CertificationsHeading } from './certifications-heading';

// Real Supabase data (not placeholder-data.ts) - certifications has no
// `status` column (always public, per supabase/migrations/README.md), so
// unlike Projects/blog there's no draft/published filter needed here.
export async function Certifications() {
  const supabase = await createClient();
  const { data: certifications, error } = await supabase
    .from('certifications')
    .select('*')
    .order('display_order', { ascending: true })
    .order('id', { ascending: true });

  return (
    <SectionContainer id="certifications">
      <CertificationsHeading />
      <CertificationsGrid
        certifications={certifications ?? []}
        error={Boolean(error)}
      />
    </SectionContainer>
  );
}
