import type { ReactNode } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { signOut } from '@/server/actions/auth';
import { SubmitButton } from '@/components/ui/SubmitButton';
import type { NavItem } from '@/types';

const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Projects', href: '/admin/projects' },
  { label: 'Skills', href: '/admin/skills' },
  { label: 'Experience', href: '/admin/experience' },
  { label: 'Certifications', href: '/admin/certifications' },
  { label: 'Testimonials', href: '/admin/testimonials' },
  { label: 'Blog', href: '/admin/blog' },
  { label: 'Messages', href: '/admin/messages' },
  { label: 'Settings', href: '/admin/settings' },
];

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // No session -> this can only be /admin/login (middleware redirects
  // unauthenticated requests away from every other /admin/* route before
  // they ever reach this layout). Render the login page with no dashboard
  // chrome around it.
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-60 shrink-0 flex-col border-r border-zinc-200 p-4 dark:border-zinc-800">
        <div className="mb-6 px-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Amar Portfolio
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {ADMIN_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={signOut}>
          <SubmitButton
            variant="secondary"
            pendingChildren="Signing out…"
            className="w-full"
          >
            Sign out
          </SubmitButton>
        </form>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
