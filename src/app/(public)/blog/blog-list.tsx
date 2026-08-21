'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Newspaper } from 'lucide-react';
import { BentoCard } from '@/components/ui/BentoCard';
import { CoverImage } from '@/components/ui/CoverImage';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { estimateReadingTime, formatPublishedDate } from '@/lib/blog';
import { useTranslation } from '@/lib/use-translation';
import type { Database } from '@/types/database';

type BlogPost = Database['public']['Tables']['blog_posts']['Row'];

export function BlogList({
  posts,
  error,
}: {
  posts: BlogPost[];
  error: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();
  const { t } = useTranslation();

  if (error) {
    return (
      <p className="text-sm text-red-600 dark:text-red-400">
        {t('blog.loadError')}
      </p>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-12 text-center">
        <Newspaper
          className="mx-auto h-8 w-8 text-muted-foreground"
          aria-hidden
        />
        <p className="mt-4 text-sm text-muted-foreground">{t('blog.empty')}</p>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      variants={staggerContainer}
      initial={shouldReduceMotion ? 'visible' : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      {posts.map((post) => (
        <motion.div key={post.id} variants={fadeInUp}>
          <Link href={`/blog/${post.slug}`} className="block h-full">
            <BentoCard className="h-full overflow-hidden hover:-translate-y-1">
              <div className="-m-6 mb-4">
                <CoverImage
                  src={post.cover_image_url}
                  alt={post.title}
                  icon={Newspaper}
                  className="h-40 w-full"
                />
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <h3 className="text-lg font-semibold text-foreground">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {post.excerpt}
                  </p>
                )}
                <div className="mt-auto flex items-center gap-2 pt-2 text-xs text-muted-foreground">
                  <span>{formatPublishedDate(post.published_at)}</span>
                  <span aria-hidden>·</span>
                  <span>
                    {estimateReadingTime(post.content)} {t('blog.minRead')}
                  </span>
                </div>
              </div>
            </BentoCard>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
