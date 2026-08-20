# components/layout/

Structural, site-wide layout components. These wrap pages rather than
living inside a single page's content.

- `Header` — sticky nav (glass background once scrolled), active-section
  highlighting via `useActiveSection`, mobile hamburger menu. Rendered
  only by `src/app/(public)/layout.tsx` — not on `/admin/*`.
- `Footer` — social links, quick links (same anchors as `Header`'s nav),
  dynamic copyright year. Also `(public)`-only.

Both read their nav/social link data from `src/config/site.ts` rather
than hardcoding it.
