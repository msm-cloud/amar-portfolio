import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/types/database';

// Paths under /admin that do NOT require an authenticated session.
// forgot-password/reset-password are here for the same reason login is -
// reset-password in particular is visited by someone in a Supabase
// "password recovery" state, not a normal admin/editor session (that
// recovery session is only ever established client-side, from the token
// in the reset-email link's URL - see reset-password-form.tsx). If this
// path required a normal session, this middleware would redirect the
// visitor to /admin/login before the client-side recovery handling ever
// got a chance to run.
const PUBLIC_ADMIN_PATHS = [
  '/admin/login',
  '/admin/forgot-password',
  '/admin/reset-password',
];

function isPublicAdminPath(pathname: string) {
  return PUBLIC_ADMIN_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

/**
 * Refreshes the Supabase auth session (if any) on every request, keeps the
 * auth cookies in sync between the request and response, and enforces
 * /admin/* route protection:
 *   - No session -> redirect to /admin/login.
 *   - Session exists but there's no profiles row with role 'admin' or
 *     'editor' -> sign the user out and redirect to /admin/login with an
 *     error, rather than letting an account with no assigned role in.
 *
 * Called from the root `proxy.ts` (Next.js 16's renamed `middleware.ts`
 * convention — see https://nextjs.org/docs/app/api-reference/file-conventions/proxy).
 * Without this, sessions can also silently expire in Server Components
 * since they can only read cookies, not write them.
 *
 * Based on the standard Supabase SSR middleware pattern, adapted for Proxy:
 * https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: avoid writing logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to
  // debug issues with users being randomly logged out.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute && !isPublicAdminPath(pathname)) {
    if (!user) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    const role = profile?.role;
    if (role !== 'admin' && role !== 'editor') {
      await supabase.auth.signOut();
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('error', 'no_profile');
      return NextResponse.redirect(loginUrl);
    }
  }

  // IMPORTANT: return supabaseResponse as-is (don't create a new response
  // object) so the refreshed auth cookies actually reach the browser.
  return supabaseResponse;
}
