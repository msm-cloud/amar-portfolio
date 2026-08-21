import { ResetPasswordForm } from './reset-password-form';

// Public (see PUBLIC_ADMIN_PATHS in lib/supabase/proxy.ts) - this is
// where the password-reset email's link lands. The visitor here is in a
// Supabase "password recovery" state, not a normal signed-in admin/editor
// session, and that state only ever gets established client-side (see
// reset-password-form.tsx's own comment) - so this page itself has
// nothing server-side to check or gate on.
export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <ResetPasswordForm />
    </main>
  );
}
