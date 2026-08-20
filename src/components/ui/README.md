# components/ui/

Reusable, generic UI primitives with no page-specific knowledge: buttons,
cards, `glass-card`, `bento-card`, inputs, etc. These should be dumb,
presentational, and reused across many sections/pages.

Naming convention: one component per file, PascalCase filename matching
the exported component (e.g. `Button.tsx` exports `Button`).

Current components:

- `Button` — variants `primary` / `secondary` / `ghost` / `outline`, sizes
  `sm` / `md` / `lg`.
- `SubmitButton` — a `Button` wired to `useFormStatus`; must be rendered
  inside the `<form>` it submits.
- `Input` — labeled text input.
- `GlassCard` — glassmorphism surface (blur + translucent `--card` +
  `--border`).
- `BentoCard` — grid tile for bento layouts; `size` controls its
  column/row span (`small` / `medium` / `large` / `wide`).
- `SectionContainer` — max-width + padding wrapper for page sections.
- `SectionHeading` — eyebrow + title + optional description heading block.
- `ThemeToggle` — light/dark switch (next-themes).

All of these read color from the semantic tokens in
`src/styles/globals.css` (`bg-card`, `text-foreground`, `bg-primary`, …)
rather than hardcoding colors or `dark:` variants — that's what makes them
theme automatically.
