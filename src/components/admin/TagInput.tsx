'use client';

import { useState, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';

/**
 * Type-and-press-Enter multi-tag input for a `text[]` column (e.g.
 * `projects.tags`). Tags are kept in local state and serialized into a
 * comma-separated hidden input on every change - the server action splits
 * that back into an array, so this needs no client-side JSON encoding.
 */
export function TagInput({
  name,
  label,
  initialTags = [],
}: {
  name: string;
  label: string;
  initialTags?: string[];
}) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [draft, setDraft] = useState('');

  function commitDraft() {
    const value = draft.trim();
    if (value && !tags.includes(value)) {
      setTags((prev) => [...prev, value]);
    }
    setDraft('');
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      commitDraft();
    } else if (event.key === 'Backspace' && draft === '' && tags.length > 0) {
      // Backspace on an empty draft deletes the last chip - matches the
      // convention most tag/chip inputs use.
      setTags((prev) => prev.slice(0, -1));
    }
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={`${name}-input`}
        className="text-sm font-medium text-muted-foreground"
      >
        {label}
      </label>
      <input type="hidden" name={name} value={tags.join(',')} readOnly />
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 focus-within:border-primary">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={`Remove ${tag}`}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-3 w-3" aria-hidden />
            </button>
          </span>
        ))}
        <input
          id={`${name}-input`}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commitDraft}
          placeholder={tags.length === 0 ? 'Type a tag and press Enter' : ''}
          className="min-w-32 flex-1 bg-transparent text-sm text-foreground outline-none"
        />
      </div>
    </div>
  );
}
