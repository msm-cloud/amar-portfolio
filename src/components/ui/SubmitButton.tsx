'use client';

import type { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { Button, type ButtonProps } from './Button';

/**
 * Submit button for a <form action={serverAction}>. Must be a descendant
 * of the <form> it belongs to (useFormStatus reads the nearest parent
 * form's pending state) — it will NOT work if rendered outside the form.
 */
export function SubmitButton({
  children,
  pendingChildren = 'Submitting…',
  ...props
}: ButtonProps & { pendingChildren?: ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending ? pendingChildren : children}
    </Button>
  );
}
