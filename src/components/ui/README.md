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
  column/row span (`small` / `medium` / `large` / `wide`). **Defaults to
  `medium` (spans 2 columns)** — for a dense/uniform grid (e.g. a skill
  chip grid), pass `size="small"` explicitly or every tile will eat 2
  columns. Also: the span classes only take effect on `BentoCard`'s own
  root element, so don't wrap it in an extra `motion.div` (or any other
  element) that becomes the actual CSS grid child instead of it — see
  `Skills.tsx` / `About.tsx` for the correct pattern when combining
  `BentoCard` with framer-motion inside a grid.
- `SectionContainer` — max-width + padding wrapper for page sections.
- `SectionHeading` — eyebrow + title + optional description heading block.
- `ThemeToggle` — light/dark switch (next-themes).
- `ProficiencyDots` — filled/unfilled dot indicator (1-5), accessible via
  a single `aria-label` rather than reading out 5 individual dots.

All of these read color from the semantic tokens in
`src/styles/globals.css` (`bg-card`, `text-foreground`, `bg-primary`, …)
rather than hardcoding colors or `dark:` variants — that's what makes them
theme automatically.
