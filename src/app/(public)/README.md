# (public) route group

Route group for public-facing pages (home, about, projects, contact, etc.).
Grouping these under `(public)` keeps them visually separate from `admin/`
in the file tree, without adding a `/public` segment to the URL — route
groups (folders wrapped in parentheses) are stripped from the route path.

Add new public pages here, e.g. `about/page.tsx` -> `/about`.
