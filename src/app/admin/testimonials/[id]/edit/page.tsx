import { notFound, redirect } from 'next/navigation';
import { TestimonialForm } from '@/components/admin/TestimonialForm';
import { createClient } from '@/lib/supabase/server';

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defense in depth - see the same note in admin/dashboard/page.tsx.
  // Both 'admin' and 'editor' roles reach this page fine - see the same
  // note in new/page.tsx.
  if (!user) {
    redirect('/admin/login');
  }

  const { data: testimonial } = await supabase
    .from('testimonials')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!testimonial) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">
        Edit Testimonial
      </h1>
      <div className="mt-6 max-w-xl">
        <TestimonialForm mode="edit" testimonial={testimonial} />
      </div>
    </div>
  );
}
