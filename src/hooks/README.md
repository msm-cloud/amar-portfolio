# hooks/

Custom React hooks (`useXyz.ts`), shared across components. Keep hooks
here only once they're used in more than one place — a hook used by a
single component can live next to it instead.

- `useHasMounted` — exception to the above: currently only used by
  `ThemeToggle`, but it's generic client-only-render infrastructure (no
  theme-specific logic) likely to be reused by other client-only UI later
  (e.g. a locale toggle), so it lives here rather than next to ThemeToggle.
