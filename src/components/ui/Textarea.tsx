import type { TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function Textarea({
  label,
  id,
  name,
  className,
  ...props
}: TextareaProps) {
  const textareaId = id ?? name;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={textareaId}
        className="text-sm font-medium text-muted-foreground"
      >
        {label}
      </label>
      <textarea
        id={textareaId}
        name={name}
        className={cn(
          'rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary',
          className
        )}
        {...props}
      />
    </div>
  );
}
