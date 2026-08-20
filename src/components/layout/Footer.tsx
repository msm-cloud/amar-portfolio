import { Briefcase, Code2, Mail, Share2, type LucideIcon } from 'lucide-react';
import { navItems, siteConfig, socialLinks } from '@/config/site';

// lucide-react has no brand-logo icons (confirmed against the installed
// package — same reason "View Code" uses Code2 instead of a GitHub mark
// elsewhere in this app), so these are the closest generic stand-ins,
// not the real platform logos. aria-label on each link still says the
// real platform name for screen readers.
const SOCIAL_ICONS: Record<string, LucideIcon> = {
  GitHub: Code2,
  Facebook: Share2,
  LinkedIn: Briefcase,
  Email: Mail,
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-muted/40">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-base font-bold tracking-tight text-foreground">
            {siteConfig.name}
          </span>

          {/* PLACEHOLDER hrefs - replace via admin panel with real profile
              URLs (Email already links out via mailto:). */}
          <div className="flex items-center gap-2">
            {socialLinks.map((link) => {
              const Icon = SOCIAL_ICONS[link.label] ?? Share2;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={
                    link.href.startsWith('mailto:') ? undefined : '_blank'
                  }
                  rel={
                    link.href.startsWith('mailto:')
                      ? undefined
                      : 'noopener noreferrer'
                  }
                  aria-label={link.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </a>
              );
            })}
          </div>
        </div>

        <nav
          aria-label="Footer"
          className="flex flex-wrap gap-x-6 gap-y-2 border-t border-border/60 pt-6"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <p className="text-sm text-muted-foreground">
          © {year} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
