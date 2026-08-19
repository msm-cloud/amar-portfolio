# server/actions/

Next.js Server Actions (functions marked `"use server"`) — form submissions,
mutations, anything that needs to run only on the server and be callable
directly from Client/Server Components.

- `auth.ts` — `signIn` (paired with `useActionState` in the login form) and
  `signOut` (used directly as a `<form action={signOut}>`).

More will be added in later steps (e.g. contact form submission, admin
content CRUD).
