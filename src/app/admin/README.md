# admin/

Admin dashboard, protected by Supabase Auth (see `middleware.ts` /
`src/lib/supabase/middleware.ts`). Every route under here requires a
signed-in user whose `profiles.role` is `'admin'` or `'editor'`, **except**
`login/`.

- `login/page.tsx` — sign-in form (no public signup; accounts are created
  manually via the Supabase Dashboard).
- `layout.tsx` — sidebar/header shell wrapping all authenticated admin
  pages (renders bare, with no chrome, for the unauthenticated login page).
- `dashboard/page.tsx` — placeholder landing page after sign-in.
- Other nav items (Projects, Skills, Experience, Certifications,
  Testimonials, Blog, Messages, Settings) are linked from the sidebar but
  their pages don't exist yet — that's later steps (content-management
  CRUD UI).
