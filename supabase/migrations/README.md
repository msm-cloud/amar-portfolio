# supabase/migrations/

SQL migrations for the Supabase Postgres database. Each file is applied
once, in filename order (timestamp prefix), so never edit a migration
that's already been run against a real environment — add a new file instead.

## Schema overview

| Table              | Purpose                                                     | Public read?                |
| ------------------ | ----------------------------------------------------------- | --------------------------- |
| `profiles`         | One row per auth user; carries `role` (`admin` \| `editor`) | Own row only (or admin)     |
| `projects`         | Portfolio project case studies                              | Only `status = 'published'` |
| `skills`           | Skills list, grouped by `category`                          | Always                      |
| `experience`       | Work experience timeline                                    | Always                      |
| `certifications`   | Certifications / credentials                                | Always                      |
| `testimonials`     | Client/colleague testimonials                               | Always                      |
| `blog_posts`       | Blog posts (HTML content)                                   | Only `status = 'published'` |
| `contact_messages` | Contact form submissions                                    | Never (insert-only, public) |

**Bilingual content:** any field a visitor reads as prose has a parallel
`<field>_bn` column (e.g. `title` / `title_bn`) for Bangla, used by the
bilingual toggle planned for a later step. Identifiers, URLs, dates,
booleans, and controlled-vocabulary fields (`category`, `status`, `role`)
are not duplicated — translate their _display_ label in the UI layer
instead, so filter/query logic never has to compare across languages.

## Row Level Security strategy

- RLS is **enabled on every table**, no exceptions.
- Two `security definer` helper functions do the role check so policies
  don't recursively re-trigger RLS on `profiles` while evaluating
  themselves:
  - `public.is_admin()` — true if the current user's `profiles.role = 'admin'`
  - `public.is_admin_or_editor()` — true if `role` is `'admin'` or `'editor'`
- **Content tables** (`projects`, `blog_posts`): public can `select` only
  `status = 'published'` rows; admins/editors can `select` everything
  (including drafts, for the future admin panel) and have full write access.
- **Status-less content tables** (`skills`, `experience`, `certifications`,
  `testimonials`): always publicly readable; writes are admin/editor-only.
- **`contact_messages`**: anyone (including anonymous visitors) can
  `insert`; only admins/editors can `select`/`update`/`delete`.
- **`profiles`**: a user can `select` their own row; admins can `select`
  every row and have full write access (needed to promote/demote roles).
- New signups automatically get a `profiles` row via the
  `handle_new_user()` trigger on `auth.users`, defaulting to `role = 'editor'`.
  **You must manually promote your own account to `admin`** after your
  first signup (see below) — there's no UI for this yet.

## Running this migration

Migrations are **not** applied automatically to your remote Supabase
project — pick one of these:

### Option A — Supabase Dashboard SQL Editor (no CLI needed)

1. Open your project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. Go to **SQL Editor** → **New query**.
3. Paste the entire contents of
   [`20260819220000_initial_schema.sql`](./20260819220000_initial_schema.sql)
   and click **Run**.

### Option B — Supabase CLI

```bash
# one-time: link this repo to your remote project
supabase login
supabase link --project-ref <your-project-ref>

# push all local migrations to the linked remote project
supabase db push
```

### After running it, promote yourself to admin

Sign up once through Supabase Auth first (so a `profiles` row exists via
the trigger), then run in the SQL Editor:

```sql
update public.profiles set role = 'admin' where id = '<your-auth-user-uuid>';
```

Find your user's UUID under **Authentication → Users** in the dashboard.
