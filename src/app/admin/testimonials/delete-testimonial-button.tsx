'use client';

import { useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { deleteTestimonial } from '@/server/actions/testimonials';

export function DeleteTestimonialButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(`Delete the testimonial from "${name}"? This can't be undone.`)) {
      return;
    }
    startTransition(() => {
      void deleteTestimonial(id);
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={isPending}
      className="text-red-600 hover:bg-red-600/10 dark:text-red-400"
    >
      <Trash2 className="mr-1.5 h-3.5 w-3.5" aria-hidden />
      {isPending ? 'Deleting…' : 'Delete'}
    </Button>
  );
}
