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
- `projects/page.tsx` — lists all `projects` (draft and published);
  cover thumbnail, status/featured badges, up/down reorder buttons
  (`move-project-buttons.tsx`, updates `display_order` via
  `moveProject`), Edit / Delete per row, "New Project" button.
- `projects/new/page.tsx` and `projects/[id]/edit/page.tsx` — share
  `src/components/admin/ProjectForm.tsx` (Tiptap editor via the shared
  `RichTextEditor`, tag chips via `TagInput`).
- `blog/page.tsx` — lists all `blog_posts` (draft and published); Edit /
  Delete per row, "New Post" button.
- `blog/new/page.tsx` and `blog/[id]/edit/page.tsx` — share
  `src/components/admin/BlogPostForm.tsx` (Tiptap editor via the shared
  `RichTextEditor`).
- Other nav items (Skills, Experience, Certifications, Testimonials,
  Settings) are linked from the sidebar but their pages don't exist yet —
  that's later steps (content-management CRUD UI).
