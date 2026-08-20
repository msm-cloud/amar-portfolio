import type { Variants } from 'framer-motion';

/**
 * lib/animations.ts
 * ------------------
 * Reusable framer-motion variants for scroll-triggered reveal animations.
 * Pair with `whileInView` + `viewport={{ once: true }}` on the element:
 *
 *   <motion.div
 *     variants={fadeInUp}
 *     initial="hidden"
 *     whileInView="visible"
 *     viewport={{ once: true, margin: '-80px' }}
 *   >
 *
 * For a group of children revealing in sequence, put `staggerContainer` on
 * the parent and `fadeInUp` on each child (children read "hidden"/"visible"
 * from the parent's variant automatically — no need to repeat
 * initial/whileInView on each child).
 */

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};
