'use client';

import { useLanguage } from '@/lib/language-context';
import { useTranslation } from '@/lib/use-translation';
import { cn } from '@/lib/utils';

/**
 * EN / বাং toggle. Switches the whole site's language instantly -
 * client-side state only, no URL change, no page reload.
 */
export function LanguageToggle({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
      aria-label={t('language.toggleLabel')}
      className={cn(
        'inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-border px-2.5 text-xs font-semibold transition-colors hover:bg-muted',
        className
      )}
    >
      <span
        className={language === 'en' ? 'text-primary' : 'text-muted-foreground'}
      >
        EN
      </span>
      <span aria-hidden className="text-border">
        |
      </span>
      <span
        className={language === 'bn' ? 'text-primary' : 'text-muted-foreground'}
      >
        বাং
      </span>
    </button>
  );
}
