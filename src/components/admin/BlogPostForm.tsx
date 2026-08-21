'use client';

import { useActionState, useState, type ChangeEvent } from 'react';
import { Input } from '@/components/ui/Input';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { Textarea } from '@/components/ui/Textarea';
import { cn } from '@/lib/utils';
import {
  createBlogPost,
  updateBlogPost,
  type BlogFormState,
} from '@/server/actions/blog';
import type { Database } from '@/types/database';
import { RichTextEditor } from './RichTextEditor';

type BlogPostRow = Database['public']['Tables']['blog_posts']['Row'];

const initialState: BlogFormState = { status: 'idle', message: null };

function slugifyClient(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function BlogPostForm({
  mode,
  post,
}: {
  mode: 'create' | 'edit';
  post?: BlogPostRow;
}) {
  // updateBlogPost takes `id` as its first argument, ahead of the
  // (prevState, formData) pair useActionState expects - bind it here so
  // the resulting function matches useActionState's expected shape.
  const action =
    mode === 'edit' && post
      ? updateBlogPost.bind(null, post.id)
      : createBlogPost;
  const [state, formAction] = useActionState(action, initialState);

  // Controlled inputs throughout, not uncontrolled - React's
  // <form action={...}> resets uncontrolled fields once the action
  // completes regardless of success/failure (the same issue found and
  // fixed in the Contact form). A half-written blog post is much more
  // expensive to lose than a contact form on a validation error.
  const [title, setTitle] = useState(post?.title ?? '');
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(mode === 'edit');
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '');
  const [coverImageUrl, setCoverImageUrl] = useState(
    post?.cover_image_url ?? ''
  );
  const [status, setStatus] = useState<'draft' | 'published'>(
    post?.status ?? 'draft'
  );
  const [contentHtml, setContentHtml] = useState(post?.content ?? '');

  function handleTitleChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setTitle(value);
    if (!slugTouched) setSlug(slugifyClient(value));
  }

  function handleSlugChange(event: ChangeEvent<HTMLInputElement>) {
    setSlugTouched(true);
    setSlug(event.target.value);
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {/* Tiptap's content lives in the editor instance, not a native form
          control - this hidden input is what actually gets submitted. */}
      <input type="hidden" name="content" value={contentHtml} readOnly />
      <input type="hidden" name="status" value={status} />

      <Input
        label="Title"
        name="title"
        value={title}
        onChange={handleTitleChange}
        required
        maxLength={200}
      />
      <Input
        label="Slug"
        name="slug"
        value={slug}
        onChange={handleSlugChange}
        required
      />
      <Textarea
        label="Excerpt"
        name="excerpt"
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        rows={3}
        maxLength={300}
      />
      <Input
        label="Cover Image URL"
        name="cover_image_url"
        type="url"
        placeholder="https://…"
        value={coverImageUrl}
        onChange={(e) => setCoverImageUrl(e.target.value)}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-muted-foreground">
          Content
        </label>
        <RichTextEditor content={post?.content ?? ''} onChange={setContentHtml} />
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium text-muted-foreground">
          Status
        </legend>
        <div className="flex w-fit rounded-lg border border-border p-1">
          {(['draft', 'published'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setStatus(option)}
              aria-pressed={status === option}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                status === option
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {option === 'draft' ? 'Draft' : 'Published'}
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
        {mode === 'create' ? 'Create Post' : 'Save Changes'}
      </SubmitButton>
    </form>
  );
}
