# server/actions/

Next.js Server Actions (functions marked `"use server"`) — form submissions,
mutations, anything that needs to run only on the server and be callable
directly from Client/Server Components.

- `auth.ts` — `signIn` (paired with `useActionState` in the login form) and
  `signOut` (used directly as a `<form action={signOut}>`).
- `contact.ts` — `submitContactForm` (paired with `useActionState` in the
  Contact section: validates, saves to `contact_messages`, sends a Resend
  notification email, and has its own basic in-memory rate limiter) and
  `markContactMessageAsRead` (called directly from the admin messages
  list, not via a `<form>` — Server Actions can be called as plain async
  functions from client code too).
- `blog.ts` — `createBlogPost` / `updateBlogPost` (paired with
  `useActionState` in `BlogPostForm`; `updateBlogPost` takes `id` as a
  pre-bound first argument via `.bind(null, id)`) and `deleteBlogPost`
  (called directly, like `markContactMessageAsRead`). Authorization for
  all three is RLS (`blog_posts_write_admin_editor`), not anything
  checked in these functions themselves.
- `projects.ts` — `createProject` / `updateProject` (same
  `useActionState` + `.bind(null, id)` pattern as blog.ts) and
  `deleteProject` (called directly). Also `moveProject(id, direction)`
  (called directly from the admin list's up/down buttons) — re-numbers
  every row's `display_order` to its new index rather than swapping two
  rows' raw values, so a move is never a silent no-op when two rows
  already share the same `display_order`. Authorization is RLS
  (`projects_write_admin_editor`).
- `skills.ts` / `experience.ts` / `certifications.ts` / `testimonials.ts`
  — same shape as projects.ts (`create*`/`update*` via `useActionState`,
  `delete*` called directly, `move*(id, direction)` re-numbering
  `display_order`), one file per table. These four tables have no
  `created_at` column, so `move*` tie-breaks the sort by `id` instead
  (projects/blog_posts tie-break by `created_at`). Authorization is RLS
  (`skills_write_admin_editor` / `experience_write_admin_editor` /
  `certifications_write_admin_editor` / `testimonials_write_admin_editor`).
- `settings.ts` — `updateSiteSettings`, the one exception to the
  `create*`/`update*`/`delete*`/`move*` shape above: `site_settings` is a
  singleton (`id = 1`, seeded by its migration), so there's only ever an
  update, no create/delete/reorder. Doesn't `redirect()` on success like
  every other form here does (there's no list page to send the admin
  back to) - returns a `'success'` state instead, so the form can show an
  inline "Settings saved" message and stay put. Also handles the profile
  photo upload: reads the `photo` File off the same FormData, uploads it
  to the `profile-photos` Storage bucket (fixed filename, `upsert: true`
  - see the function's own comment on why), and only overwrites
  `profile_photo_url` if a new file was actually provided. Authorization
  is RLS (`site_settings_write_admin_editor` for the table,
  `profile_photos_*_admin_editor` for the bucket).
