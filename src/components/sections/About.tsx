import { createClient } from '@/lib/supabase/server';
import { AboutContent } from './about-content';

// Real Supabase data (not hardcoded placeholder text) - see the same note
// in Hero.tsx about site_settings being a singleton with no draft/
// published or empty-list state to handle.
export async function About() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single();

  return <AboutContent settings={settings} />;
}
