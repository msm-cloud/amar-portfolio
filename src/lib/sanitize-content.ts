import sanitizeHtml from 'sanitize-html';

/**
 * lib/sanitize-content.ts
 * ------------------------
 * Server-side sanitizer for admin-authored rich-text HTML (Tiptap output)
 * before it's rendered with dangerouslySetInnerHTML on public pages.
 *
 * Uses sanitize-html (pure JS, parser-based) instead of isomorphic-dompurify:
 * the latter pulls in jsdom, whose ESM-only dependencies crashed every
 * project/blog page on Vercel with ERR_REQUIRE_ESM.
 *
 * The allow-list covers everything the Tiptap editor can produce
 * (StarterKit + Image + Link): paragraphs, headings, lists, quotes, code
 * blocks, inline marks, links and images.
 */
const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'p',
    'br',
    'hr',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'strong',
    'b',
    'em',
    'i',
    'u',
    's',
    'strike',
    'code',
    'pre',
    'blockquote',
    'ul',
    'ol',
    'li',
    'a',
    'img',
  ],
  allowedAttributes: {
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height'],
    code: ['class'],
    ol: ['start'],
  },
  allowedClasses: {
    code: [/^language-/],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedSchemesByTag: { img: ['http', 'https'] },
  allowProtocolRelative: false,
  // Links that open in a new tab get rel="noopener noreferrer".
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs:
        attribs.target === '_blank'
          ? { ...attribs, rel: 'noopener noreferrer' }
          : attribs,
    }),
  },
};

export function sanitizeContent(html: string | null | undefined): string {
  return sanitizeHtml(html ?? '', OPTIONS);
}
