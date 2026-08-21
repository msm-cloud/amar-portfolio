import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Code2, Layers, Mail, Newspaper } from 'lucide-react';
import { BentoCard } from '@/components/ui/BentoCard';
import { createClient } from '@/lib/supabase/server';
import { formatPublishedDate } from '@/lib/blog';
import { AdminWelcomeCard } from './admin-welcome-card';

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

  // One round trip per count (head: true fetches no rows, just the count)
  // rather than pulling every row down just to call .length - all run
  // concurrently, not sequentially.
  const [
    { data: profile },
    { data: settings },
    { count: totalProjects },
    { count: publishedProjects },
    { count: totalPosts },
    { count: publishedPosts },
    { count: unreadMessages },
    { count: totalSkills },
    { count: totalTestimonials },
    { count: totalCertifications },
    { data: recentMessages },
  ] = await Promise.all([
    supabase.from('profiles').select('full_name, role').eq('id', user.id).single(),
    supabase
      .from('site_settings')
      .select('full_name, profile_photo_url')
      .eq('id', 1)
      .single(),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published'),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
    supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published'),
    supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false),
    supabase.from('skills').select('*', { count: 'exact', head: true }),
    supabase
      .from('testimonials')
      .select('*', { count: 'exact', head: true }),
    supabase
      .from('certifications')
      .select('*', { count: 'exact', head: true }),
    supabase
      .from('contact_messages')
      .select('id, name, subject, created_at')
      .order('created_at', { ascending: false })
      .limit(3),
  ]);

  // site_settings.full_name (the public-facing name) takes priority over
  // profiles.full_name (which most people never bother setting during
  // signup) - falls all the way back to the auth email if neither is set.
  const displayName = settings?.full_name || profile?.full_name || user.email || 'there';
  const role = profile?.role ?? 'unknown';
  const contentItemsTotal =
    (totalSkills ?? 0) + (totalTestimonials ?? 0) + (totalCertifications ?? 0);

  return (
    <div className="flex flex-col gap-6">
      <AdminWelcomeCard
        displayName={displayName}
        role={role}
        photoUrl={settings?.profile_photo_url ?? null}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <BentoCard className="flex h-full flex-col gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Code2 className="h-5 w-5" aria-hidden />
          </span>
          <p className="text-2xl font-semibold text-foreground">
            {totalProjects ?? 0}
          </p>
          <p className="text-sm text-muted-foreground">Projects</p>
          <p className="mt-auto text-xs text-muted-foreground">
            {publishedProjects ?? 0} published ·{' '}
            {(totalProjects ?? 0) - (publishedProjects ?? 0)} draft
          </p>
        </BentoCard>

        <Link href="/admin/messages" className="block h-full">
          <BentoCard className="flex h-full flex-col gap-2 transition-shadow hover:shadow-md">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Mail className="h-5 w-5" aria-hidden />
            </span>
            <p className="text-2xl font-semibold text-foreground">
              {unreadMessages ?? 0}
            </p>
            <p className="text-sm text-muted-foreground">Unread Messages</p>
            <p className="mt-auto text-xs text-primary">View all →</p>
          </BentoCard>
        </Link>

        <BentoCard className="flex h-full flex-col gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Newspaper className="h-5 w-5" aria-hidden />
          </span>
          <p className="text-2xl font-semibold text-foreground">
            {totalPosts ?? 0}
          </p>
          <p className="text-sm text-muted-foreground">Blog Posts</p>
          <p className="mt-auto text-xs text-muted-foreground">
            {publishedPosts ?? 0} published ·{' '}
            {(totalPosts ?? 0) - (publishedPosts ?? 0)} draft
          </p>
        </BentoCard>

        <BentoCard className="flex h-full flex-col gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Layers className="h-5 w-5" aria-hidden />
          </span>
          <p className="text-2xl font-semibold text-foreground">
            {contentItemsTotal}
          </p>
          <p className="text-sm text-muted-foreground">Content Items</p>
          <p className="mt-auto text-xs text-muted-foreground">
            {totalSkills ?? 0} skills · {totalTestimonials ?? 0} testimonials
            · {totalCertifications ?? 0} certifications
          </p>
        </BentoCard>
      </div>

      {recentMessages && recentMessages.length > 0 && (
        <BentoCard className="flex flex-col gap-1">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              Recent Messages
            </h2>
            <Link
              href="/admin/messages"
              className="text-xs font-medium text-primary hover:underline"
            >
              View all →
            </Link>
          </div>
          <ul className="flex flex-col divide-y divide-border">
            {recentMessages.map((message) => (
              <li key={message.id} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {message.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {message.subject || 'No subject'}
                  </p>
                </div>
                <p className="shrink-0 text-xs text-muted-foreground">
                  {formatPublishedDate(message.created_at)}
                </p>
              </li>
            ))}
          </ul>
        </BentoCard>
      )}
    </div>
  );
}
