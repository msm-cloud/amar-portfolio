'use client';

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
import { cn } from '@/lib/utils';

/**
 * Tiptap rich text editor + toolbar, shared by every admin content form
 * that has a "Content" field (blog posts, projects, ...) - extracted from
 * the original blog-only implementation so new forms reuse the exact same
 * editor/toolbar instead of re-implementing it.
 *
 * `immediatelyRender: false` is required in Next.js App Router: Tiptap
 * otherwise renders the editor instance during SSR too, causing a
 * hydration mismatch.
 */
export function RichTextEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TiptapImage,
      TiptapLink.configure({ openOnClick: false }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          'prose prose-sm dark:prose-invert max-w-none min-h-[280px] px-3 py-2 focus:outline-none',
      },
    },
  });

  function promptForLink() {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href as
      | string
      | undefined;
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
    <div className="rounded-lg border border-border bg-background">
      <Toolbar editor={editor} onLink={promptForLink} onImage={promptForImage} />
      {editor ? (
        <EditorContent editor={editor} />
      ) : (
        <div className="min-h-[280px] animate-pulse bg-muted" />
      )}
    </div>
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
