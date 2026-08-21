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
- `skills/page.tsx`, `experience/page.tsx`, `certifications/page.tsx` —
  same list/reorder/Edit/Delete pattern as `projects/page.tsx`, minus a
  status badge (these three tables have no `status` column - always
  public). Forms: `SkillForm` (category `<select>` - a fixed 4-value
  enum, not a combobox like Projects' category; `ProficiencyLevelInput`
  for the 1-5 dot picker), `ExperienceForm` (Is Current toggle
  disables/clears End Date), `CertificationForm`. The Experience admin
  list orders by `display_order` (for its reorder buttons) but the public
  section itself sorts by `start_date` instead - see `moveExperience`'s
  own comment for why that split is intentional.
- `blog/page.tsx` — lists all `blog_posts` (draft and published); Edit /
  Delete per row, "New Post" button.
- `blog/new/page.tsx` and `blog/[id]/edit/page.tsx` — share
  `src/components/admin/BlogPostForm.tsx` (Tiptap editor via the shared
  `RichTextEditor`).
- `testimonials/page.tsx` — same list/reorder/Edit/Delete pattern as
  `skills/page.tsx` etc. Form: `TestimonialForm` (Author Name/Title/
  Company, Content + optional Bangla content, Avatar URL - falls back to
  initials when blank, same as the public marquee - Featured toggle,
  Display Order).
- Other nav items (Settings) are linked from the sidebar but their pages
  don't exist yet — that's a later step.
