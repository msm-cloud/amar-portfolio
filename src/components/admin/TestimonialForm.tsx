'use client';

import { useActionState, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { Textarea } from '@/components/ui/Textarea';
import { cn } from '@/lib/utils';
import {
  createTestimonial,
  updateTestimonial,
  type TestimonialFormState,
} from '@/server/actions/testimonials';
import type { Database } from '@/types/database';

type TestimonialRow = Database['public']['Tables']['testimonials']['Row'];

const initialState: TestimonialFormState = { status: 'idle', message: null };

export function TestimonialForm({
  mode,
  testimonial,
}: {
  mode: 'create' | 'edit';
  testimonial?: TestimonialRow;
}) {
  // updateTestimonial takes `id` as its first argument, ahead of the
  // (prevState, formData) pair useActionState expects - bind it here, same
  // pattern as every other admin form.
  const action =
    mode === 'edit' && testimonial
      ? updateTestimonial.bind(null, testimonial.id)
      : createTestimonial;
  const [state, formAction] = useActionState(action, initialState);

  const [authorName, setAuthorName] = useState(
    testimonial?.author_name ?? ''
  );
  const [authorTitle, setAuthorTitle] = useState(
    testimonial?.author_title ?? ''
  );
  const [authorCompany, setAuthorCompany] = useState(
    testimonial?.author_company ?? ''
  );
  const [content, setContent] = useState(testimonial?.content ?? '');
  const [contentBn, setContentBn] = useState(testimonial?.content_bn ?? '');
  const [avatarUrl, setAvatarUrl] = useState(testimonial?.avatar_url ?? '');
  const [isFeatured, setIsFeatured] = useState(
    testimonial?.is_featured ?? false
  );
  const [displayOrder, setDisplayOrder] = useState(
    testimonial?.display_order ?? 0
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input
        type="hidden"
        name="is_featured"
        value={isFeatured ? 'true' : 'false'}
      />

      <Input
        label="Author Name"
        name="author_name"
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
        required
        maxLength={150}
      />
      <Input
        label="Author Title"
        name="author_title"
        value={authorTitle}
        onChange={(e) => setAuthorTitle(e.target.value)}
        placeholder="Operations Manager"
      />
      <Input
        label="Author Company"
        name="author_company"
        value={authorCompany}
        onChange={(e) => setAuthorCompany(e.target.value)}
        placeholder="NexaBank"
      />

      <Textarea
        label="Content"
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        rows={4}
      />
      <Textarea
        label="Content (Bangla, optional)"
        name="content_bn"
        value={contentBn}
        onChange={(e) => setContentBn(e.target.value)}
        rows={4}
      />

      <Input
        label="Avatar URL (optional)"
        name="avatar_url"
        type="url"
        placeholder="https://…"
        value={avatarUrl}
        onChange={(e) => setAvatarUrl(e.target.value)}
      />
      <p className="-mt-4 text-xs text-muted-foreground">
        Falls back to the author&apos;s initials in a colored circle when
        left blank.
      </p>

      <Input
        label="Display Order"
        name="display_order"
        type="number"
        value={displayOrder}
        onChange={(e) => setDisplayOrder(Number(e.target.value))}
      />

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium text-muted-foreground">
          Featured
        </legend>
        <div className="flex w-fit rounded-lg border border-border p-1">
          {(
            [
              { value: false, label: 'Not Featured' },
              { value: true, label: 'Featured' },
            ] as const
          ).map((option) => (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => setIsFeatured(option.value)}
              aria-pressed={isFeatured === option.value}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                isFeatured === option.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      {state.status === 'error' && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.message}
        </p>
      )}

      <SubmitButton pendingChildren="Saving…" className="w-fit">
        {mode === 'create' ? 'Create Testimonial' : 'Save Changes'}
      </SubmitButton>
    </form>
  );
}
