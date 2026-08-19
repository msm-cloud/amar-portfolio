import { LoginForm } from './login-form';

const ERROR_MESSAGES: Record<string, string> = {
  no_profile:
    'Your account is not set up for admin access. Contact an administrator.',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const sessionError = params.error
    ? (ERROR_MESSAGES[params.error] ??
      'Something went wrong. Please try again.')
    : undefined;

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <LoginForm sessionError={sessionError} />
    </main>
  );
}
