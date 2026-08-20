# (public) route group

Route group for public-facing pages. Grouping these under `(public)`
keeps them visually separate from `admin/` in the file tree, without
adding a `/public` segment to the URL — route groups (folders wrapped in
parentheses) are stripped from the route path.

- `layout.tsx` — wraps every page in this group with `Header` + `Footer`.
  This is why any new page added here automatically gets the site
  chrome, and anything under `admin/` (a sibling of this group, not a
  child of it) never does.
- `page.tsx` — the homepage (all sections in one page, not separate
  routes per section).
- `projects/[slug]/page.tsx` — project detail pages. Lives inside
  `(public)` specifically so it gets the shared Header/Footer too.

Add new public pages here, e.g. `blog/[slug]/page.tsx` -> `/blog/[slug]`.
