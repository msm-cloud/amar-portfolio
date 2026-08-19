import type { NavItem, SocialLink } from '@/types';

/**
 * config/site.ts
 * ---------------
 * Site-wide configuration: name, description, nav items, social links.
 * Placeholder values for now — update these once real content is ready.
 */

export const siteConfig = {
  name: 'Amar Portfolio',
  description: 'Professional portfolio website.',
  url: 'https://example.com',
};

export const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact', href: '/contact' },
];

export const socialLinks: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/' },
  { label: 'LinkedIn', href: 'https://linkedin.com/' },
];
