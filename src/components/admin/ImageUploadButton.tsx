'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { ImageUp, Loader2 } from 'lucide-react';
import { compressImage } from '@/lib/compress-image';
import { ALLOWED_PHOTO_TYPES, MAX_PHOTO_BYTES } from '@/lib/profile-photo';
import { cn } from '@/lib/utils';
import { uploadContentImage } from '@/server/actions/uploads';

/**
 * Picks an image from the user's device, compresses it, uploads it to
 * Supabase Storage and hands back the public URL via `onUploaded`.
 *
 * `variant="button"` renders a labelled button; `variant="icon"` renders a
 * compact icon-only button (for the rich-text editor toolbar).
 */
export function ImageUploadButton({
  onUploaded,
  folder = 'projects',
  label = 'Upload image',
  maxDimension = 1600,
  className,
  variant = 'button',
}: {
  onUploaded: (url: string) => void;
  folder?: 'projects' | 'blog';
  label?: string;
  maxDimension?: number;
  className?: string;
  variant?: 'button' | 'icon';
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function open() {
    if (!isUploading) inputRef.current?.click();
  }

  const icon = isUploading ? (
    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
  ) : (
    <ImageUp className="h-4 w-4" aria-hidden />
  );

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    // Reset so picking the same file again still fires onChange.
    input.value = '';
    if (!file) return;

    setError(null);
    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
      setError('Image must be a JPEG, PNG, WebP, or GIF file.');
      return;
    }

    setIsUploading(true);
    try {
      const processed = await compressImage(file, { maxDimension });
      if (processed.size > MAX_PHOTO_BYTES) {
        setError(
          `"${file.name}" is ${(processed.size / (1024 * 1024)).toFixed(1)}MB - images must be under 5MB.`
        );
        return;
      }

      const formData = new FormData();
      formData.append('file', processed);
      formData.append('folder', folder);
      const result = await uploadContentImage(formData);

      if (result.status === 'success') {
        onUploaded(result.url);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error('[ImageUploadButton] upload failed:', err);
      setError('Something went wrong uploading the image.');
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <span className={cn('inline-flex flex-col gap-1', className)}>
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_PHOTO_TYPES.join(',')}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={handleChange}
      />
      {variant === 'icon' ? (
        <button
          type="button"
          onClick={open}
          disabled={isUploading}
          aria-label={label}
          title={label}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted disabled:opacity-60"
        >
          {icon}
        </button>
      ) : (
        <button
          type="button"
          onClick={open}
          disabled={isUploading}
          className="inline-flex w-fit items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted disabled:opacity-60"
        >
          {icon}
          {isUploading ? 'Uploading…' : label}
        </button>
      )}
      {error && (
        <span role="alert" className="text-xs text-red-600 dark:text-red-400">
          {error}
        </span>
      )}
    </span>
  );
}
