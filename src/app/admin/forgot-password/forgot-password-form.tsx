'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Input } from '@/components/ui/Input';
import { SubmitButton } from '@/components/ui/SubmitButton';
import {
  requestPasswordReset,
  type ForgotPasswordState,
} from '@/server/actions/auth';

const initialState: ForgotPasswordState = { status: 'idle', message: null };

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(
    requestPasswordReset,
    initialState
  );

  return (
    <GlassCard className="w-full max-w-sm">
      <h1 className="mb-1 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Forgot password
      </h1>
      <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
        Enter your admin email and we&rsquo;ll send you a link to reset your
        password.
      </p>

      {state.status === 'success' ? (
        <p role="status" className="text-sm text-zinc-900 dark:text-zinc-50">
          {state.message}
        </p>
      ) : (
        <form action={formAction} className="flex flex-col gap-4">
          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />

          {state.status === 'error' && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {state.message}
            </p>
          )}

          <SubmitButton pendingChildren="Sending…" className="mt-2 w-full">
            Send Reset Link
          </SubmitButton>
        </form>
      )}

      <Link
        href="/admin/login"
        className="mt-6 block text-center text-sm text-primary hover:underline"
      >
        Back to sign in
      </Link>
    </GlassCard>
  );
}
