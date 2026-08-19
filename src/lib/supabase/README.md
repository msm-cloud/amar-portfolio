# lib/supabase/

Supabase client setup for the three execution contexts Next.js App Router
code can run in:

- `client.ts` — browser client (`createClient()`), for Client Components.
  Uses `NEXT_PUBLIC_*` env vars only.
- `server.ts` — server client (`createClient()`, async), for Server
  Components / Server Actions / Route Handlers. Reads/writes the session
  via cookies so RLS is enforced as the signed-in user. Also exports
  `createServiceRoleClient()`, which bypasses RLS using the service role
  key — server-only, never import it into a Client Component.
- `middleware.ts` — `updateSession()` helper used by the root
  `middleware.ts` to keep the auth session cookie fresh on every request.

Import the right one for where your code runs — mixing them up (e.g. using
the browser client in a Server Component) will not work correctly.
