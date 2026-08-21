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

// Homepage-section items use a "#" href (Header/Footer smooth-scroll to
// them) and a `key` matching both their section id and their `nav.<key>`
// translation. Blog is a real route (/blog), not a homepage section - it
// still gets a `key` for translation lookup, just no "#" href/section-id
// behavior. #contact is a placeholder target until the Contact section
// itself is built.
export const navItems: NavItem[] = [
  { key: 'about', label: 'About', href: '#about' },
  { key: 'skills', label: 'Skills', href: '#skills' },
  { key: 'projects', label: 'Projects', href: '#projects' },
  { key: 'experience', label: 'Experience', href: '#experience' },
  { key: 'certifications', label: 'Certifications', href: '#certifications' },
  { key: 'testimonials', label: 'Testimonials', href: '#testimonials' },
  { key: 'blog', label: 'Blog', href: '/blog' },
  { key: 'contact', label: 'Contact', href: '#contact' },
];

// PLACEHOLDER - replace via admin panel / real profile URLs once available.
export const socialLinks: SocialLink[] = [
  { label: 'GitHub', href: '#' },
  { label: 'Facebook', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'Email', href: 'mailto:hello@example.com' },
];
