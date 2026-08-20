# admin/

Admin dashboard, protected by Supabase Auth (see `proxy.ts` /
`src/lib/supabase/proxy.ts`). Every route under here requires a
signed-in user whose `profiles.role` is `'admin'` or `'editor'`, **except**
`login/`.

- `login/page.tsx` — sign-in form (no public signup; accounts are created
  manually via the Supabase Dashboard).
- `layout.tsx` — sidebar/header shell wrapping all authenticated admin
  pages (renders bare, with no chrome, for the unauthenticated login page).
- `dashboard/page.tsx` — placeholder landing page after sign-in.
- `messages/page.tsx` — lists `contact_messages` (newest first); click a
  row to expand it and mark it read.
- Other nav items (Projects, Skills, Experience, Certifications,
  Testimonials, Blog, Settings) are linked from the sidebar but their
  pages don't exist yet — that's later steps (content-management CRUD UI).
