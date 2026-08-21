import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Pencil, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { buttonVariants } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/server';
import { getInitials } from '@/lib/utils';
import { DeleteTestimonialButton } from './delete-testimonial-button';
import { MoveTestimonialButtons } from './move-testimonial-buttons';

export default async function AdminTestimonialsListPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defense in depth - see the same note in admin/dashboard/page.tsx.
  if (!user) {
    redirect('/admin/login');
  }

  // Same ordering moveTestimonial's swap logic assumes. `id` is the
  // tie-break for rows sharing a display_order (testimonials has no
  // created_at column, unlike projects).
  const { data: testimonials, error } = await supabase
    .from('testimonials')
    .select(
      'id, author_name, author_title, author_company, is_featured, display_order'
    )
    .order('display_order', { ascending: true })
    .order('id', { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">
          Testimonials
        </h1>
        <Link
          href="/admin/testimonials/new"
          className={buttonVariants({ variant: 'primary', size: 'sm' })}
        >
          <Plus className="mr-1.5 h-4 w-4" aria-hidden />
          New Testimonial
        </Link>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">
          Failed to load testimonials. Please refresh and try again.
        </p>
      )}

      {!error && (testimonials?.length ?? 0) === 0 && (
        <p className="mt-6 text-sm text-muted-foreground">
          No testimonials yet — click &quot;New Testimonial&quot; to add the
          first one.
        </p>
      )}

      {!error && (testimonials?.length ?? 0) > 0 && (
        <ul className="mt-6 flex flex-col divide-y divide-border">
          {testimonials!.map((testimonial, index) => {
            const subtitle = [
              testimonial.author_title,
              testimonial.author_company,
            ]
              .filter(Boolean)
              .join(' · ');

            return (
              <li
                key={testimonial.id}
                className="flex items-center gap-4 py-4"
              >
                <MoveTestimonialButtons
                  id={testimonial.id}
                  disableUp={index === 0}
                  disableDown={index === testimonials!.length - 1}
                />

                <span
                  aria-hidden
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
                >
                  {getInitials(testimonial.author_name)}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate text-sm font-medium text-foreground">
                      {testimonial.author_name}
                    </span>
                    {testimonial.is_featured && (
                      <Badge className="bg-accent/15 text-accent">
                        Featured
                      </Badge>
                    )}
                  </div>
                  {subtitle && (
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {subtitle}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/admin/testimonials/${testimonial.id}/edit`}
                    className={buttonVariants({
                      variant: 'outline',
                      size: 'sm',
                    })}
                  >
                    <Pencil className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                    Edit
                  </Link>
                  <DeleteTestimonialButton
                    id={testimonial.id}
                    name={testimonial.author_name}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
