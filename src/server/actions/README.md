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

More will be added in later steps (Skills/Experience/Certifications/
Testimonials admin CRUD).
