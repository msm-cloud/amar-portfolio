'use client';

import { useActionState } from 'react';
import { signIn, type AuthActionState } from '@/server/actions/auth';
import { GlassCard } from '@/components/ui/GlassCard';
import { Input } from '@/components/ui/Input';
import { SubmitButton } from '@/components/ui/SubmitButton';

const initialState: AuthActionState = { error: null };

export function LoginForm({ sessionError }: { sessionError?: string }) {
  const [state, formAction] = useActionState(signIn, initialState);
  const error = state.error ?? sessionError ?? null;

  return (
    <GlassCard className="w-full max-w-sm">
      <h1 className="mb-1 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Admin sign in
      </h1>
      <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
        Sign in with the email and password you were given.
      </p>

      <form action={formAction} className="flex flex-col gap-4">
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />

        {error && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <SubmitButton pendingChildren="Signing in…" className="mt-2 w-full">
          Sign in
        </SubmitButton>
      </form>
    </GlassCard>
  );
}
