'use client';

import { useActionState, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Input } from '@/components/ui/Input';
import { SubmitButton } from '@/components/ui/SubmitButton';
import {
  changePassword,
  type ChangePasswordState,
} from '@/server/actions/auth';

const initialState: ChangePasswordState = { status: 'idle', message: null };

export function ChangePasswordForm() {
  const [state, formAction] = useActionState(changePassword, initialState);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Clear both fields once the change actually succeeds - not on error,
  // since a "passwords don't match" rejection shouldn't force retyping
  // both from scratch. Adjusts state during render (comparing against
  // the last-seen action state) rather than useEffect + setState - React's
  // own recommended way to reset state in response to a value changing
  // without an extra render pass, and it sidesteps
  // eslint-plugin-react-hooks's set-state-in-effect rule the same way
  // useHasMounted avoids it elsewhere in this app.
  const [lastHandledState, setLastHandledState] = useState(state);
  if (state !== lastHandledState) {
    setLastHandledState(state);
    if (state.status === 'success') {
      setPassword('');
      setConfirmPassword('');
    }
  }

  return (
    <GlassCard>
      <h2 className="text-lg font-semibold text-foreground">
        Change Password
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Choose a new password for your admin account.
      </p>

      <form action={formAction} className="mt-6 flex flex-col gap-4">
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

        {state.status === 'error' && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {state.message}
          </p>
        )}
        {state.status === 'success' && (
          <p role="status" className="text-sm text-primary">
            {state.message}
          </p>
        )}

        <SubmitButton pendingChildren="Saving…" className="w-fit">
          Change Password
        </SubmitButton>
      </form>
    </GlassCard>
  );
}
