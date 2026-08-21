'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/supabase/client';

const PASSWORD_MIN_LENGTH = 8;

/**
 * Handled entirely client-side, unlike every other admin auth form in
 * this app - Supabase's reset-password email link lands with the
 * recovery session's token in the URL fragment
 * (#access_token=...&type=recovery), which browsers never send to the
 * server, so only client-side JS can ever see it. The browser Supabase
 * client (lib/supabase/client.ts) parses that fragment automatically on
 * creation (detectSessionInUrl, on by default) and fires a
 * 'PASSWORD_RECOVERY' auth event once it's done - a Server Action would
 * have nothing to read here, since the fragment never reaches the server
 * at all.
 */
export function ResetPasswordForm() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [status, setStatus] = useState<'checking' | 'ready' | 'invalid'>(
    'checking'
  );
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // getSession() awaits the client's own hash-parsing before
    // resolving, so this is already reliable on its own - the
    // onAuthStateChange listener below is just a belt-and-suspenders
    // second signal in case that processing is still in flight.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) setStatus(session ? 'ready' : 'invalid');
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' && isMounted) setStatus('ready');
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password.length < PASSWORD_MIN_LENGTH) {
      setError(`Password must be at least ${PASSWORD_MIN_LENGTH} characters.`);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });
    setIsSubmitting(false);

    if (updateError) {
      setError(
        'Something went wrong resetting your password. Please try again.'
      );
      return;
    }

    // Sign out of the temporary recovery session - the admin signs back
    // in fresh with the new password, rather than being silently left
    // logged in via the one-time reset link.
    await supabase.auth.signOut();
    router.push('/admin/login?message=password_reset');
  }

  if (status === 'checking') {
    return (
      <GlassCard className="w-full max-w-sm">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Checking your reset link…
        </p>
      </GlassCard>
    );
  }

  if (status === 'invalid') {
    return (
      <GlassCard className="w-full max-w-sm">
        <h1 className="mb-1 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Link expired or invalid
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          This password reset link is no longer valid. Request a new one
          from the{' '}
          <a
            href="/admin/forgot-password"
            className="text-primary hover:underline"
          >
            forgot password
          </a>{' '}
          page.
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="w-full max-w-sm">
      <h1 className="mb-1 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Set a new password
      </h1>
      <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
        Choose a new password for your admin account.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="New Password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
        <Input
          label="Confirm New Password"
          name="confirm_password"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
        />

        {error && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
          {isSubmitting ? 'Saving…' : 'Set New Password'}
        </Button>
      </form>
    </GlassCard>
  );
}
