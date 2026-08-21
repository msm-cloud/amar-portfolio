'use client';

import {
  Briefcase,
  Code2,
  Mail,
  MessageCircle,
  Share2,
  type LucideIcon,
} from 'lucide-react';
import { SectionNavLink } from '@/components/ui/SectionNavLink';
import { navItems, siteConfig, socialLinks } from '@/config/site';
import { useTranslation } from '@/lib/use-translation';

// lucide-react has no brand-logo icons (confirmed against the installed
// package — same reason "View Code" uses Code2 instead of a GitHub mark
// elsewhere in this app, and MessageCircle stands in for WhatsApp here),
// so these are the closest generic stand-ins, not the real platform
// logos. aria-label on each link still says the real platform name for
// screen readers. Platform names (GitHub, Facebook, LinkedIn, WhatsApp)
// are brand names and intentionally not translated, same convention as
// elsewhere in this app - "Email" is generic but left consistent with
// its neighbors rather than singled out.
const SOCIAL_ICONS: Record<string, LucideIcon> = {
  GitHub: Code2,
  Facebook: Share2,
  LinkedIn: Briefcase,
  WhatsApp: MessageCircle,
  Email: Mail,
};

export function Footer() {
  const year = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border/60 bg-muted/40">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-base font-bold tracking-tight text-foreground">
            {siteConfig.name}
          </span>

          {/* LinkedIn/Facebook are still "#" placeholders - see the
              comments on socialLinks in config/site.ts. GitHub, WhatsApp,
              and Email all link out for real. */}
          <div className="flex items-center gap-2">
            {socialLinks.map((link) => {
              const Icon = SOCIAL_ICONS[link.label] ?? Share2;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  aria-label={link.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-200 hover:bg-background hover:text-foreground"
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </a>
              );
            })}
          </div>
        </div>

        <div className="border-t border-border/60 pt-6">
          <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {t('footer.quickLinks')}
          </p>
          <nav
            aria-label={t('footer.quickLinks')}
            className="flex flex-wrap gap-x-6 gap-y-2"
          >
            {navItems.map((item) => (
              <SectionNavLink
                key={item.href}
                item={item}
                className="text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
              >
                {t(`nav.${item.key ?? item.label.toLowerCase()}`)}
              </SectionNavLink>
            ))}
          </nav>
        </div>

        <p className="text-sm text-muted-foreground">
          © {year} {siteConfig.name}. {t('footer.rightsReserved')}
        </p>
      </div>
    </footer>
  );
}
