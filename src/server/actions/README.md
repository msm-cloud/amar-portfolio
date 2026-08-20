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

More will be added in later steps (admin content CRUD).
