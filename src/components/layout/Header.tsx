'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { buttonVariants } from '@/components/ui/Button';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { navItems, siteConfig } from '@/config/site';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useTranslation } from '@/lib/use-translation';
import { cn } from '@/lib/utils';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const { t } = useTranslation();
  const pathname = usePathname();

  // Only hash-anchor items (href starting with "#") participate in
  // scroll-spy - a real route link like Blog (/blog) has nothing to
  // observe on the homepage. Stable across renders (navItems is a
  // module-level constant) so useActiveSection's observer isn't torn
  // down/recreated every render.
  const sectionIds = useMemo(
    () =>
      navItems
        .filter((item) => item.href.startsWith('#'))
        .map((item) => item.key ?? item.href.slice(1)),
    []
  );
  const activeSection = useActiveSection(sectionIds);

  function isNavItemActive(item: (typeof navItems)[number]): boolean {
    if (item.href.startsWith('#')) {
      return activeSection === (item.key ?? item.href.slice(1));
    }
    // Real route link (e.g. /blog) - active when it's the current page.
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  }

  // Transparent-ish at the very top, glass once scrolled.
  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 8);
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the mobile menu on outside click or Escape.
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsMobileMenuOpen(false);
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      ref={headerRef}
      className={cn(
        'sticky top-0 z-50 border-b transition-colors duration-300',
        isScrolled
          ? 'border-border/60 bg-background/80 backdrop-blur-lg'
          : 'border-transparent bg-background/0'
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-base font-bold tracking-tight text-foreground"
        >
          {siteConfig.name}
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = isNavItemActive(item);
            return (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {t(`nav.${item.key ?? item.label.toLowerCase()}`)}
              </a>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageToggle />
          <ThemeToggle />
          {/* PLACEHOLDER - replace via admin panel */}
          <a
            href="#"
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            {t('nav.resume')}
          </a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageToggle />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-label={
              isMobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')
            }
            aria-expanded={isMobileMenuOpen}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <Menu className="h-5 w-5" aria-hidden />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-label={t('nav.mobileNav')}
            className="overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-lg md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {navItems.map((item) => {
                const isActive = isNavItemActive(item);
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    {t(`nav.${item.key ?? item.label.toLowerCase()}`)}
                  </a>
                );
              })}
              {/* PLACEHOLDER - replace via admin panel */}
              <a
                href="#"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'sm' }),
                  'mt-2 w-fit'
                )}
              >
                {t('nav.resume')}
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
