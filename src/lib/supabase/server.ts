import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseJsClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

/**
 * Supabase client for use in Server Components, Server Actions, and
 * Route Handlers. Reads/writes the auth session via cookies, so the
 * signed-in user (if any) is available server-side and RLS policies are
 * enforced as that user.
 *
 * Must be awaited: const supabase = await createClient();
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // `setAll` was called from a Server Component (which can't set
            // cookies). Safe to ignore as long as middleware.ts is refreshing
            // the session on every request.
          }
        },
      },
    }
  );
}

/**
 * Anonymous, cookie-free Supabase client for build-time contexts like
 * `generateStaticParams` - Next.js explicitly disallows calling cookies()
 * there (it runs at build time, outside any HTTP request, so there's no
 * cookie jar to read). Uses the public anon key, so it's equivalent in
 * privilege to what an anonymous visitor's request would see - public-read
 * RLS policies (e.g. `projects_select_published`) still apply.
 */
export function createStaticClient() {
  return createSupabaseJsClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Service-role Supabase client for trusted, server-only operations that
 * must bypass Row Level Security (e.g. admin scripts, background jobs).
 *
 * DANGER: this key has full database access. Never import this file into
 * a Client Component, never send this client (or the key) to the browser,
 * and never use it to handle untrusted user input directly — validate
 * inputs and check permissions in your own code first.
 */
export function createServiceRoleClient() {
  return createSupabaseJsClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
