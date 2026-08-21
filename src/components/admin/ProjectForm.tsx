'use client';

import { useActionState, useState, type ChangeEvent } from 'react';
import { Input } from '@/components/ui/Input';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { Textarea } from '@/components/ui/Textarea';
import { cn } from '@/lib/utils';
import {
  createProject,
  updateProject,
  type ProjectFormState,
} from '@/server/actions/projects';
import type { Database } from '@/types/database';
import { RichTextEditor } from './RichTextEditor';
import { TagInput } from './TagInput';

type ProjectRow = Database['public']['Tables']['projects']['Row'];

const initialState: ProjectFormState = { status: 'idle', message: null };

// Suggestions for the Category field - not an exhaustive list, just the
// values used across the seeded projects. The input itself accepts any
// custom text via the browser's native datalist combobox behavior.
const CATEGORY_SUGGESTIONS = ['Web Development', 'Design', 'Web App'];

function slugifyClient(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function ProjectForm({
  mode,
  project,
}: {
  mode: 'create' | 'edit';
  project?: ProjectRow;
}) {
  // updateProject takes `id` as its first argument, ahead of the
  // (prevState, formData) pair useActionState expects - bind it here so
  // the resulting function matches useActionState's expected shape (same
  // pattern as BlogPostForm/updateBlogPost).
  const action =
    mode === 'edit' && project
      ? updateProject.bind(null, project.id)
      : createProject;
  const [state, formAction] = useActionState(action, initialState);

  // Controlled inputs throughout, not uncontrolled - React's
  // <form action={...}> resets uncontrolled fields once the action
  // completes regardless of success/failure (see BlogPostForm/Contact for
  // the same fix). A half-written project is expensive to lose too.
  const [title, setTitle] = useState(project?.title ?? '');
  const [slug, setSlug] = useState(project?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(mode === 'edit');
  const [titleBn, setTitleBn] = useState(project?.title_bn ?? '');
  const [description, setDescription] = useState(project?.description ?? '');
  const [descriptionBn, setDescriptionBn] = useState(
    project?.description_bn ?? ''
  );
  const [category, setCategory] = useState(project?.category ?? '');
  const [coverImageUrl, setCoverImageUrl] = useState(
    project?.cover_image_url ?? ''
  );
  const [projectUrl, setProjectUrl] = useState(project?.project_url ?? '');
  const [githubUrl, setGithubUrl] = useState(project?.github_url ?? '');
  const [isFeatured, setIsFeatured] = useState(project?.is_featured ?? false);
  const [status, setStatus] = useState<'draft' | 'published'>(
    project?.status ?? 'draft'
  );
  const [displayOrder, setDisplayOrder] = useState(
    project?.display_order ?? 0
  );
  const [contentHtml, setContentHtml] = useState(project?.content ?? '');

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
      <input
        type="hidden"
        name="is_featured"
        value={isFeatured ? 'true' : 'false'}
      />

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
        label="Title (Bangla, optional)"
        name="title_bn"
        value={titleBn}
        onChange={(e) => setTitleBn(e.target.value)}
        rows={2}
      />
      <Textarea
        label="Description"
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        maxLength={300}
      />
      <Textarea
        label="Description (Bangla, optional)"
        name="description_bn"
        value={descriptionBn}
        onChange={(e) => setDescriptionBn(e.target.value)}
        rows={3}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-muted-foreground">
          Content
        </label>
        <RichTextEditor
          content={project?.content ?? ''}
          onChange={setContentHtml}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="category"
          className="text-sm font-medium text-muted-foreground"
        >
          Category
        </label>
        <input
          id="category"
          name="category"
          list="category-suggestions"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Web Development"
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
        />
        {/* Native combobox: pick a suggestion or type any custom value. */}
        <datalist id="category-suggestions">
          {CATEGORY_SUGGESTIONS.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      </div>

      <TagInput
        name="tags"
        label="Tags"
        initialTags={project?.tags ?? []}
      />

      <Input
        label="Cover Image URL"
        name="cover_image_url"
        type="url"
        placeholder="https://…"
        value={coverImageUrl}
        onChange={(e) => setCoverImageUrl(e.target.value)}
      />
      <Input
        label="Project URL (optional)"
        name="project_url"
        type="url"
        placeholder="https://…"
        value={projectUrl}
        onChange={(e) => setProjectUrl(e.target.value)}
      />
      <Input
        label="GitHub URL (optional)"
        name="github_url"
        type="url"
        placeholder="https://github.com/…"
        value={githubUrl}
        onChange={(e) => setGithubUrl(e.target.value)}
      />
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
        {mode === 'create' ? 'Create Project' : 'Save Changes'}
      </SubmitButton>
    </form>
  );
}
