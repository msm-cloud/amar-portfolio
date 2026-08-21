import { LoginForm } from './login-form';

const ERROR_MESSAGES: Record<string, string> = {
  no_profile:
    'Your account is not set up for admin access. Contact an administrator.',
};

const SUCCESS_MESSAGES: Record<string, string> = {
  password_reset:
    'Your password has been reset. Please sign in with your new password.',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;
  const sessionError = params.error
    ? (ERROR_MESSAGES[params.error] ??
      'Something went wrong. Please try again.')
    : undefined;
  const successMessage = params.message
    ? SUCCESS_MESSAGES[params.message]
    : undefined;

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <LoginForm sessionError={sessionError} successMessage={successMessage} />
    </main>
  );
}
