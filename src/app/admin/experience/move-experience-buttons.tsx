'use client';

import { useTransition } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { moveExperience } from '@/server/actions/experience';

/**
 * Simple up/down reordering, not drag-and-drop - each click updates
 * `display_order` server-side (see moveExperience) and the list re-renders
 * via revalidatePath. Only reorders this admin list - the public
 * Experience section sorts by start_date instead (see the note on
 * moveExperience itself).
 */
export function MoveExperienceButtons({
  id,
  disableUp,
  disableDown,
}: {
  id: string;
  disableUp: boolean;
  disableDown: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function handleMove(direction: 'up' | 'down') {
    startTransition(() => {
      void moveExperience(id, direction);
    });
  }

  return (
    <div className="flex shrink-0 flex-col">
      <button
        type="button"
        onClick={() => handleMove('up')}
        disabled={isPending || disableUp}
        aria-label="Move up"
        className="rounded-md p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronUp className="h-4 w-4" aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => handleMove('down')}
        disabled={isPending || disableDown}
        aria-label="Move down"
        className="rounded-md p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronDown className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
