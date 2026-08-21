'use server';

import { redirect } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { createClient } from '@/lib/supabase/server';

export interface AuthActionState {
  error: string | null;
}

export interface ChangePasswordState {
  status: 'idle' | 'success' | 'error';
  message: string | null;
}

export interface ForgotPasswordState {
  status: 'idle' | 'success' | 'error';
  message: string | null;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;

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

/**
 * Change password for the *currently signed-in* admin/editor (used from
 * /admin/settings). Designed for React's useActionState:
 *   const [state, formAction] = useActionState(changePassword, { status: 'idle', message: null });
 *
 * Relies entirely on the normal session cookie already carrying the
 * signed-in user - unlike resetPassword below, no separate token/recovery
 * handling is needed here, since the caller is already authenticated.
 */
export async function changePassword(
  _prevState: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  const password = String(formData.get('password') ?? '');
  const confirmPassword = String(formData.get('confirm_password') ?? '');

  if (password.length < PASSWORD_MIN_LENGTH) {
    return {
      status: 'error',
      message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`,
    };
  }
  if (password !== confirmPassword) {
    return { status: 'error', message: 'Passwords do not match.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.error('[auth] changePassword failed:', error);
    return {
      status: 'error',
      message: 'Something went wrong changing your password.',
    };
  }

  return { status: 'success', message: 'Password changed successfully.' };
}

/**
 * Requests a password-reset email (used from /admin/forgot-password).
 * Designed for React's useActionState:
 *   const [state, formAction] = useActionState(requestPasswordReset, { status: 'idle', message: null });
 *
 * Always returns the same generic success message, whether or not the
 * email actually belongs to an account and whether or not Supabase itself
 * errored - same "don't leak account existence" reasoning as signIn's
 * generic "Invalid email or password." above. A malformed email is the
 * one thing worth telling the user about specifically, since that's a
 * client-side typo, not information about any account.
 */
export async function requestPasswordReset(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const email = String(formData.get('email') ?? '').trim();
  const genericMessage =
    "If that email exists, we've sent a password reset link.";

  if (!email || !EMAIL_REGEX.test(email)) {
    return { status: 'error', message: 'Enter a valid email address.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteConfig.url}/admin/reset-password`,
  });

  if (error) {
    // Logged for our own visibility, but still the same generic message -
    // Supabase itself errors for e.g. rate-limiting, which also
    // shouldn't be distinguishable from "email not found" to the caller.
    console.error('[auth] requestPasswordReset failed:', error);
  }

  return { status: 'success', message: genericMessage };
}
