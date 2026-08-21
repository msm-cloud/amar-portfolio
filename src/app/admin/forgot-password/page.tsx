import { ForgotPasswordForm } from './forgot-password-form';

// Public (see PUBLIC_ADMIN_PATHS in lib/supabase/proxy.ts) - reached by a
// signed-out visitor, same as /admin/login.
export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <ForgotPasswordForm />
    </main>
  );
}
