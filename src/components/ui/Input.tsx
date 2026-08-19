import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, id, name, className, ...props }: InputProps) {
  const inputId = id ?? name;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        {label}
      </label>
      <input
        id={inputId}
        name={name}
        className={cn(
          'rounded-lg border border-zinc-300 bg-white/80 px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-100 dark:focus:border-zinc-100',
          className
        )}
        {...props}
      />
    </div>
  );
}
