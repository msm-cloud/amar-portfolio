# Admin access setup

The admin panel (`/admin/*`) uses Supabase Auth with email/password.
There is **no public signup page** — this is a small-team tool, so accounts
are created manually in the Supabase Dashboard, not by anyone who visits
the site.

## How sign-in works

1. A user is created in Supabase Auth (see below) — this alone does **not**
   grant admin access.
2. On first sign-up, a database trigger (`handle_new_user()`, from the
   [initial schema migration](../supabase/migrations/20260819220000_initial_schema.sql))
   automatically creates a matching row in `public.profiles`, defaulting
   `role` to `'editor'`.
3. Middleware (`middleware.ts` → `src/lib/supabase/middleware.ts`) checks,
   on every request to `/admin/*` (except `/admin/login`):
   - Is there a valid session? If not, redirect to `/admin/login`.
   - Does the signed-in user have a `profiles` row with `role` of
     `'admin'` or `'editor'`? If not, they're signed out and redirected to
     `/admin/login?error=no_profile` — a Supabase Auth account with no
     matching role is not enough to get in.

## Creating the first admin user

1. In the [Supabase Dashboard](https://supabase.com/dashboard), open your
   project → **Authentication → Users → Add user**.
2. Choose **Create new user**, enter an email and password, and make sure
   **Auto Confirm User** is checked (so you don't have to click an email
   confirmation link) — then create the user.
3. This fires the `handle_new_user()` trigger, giving you a `profiles` row
   with `role = 'editor'`. Promote yourself to `admin` — go to **SQL
   Editor → New query** and run:

   ```sql
   update public.profiles set role = 'admin' where id = '<your-auth-user-uuid>';
   ```

   Find `<your-auth-user-uuid>` under **Authentication → Users** (click the
   user, copy the **UID**).

4. Go to `/admin/login` on your running site and sign in with that email
   and password.

## Adding more editors later

Repeat the same **Authentication → Users → Add user** step for each new
teammate. Leave their role as the default `'editor'` (no SQL needed)
unless they should also be able to manage other users / see everything an
admin can — in which case, promote them the same way as above but with
`role = 'admin'`.

`admin` vs `editor` today only affects the `profiles` table's own RLS
policies (admins can read/write all profiles; editors can only read their
own). Both roles currently have identical write access to content tables
(`projects`, `blog_posts`, etc.) — see
[`supabase/migrations/README.md`](../supabase/migrations/README.md) for
the full RLS breakdown.

## Removing access

Deleting a user from **Authentication → Users** cascades to their
`profiles` row (`on delete cascade`), immediately revoking their access —
their next request to any `/admin/*` route will fail the session check
and bounce them to `/admin/login`.
