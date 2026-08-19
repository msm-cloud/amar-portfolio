'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export interface AuthActionState {
  error: string | null;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Sign-in Server Action, designed for React's useActionState:
 *   const [state, formAction] = useActionState(signIn, { error: null });
 *   <form action={formAction}>
 *
 * On success, redirects to /admin/dashboard (throws NEXT_REDIRECT, handled
 * by Next.js — this never actually "returns" on the happy path). On
 * failure, returns a generic error so we never reveal whether a given
 * email address has an account.
 */
export async function signIn(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !EMAIL_REGEX.test(email)) {
    return { error: 'Enter a valid email address.' };
  }
  if (!password) {
    return { error: 'Enter your password.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Generic message on purpose — do not leak whether the email exists.
    return { error: 'Invalid email or password.' };
  }

  redirect('/admin/dashboard');
}

/**
 * Sign-out Server Action. Usable directly as a plain <form action={signOut}>
 * (no useActionState needed since it has nothing to report back).
 */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
