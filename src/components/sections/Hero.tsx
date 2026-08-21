import { createClient } from '@/lib/supabase/server';
import { HeroContent } from './hero-content';

// Real Supabase data (not hardcoded placeholder text) - site_settings is a
// singleton (id = 1, seeded by its own migration), always publicly
// readable, so there's no draft/published filter or empty-list state
// needed here, just a null-safe fallback in HeroContent for the (should
// never happen) case the query itself fails.
export async function Hero() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single();

  return <HeroContent settings={settings} />;
}
