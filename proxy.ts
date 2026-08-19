import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/proxy';

// Next.js 16 renamed the `middleware.ts` file convention to `proxy.ts`
// (the exported function must be named `proxy`, not `middleware` — the old
// name is silently ignored, not an error). See:
// https://nextjs.org/docs/app/api-reference/file-conventions/proxy
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run on every request except static assets, so the Supabase session
     * cookie stays fresh across navigations. Adjust this matcher if you
     * add more static file types.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
