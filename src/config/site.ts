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

// Hash anchors matching each homepage section's id (Header/Footer smooth-
// scroll to these). #contact is a placeholder target until the Contact
// section itself is built.
export const navItems: NavItem[] = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Contact', href: '#contact' },
];

// PLACEHOLDER - replace via admin panel / real profile URLs once available.
export const socialLinks: SocialLink[] = [
  { label: 'GitHub', href: '#' },
  { label: 'Facebook', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'Email', href: 'mailto:hello@example.com' },
];
