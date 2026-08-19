# Amar Portfolio

A professional portfolio website.

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router) — framework
- [TypeScript](https://www.typescriptlang.org/) — language
- [Tailwind CSS](https://tailwindcss.com/) — styling
- [Framer Motion](https://www.framer.com/motion/) — animation _(not installed yet — added in a later step)_
- [Supabase](https://supabase.com/) — database / auth
- [Resend](https://resend.com/) — transactional email _(not installed yet — added in a later step)_
- [Vercel](https://vercel.com/) — hosting/deployment

## Folder Structure

```
src/
  app/                    Next.js routes (pages, layouts)
    (public)/             Route group for public-facing pages (home, about, etc.)
    admin/                Admin dashboard (auth-protected via middleware.ts)
    api/                  Route handlers, for plain HTTP endpoints (e.g. webhooks)
  components/
    ui/                   Reusable, generic UI primitives (buttons, cards, glass-card, bento-card)
    sections/             Page-level sections (Hero, About, Projects, etc.)
    layout/                Header, Footer, Navbar
  lib/
    supabase/             Supabase client setup (browser + server clients)
    utils.ts              Shared, framework-agnostic utility functions
  server/
    actions/              Next.js Server Actions (mutations, form submissions)
  types/
    index.ts              Shared TypeScript types/interfaces
  hooks/                  Custom React hooks
  config/
    site.ts               Site-wide config (name, links, nav items)
  styles/
    globals.css           Global styles (Tailwind entrypoint)

supabase/
  migrations/             SQL migration files
```

Each major folder above has its own short `README.md` explaining its purpose in more detail — check there before adding new files.

## Getting Started

1. **Install dependencies** (this project uses [pnpm](https://pnpm.io/)):

   ```bash
   pnpm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.local.example .env.local
   ```

   Then fill in the real values in `.env.local` (Supabase URL/keys, Resend API key). `.env.local` is gitignored and never committed.

3. **Run the dev server:**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script              | Description                              |
| ------------------- | ---------------------------------------- |
| `pnpm dev`          | Run the dev server                       |
| `pnpm build`        | Production build                         |
| `pnpm start`        | Run the production build                 |
| `pnpm lint`         | Lint with ESLint                         |
| `pnpm format`       | Format all files with Prettier           |
| `pnpm format:check` | Check formatting without writing changes |

## Admin Access

The admin panel (`/admin/*`) uses Supabase Auth — there's no public signup.
See [`docs/admin-setup.md`](docs/admin-setup.md) for how to create the first
admin user and add more editors later.

## Contributing

- **Formatting is automatic** — run `pnpm format` before committing (or set up format-on-save in your editor). Prettier config: 2-space indent, single quotes, semicolons, ES5 trailing commas (`.prettierrc`).
- **Lint before pushing** — `pnpm lint` uses `eslint-config-next` (Core Web Vitals + TypeScript rules). Prettier and ESLint are wired together via `eslint-config-prettier` so they don't fight over formatting rules.
- **Component placement** — generic/reusable UI goes in `components/ui/`; page-specific sections go in `components/sections/`; site-wide chrome (header/footer/nav) goes in `components/layout/`.
- **Server-only logic** — data mutations belong in `server/actions/` (Server Actions), not in client components.
- **Types** — shared types go in `types/index.ts`; keep component-local types next to the component.
- **Commit messages** — use [Conventional Commits](https://www.conventionalcommits.org/) style where practical (e.g. `feat:`, `fix:`, `chore:`, `docs:`).
- **Branching** — work on a feature branch and open a PR into `main`; avoid pushing directly to `main`.
