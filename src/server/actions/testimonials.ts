'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export interface TestimonialFormState {
  status: 'idle' | 'error';
  message: string | null;
}

const NAME_MAX_LENGTH = 150;

function readFields(formData: FormData) {
  return {
    authorName: String(formData.get('author_name') ?? '').trim(),
    authorTitle: String(formData.get('author_title') ?? '').trim(),
    authorCompany: String(formData.get('author_company') ?? '').trim(),
    content: String(formData.get('content') ?? '').trim(),
    contentBn: String(formData.get('content_bn') ?? '').trim(),
    avatarUrl: String(formData.get('avatar_url') ?? '').trim(),
    isFeatured: String(formData.get('is_featured') ?? 'false') === 'true',
    displayOrder: Number(formData.get('display_order') ?? 0),
  };
}

function validate(fields: ReturnType<typeof readFields>): string | null {
  if (!fields.authorName || fields.authorName.length > NAME_MAX_LENGTH) {
    return `Author name is required (max ${NAME_MAX_LENGTH} characters).`;
  }
  if (!fields.content) {
    return 'Content is required.';
  }
  if (!Number.isFinite(fields.displayOrder)) {
    return 'Display order must be a number.';
  }
  return null;
}

/**
 * Create a testimonial. Designed for React's useActionState:
 *   const [state, formAction] = useActionState(createTestimonial, { status: 'idle', message: null });
 */
export async function createTestimonial(
  _prevState: TestimonialFormState,
  formData: FormData
): Promise<TestimonialFormState> {
  const fields = readFields(formData);
  const validationError = validate(fields);
  if (validationError) {
    return { status: 'error', message: validationError };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('testimonials').insert({
    author_name: fields.authorName,
    author_title: fields.authorTitle || null,
    author_company: fields.authorCompany || null,
    content: fields.content,
    content_bn: fields.contentBn || null,
    avatar_url: fields.avatarUrl || null,
    is_featured: fields.isFeatured,
    display_order: fields.displayOrder,
  });

  if (error) {
    console.error('[testimonials] createTestimonial failed:', error);
    return {
      status: 'error',
      message: 'Something went wrong creating the testimonial.',
    };
  }

  revalidatePath('/admin/testimonials');
  revalidatePath('/');
  redirect('/admin/testimonials');
}

/**
 * Update a testimonial. `id` is pre-bound by the caller:
 *   const action = updateTestimonial.bind(null, testimonial.id);
 *   const [state, formAction] = useActionState(action, { status: 'idle', message: null });
 */
export async function updateTestimonial(
  id: string,
  _prevState: TestimonialFormState,
  formData: FormData
): Promise<TestimonialFormState> {
  const fields = readFields(formData);
  const validationError = validate(fields);
  if (validationError) {
    return { status: 'error', message: validationError };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('testimonials')
    .update({
      author_name: fields.authorName,
      author_title: fields.authorTitle || null,
      author_company: fields.authorCompany || null,
      content: fields.content,
      content_bn: fields.contentBn || null,
      avatar_url: fields.avatarUrl || null,
      is_featured: fields.isFeatured,
      display_order: fields.displayOrder,
    })
    .eq('id', id);

  if (error) {
    console.error('[testimonials] updateTestimonial failed:', error);
    return {
      status: 'error',
      message: 'Something went wrong saving the testimonial.',
    };
  }

  revalidatePath('/admin/testimonials');
  revalidatePath('/');
  redirect('/admin/testimonials');
}

/**
 * Delete a testimonial. Called directly from a client component (not via
 * a <form>) - the confirm-before-delete step happens client-side first.
 */
export async function deleteTestimonial(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('testimonials').delete().eq('id', id);

  if (error) {
    console.error('[testimonials] deleteTestimonial failed:', error);
    return;
  }

  revalidatePath('/admin/testimonials');
  revalidatePath('/');
}

/**
 * Move a testimonial up or down one position in display order - see the
 * identical note in server/actions/skills.ts's moveSkill for why every
 * row gets re-numbered rather than swapping raw values. `id` is the
 * tie-break sort key (testimonials has no created_at column, unlike
 * projects).
 */
export async function moveTestimonial(
  id: string,
  direction: 'up' | 'down'
): Promise<void> {
  const supabase = await createClient();
  const { data: testimonials, error } = await supabase
    .from('testimonials')
    .select('id, display_order')
    .order('display_order', { ascending: true })
    .order('id', { ascending: true });

  if (error || !testimonials) {
    console.error(
      '[testimonials] moveTestimonial failed to load list:',
      error
    );
    return;
  }

  const index = testimonials.findIndex((t) => t.id === id);
  const swapIndex = direction === 'up' ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= testimonials.length) {
    return; // not found, or already at the top/bottom - nothing to do
  }

  const reordered = [...testimonials];
  [reordered[index], reordered[swapIndex]] = [
    reordered[swapIndex],
    reordered[index],
  ];

  for (const [i, testimonial] of reordered.entries()) {
    if (testimonial.display_order === i) continue;
    const { error: updateError } = await supabase
      .from('testimonials')
      .update({ display_order: i })
      .eq('id', testimonial.id);
    if (updateError) {
      console.error(
        '[testimonials] moveTestimonial failed to update order:',
        updateError
      );
      return;
    }
  }

  revalidatePath('/admin/testimonials');
  revalidatePath('/');
}
