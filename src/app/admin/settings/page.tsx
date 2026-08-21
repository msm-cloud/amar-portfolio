import { redirect } from 'next/navigation';
import { SiteSettingsForm } from '@/components/admin/SiteSettingsForm';
import { createClient } from '@/lib/supabase/server';

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defense in depth - see the same note in admin/dashboard/page.tsx.
  if (!user) {
    redirect('/admin/login');
  }

  // Singleton row (id = 1) - always exists, seeded by the
  // site_settings migration itself, so there's no "no settings yet"
  // empty state to handle here the way other admin lists have.
  const { data: settings, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single();

  if (error || !settings) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Site Settings
        </h1>
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">
          Failed to load site settings. Please refresh and try again.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">
        Site Settings
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Controls the Hero and About sections&rsquo; content on the public
        homepage.
      </p>
      <div className="mt-6 max-w-2xl">
        <SiteSettingsForm settings={settings} />
      </div>
    </div>
  );
}
