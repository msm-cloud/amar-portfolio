import type { NavItem, SocialLink } from '@/types';

/**
 * config/site.ts
 * ---------------
 * Site-wide configuration: name, description, nav items, social links.
 * Placeholder values for now — update these once real content is ready.
 */

export const siteConfig = {
  // Header/Footer brand wordmark - NOT the SEO <title> (see seoTitle
  // below). Keep these decoupled: the wordmark is short site branding,
  // the SEO title is a full "Name — role" string search engines and
  // share-link previews actually show.
  name: 'Amar Portfolio',
  ownerName: 'Shahid',
  seoTitle: 'Shahid — Web Developer & Graphic Designer',
  description:
    'Portfolio of Shahid, a web developer and graphic designer with financial-sector operations experience, showcasing projects, skills, and writing.',
  // Real deployed production domain (used for metadataBase, Open Graph/
  // Twitter absolute URLs, sitemap.ts/robots.ts, and the password-reset
  // email's redirect - see requestPasswordReset in server/actions/auth.ts).
  url: 'https://amar-portfolio-nu.vercel.app',
};

// Homepage-section items use a "/#section" href (not a bare "#section") -
// see components/ui/SectionNavLink.tsx for why: a bare hash only works
// when already on the homepage, so clicking one from /blog, a project
// detail page, or /admin/* just rewrote the current page's URL and did
// nothing. "/#section" always navigates to the homepage first (Next.js's
// Link scrolls to the hash on landing), and SectionNavLink handles the
// "already on the homepage" case itself. Each item's `key` matches both
// its section id and its `nav.<key>` translation. Blog is a real route
// (/blog), not a homepage section - it still gets a `key` for translation
// lookup, just no section-anchor behavior. #contact is a placeholder
// target until the Contact section itself is built.
export const navItems: NavItem[] = [
  { key: 'about', label: 'About', href: '/#about' },
  { key: 'skills', label: 'Skills', href: '/#skills' },
  { key: 'projects', label: 'Projects', href: '/#projects' },
  { key: 'experience', label: 'Experience', href: '/#experience' },
  {
    key: 'certifications',
    label: 'Certifications',
    href: '/#certifications',
  },
  { key: 'testimonials', label: 'Testimonials', href: '/#testimonials' },
  { key: 'blog', label: 'Blog', href: '/blog' },
  { key: 'contact', label: 'Contact', href: '/#contact' },
];

export const socialLinks: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/msm-cloud', external: true },
  // PLACEHOLDER - needs a real LinkedIn profile URL.
  { label: 'LinkedIn', href: '#' },
  // PLACEHOLDER - needs a real Facebook Page URL.
  { label: 'Facebook', href: '#' },
  // WhatsApp click-to-chat link (wa.me) - opens a chat with this number
  // directly, no contact-saving required on the visitor's end.
  { label: 'WhatsApp', href: 'https://wa.me/8801730785805', external: true },
  { label: 'Email', href: 'mailto:mmshahidullah103@gmail.com' },
];
