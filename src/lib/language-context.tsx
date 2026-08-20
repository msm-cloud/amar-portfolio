'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from 'react';

export type Language = 'en' | 'bn';

/** A piece of placeholder content written in both languages. */
export interface Bilingual {
  en: string;
  bn: string;
}

/** Picks the string for the active language from a Bilingual pair. */
export function pickText(value: Bilingual, language: Language): string {
  return language === 'bn' ? value.bn : value.en;
}

const STORAGE_KEY = 'language';

function isLanguage(value: string | null): value is Language {
  return value === 'en' || value === 'bn';
}

// Module-level pub-sub so useSyncExternalStore can react to a change made
// in THIS tab (the native "storage" event only fires in OTHER tabs).
const listeners = new Set<() => void>();

function getSnapshot(): Language {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isLanguage(stored) ? stored : 'en';
}

// Always 'en' during SSR and the initial client render, matching what the
// server rendered — React swaps in the real getSnapshot() value right
// after hydration. This is what avoids a hydration mismatch without any
// manual useEffect-based "mounted" flag (and without tripping
// eslint-plugin-react-hooks's set-state-in-effect rule, which the
// classic version of this pattern does - see ThemeToggle/useHasMounted
// for where that was hit before).
function getServerSnapshot(): Language {
  return 'en';
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  window.addEventListener('storage', callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener('storage', callback);
  };
}

function persistLanguage(language: Language) {
  window.localStorage.setItem(STORAGE_KEY, language);
  listeners.forEach((listener) => listener());
}

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const setLanguage = useCallback((next: Language) => {
    persistLanguage(next);
  }, []);

  // Keep <html lang> in sync with the active language - screen readers
  // use it to pick pronunciation/voice rules. A DOM-attribute sync like
  // this (not a setState call) is exactly what useEffect is for.
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
