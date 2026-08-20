# components/admin/

Components specific to the admin panel - unlike `components/ui/`, these
know about admin concerns (forms tied to a specific Server Action,
content-management workflows) and aren't meant to be reused on public
pages.

- `BlogPostForm` — shared create/edit form for blog posts (Tiptap rich
  text editor + toolbar, slug auto-generation, draft/published toggle).
  Used by both `src/app/admin/blog/new/page.tsx` and
  `src/app/admin/blog/[id]/edit/page.tsx`.
