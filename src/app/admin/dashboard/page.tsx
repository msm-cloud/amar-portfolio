import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defense in depth: proxy.ts (src/lib/supabase/proxy.ts) already redirects
  // unauthenticated/roleless requests away from /admin/* before this page
  // renders, but don't rely on that alone — verify here too, per Next.js's
  // own guidance on Proxy not being a substitute for per-route auth checks.
  if (!user) {
    redirect('/admin/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single();

  const displayName = profile?.full_name || user.email || 'there';

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Welcome, {displayName}
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Role: <span className="font-medium">{profile?.role ?? 'unknown'}</span>
      </p>
    </div>
  );
}
