'use client';

import { useActionState, useState, type ChangeEvent } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapImage from '@tiptap/extension-image';
import TiptapLink from '@tiptap/extension-link';
import {
  Bold,
  Code2,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Undo2,
} from 'lucide-react';
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

  const editor = useEditor({
    // Required in Next.js App Router: Tiptap defaults to rendering
    // immediately (including during SSR), which causes a hydration
    // mismatch. false defers the actual editor instance to the client.
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TiptapImage,
      TiptapLink.configure({ openOnClick: false }),
    ],
    content: post?.content ?? '',
    onUpdate: ({ editor }) => setContentHtml(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          'prose prose-sm dark:prose-invert max-w-none min-h-[280px] px-3 py-2 focus:outline-none',
      },
    },
  });

  function handleTitleChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setTitle(value);
    if (!slugTouched) setSlug(slugifyClient(value));
  }

  function handleSlugChange(event: ChangeEvent<HTMLInputElement>) {
    setSlugTouched(true);
    setSlug(event.target.value);
  }

  function promptForLink() {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Link URL', previousUrl ?? 'https://');
    if (url === null) return; // cancelled
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }

  function promptForImage() {
    if (!editor) return;
    const url = window.prompt('Image URL');
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
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
        <div className="rounded-lg border border-border bg-background">
          <Toolbar
            editor={editor}
            onLink={promptForLink}
            onImage={promptForImage}
          />
          {editor ? (
            <EditorContent editor={editor} />
          ) : (
            <div className="min-h-[280px] animate-pulse bg-muted" />
          )}
        </div>
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

interface ToolbarButtonConfig {
  icon: typeof Bold;
  label: string;
  onClick: () => void;
  isActive: boolean;
}

function Toolbar({
  editor,
  onLink,
  onImage,
}: {
  editor: Editor | null;
  onLink: () => void;
  onImage: () => void;
}) {
  if (!editor) {
    return (
      <div className="flex h-11 items-center border-b border-border px-3 text-xs text-muted-foreground">
        Loading editor…
      </div>
    );
  }

  const buttons: ToolbarButtonConfig[] = [
    {
      icon: Bold,
      label: 'Bold',
      onClick: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
    },
    {
      icon: Italic,
      label: 'Italic',
      onClick: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
    },
    {
      icon: Heading2,
      label: 'Heading 2',
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
    },
    {
      icon: Heading3,
      label: 'Heading 3',
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive('heading', { level: 3 }),
    },
    {
      icon: List,
      label: 'Bullet list',
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
    },
    {
      icon: ListOrdered,
      label: 'Numbered list',
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
    },
    {
      icon: Quote,
      label: 'Blockquote',
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote'),
    },
    {
      icon: Code2,
      label: 'Code block',
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: editor.isActive('codeBlock'),
    },
    {
      icon: Link2,
      label: 'Link',
      onClick: onLink,
      isActive: editor.isActive('link'),
    },
    {
      icon: ImagePlus,
      label: 'Image',
      onClick: onImage,
      isActive: false,
    },
    {
      icon: Undo2,
      label: 'Undo',
      onClick: () => editor.chain().focus().undo().run(),
      isActive: false,
    },
    {
      icon: Redo2,
      label: 'Redo',
      onClick: () => editor.chain().focus().redo().run(),
      isActive: false,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border p-2">
      {buttons.map(({ icon: Icon, label, onClick, isActive }) => (
        <button
          key={label}
          type="button"
          onClick={onClick}
          aria-label={label}
          aria-pressed={isActive}
          className={cn(
            'inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted',
            isActive && 'bg-primary/10 text-primary'
          )}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </button>
      ))}
    </div>
  );
}
