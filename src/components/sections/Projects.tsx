'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { BentoCard } from '@/components/ui/BentoCard';
import { CoverImage } from '@/components/ui/CoverImage';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import {
  getCategoryIcon,
  PLACEHOLDER_PROJECTS,
  type PlaceholderProject,
} from '@/lib/placeholder-data';

// Featured projects render larger (large/wide) — the first featured
// project found (regardless of its position in the array) gets the big
// tile, the second gets the wide tile, any further ones fall back to the
// default size. Grid-span classes live on the motion.div wrapper (the
// actual CSS grid item), not on the nested BentoCard — see the note in
// components/ui/README.md for why that distinction matters.
function spanClassFor(featuredIndex: number): string {
  if (featuredIndex === 0) return 'sm:col-span-2 sm:row-span-2';
  if (featuredIndex === 1) return 'sm:col-span-3';
  return '';
}

function ProjectCard({ project }: { project: PlaceholderProject }) {
  const CategoryIcon = getCategoryIcon(project.category);

  return (
    <Link href={`/projects/${project.slug}`} className="block h-full">
      <BentoCard className="h-full overflow-hidden">
        <div className="-m-6 mb-4">
          <CoverImage
            src={project.cover_image_url}
            alt={project.title}
            icon={CategoryIcon}
            className="h-40 w-full sm:h-48"
          />
        </div>

        <div className="flex flex-1 flex-col gap-2">
          {project.category && <Badge>{project.category}</Badge>}

          <h3 className="text-lg font-semibold text-foreground">
            {project.title}
          </h3>

          <p className="line-clamp-2 text-sm text-muted-foreground">
            {project.description}
          </p>

          {project.tags.length > 0 && (
            <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
              {project.tags.map((tag) => (
                <Badge key={tag} className="bg-muted text-muted-foreground">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </BentoCard>
    </Link>
  );
}

export function Projects() {
  const shouldReduceMotion = useReducedMotion();
  let featuredCount = 0;

  return (
    <SectionContainer id="projects">
      <SectionHeading
        eyebrow="Projects"
        title="Selected Work"
        description="A mix of client web development, personal projects, and graphic design — spanning the financial sector and beyond."
      />

      {/* PLACEHOLDER data - src/lib/placeholder-data.ts. Replace with a
          Supabase query once the admin panel's content management is
          built; field names already match the `projects` table exactly. */}
      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        variants={staggerContainer}
        initial={shouldReduceMotion ? 'visible' : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {PLACEHOLDER_PROJECTS.map((project) => {
          const spanClass = project.is_featured
            ? spanClassFor(featuredCount++)
            : '';

          return (
            <motion.div
              key={project.slug}
              variants={fadeInUp}
              className={spanClass}
            >
              <ProjectCard project={project} />
            </motion.div>
          );
        })}
      </motion.div>
    </SectionContainer>
  );
}
