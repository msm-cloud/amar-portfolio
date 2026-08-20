import en from './translations/en.json';
import bn from './translations/bn.json';
import { useLanguage } from './language-context';

const dictionaries = { en, bn };

function getNestedValue(source: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, segment) => {
    if (acc && typeof acc === 'object' && segment in acc) {
      return (acc as Record<string, unknown>)[segment];
    }
    return undefined;
  }, source);
}

/**
 * Static-UI-text translation hook. `t('contact.sendButton')` looks up the
 * key (dot path into the JSON dictionaries) in the active language, falls
 * back to English if missing there too, and finally falls back to the raw
 * key itself — so a missing translation shows up as an odd-looking string
 * in the UI instead of a blank space or a crash.
 *
 * For bilingual placeholder CONTENT (project descriptions, experience
 * entries, etc.), use `pickText`/`pickBilingual` instead - this hook is
 * only for the static chrome text in src/lib/translations/*.json.
 */
export function useTranslation() {
  const { language } = useLanguage();

  function t(key: string): string {
    const value = getNestedValue(dictionaries[language], key);
    if (typeof value === 'string') return value;

    const fallback = getNestedValue(dictionaries.en, key);
    if (typeof fallback === 'string') return fallback;

    return key;
  }

  return { t, language };
}
