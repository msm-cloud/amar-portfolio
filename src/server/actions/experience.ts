'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export interface ExperienceFormState {
  status: 'idle' | 'error';
  message: string | null;
}

const TITLE_MAX_LENGTH = 150;

function readFields(formData: FormData) {
  return {
    title: String(formData.get('title') ?? '').trim(),
    titleBn: String(formData.get('title_bn') ?? '').trim(),
    organization: String(formData.get('organization') ?? '').trim(),
    organizationBn: String(formData.get('organization_bn') ?? '').trim(),
    description: String(formData.get('description') ?? '').trim(),
    descriptionBn: String(formData.get('description_bn') ?? '').trim(),
    startDate: String(formData.get('start_date') ?? '').trim(),
    endDate: String(formData.get('end_date') ?? '').trim(),
    isCurrent: String(formData.get('is_current') ?? 'false') === 'true',
    displayOrder: Number(formData.get('display_order') ?? 0),
  };
}

function validate(fields: ReturnType<typeof readFields>): string | null {
  if (!fields.title || fields.title.length > TITLE_MAX_LENGTH) {
    return `Job title is required (max ${TITLE_MAX_LENGTH} characters).`;
  }
  if (!fields.organization || fields.organization.length > TITLE_MAX_LENGTH) {
    return `Organization is required (max ${TITLE_MAX_LENGTH} characters).`;
  }
  if (!fields.startDate) {
    return 'Start date is required.';
  }
  if (!Number.isFinite(fields.displayOrder)) {
    return 'Display order must be a number.';
  }
  return null;
}

/**
 * Create an experience entry. Designed for React's useActionState:
 *   const [state, formAction] = useActionState(createExperience, { status: 'idle', message: null });
 */
export async function createExperience(
  _prevState: ExperienceFormState,
  formData: FormData
): Promise<ExperienceFormState> {
  const fields = readFields(formData);
  const validationError = validate(fields);
  if (validationError) {
    return { status: 'error', message: validationError };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('experience').insert({
    title: fields.title,
    title_bn: fields.titleBn || null,
    organization: fields.organization,
    organization_bn: fields.organizationBn || null,
    description: fields.description || null,
    description_bn: fields.descriptionBn || null,
    start_date: fields.startDate,
    // is_current entries have no end date, regardless of what the
    // (disabled) End Date field held client-side - never trust that over
    // the toggle itself.
    end_date: fields.isCurrent ? null : fields.endDate || null,
    is_current: fields.isCurrent,
    display_order: fields.displayOrder,
  });

  if (error) {
    console.error('[experience] createExperience failed:', error);
    return {
      status: 'error',
      message: 'Something went wrong creating the experience entry.',
    };
  }

  revalidatePath('/admin/experience');
  revalidatePath('/');
  redirect('/admin/experience');
}

/**
 * Update an experience entry. `id` is pre-bound by the caller:
 *   const action = updateExperience.bind(null, entry.id);
 *   const [state, formAction] = useActionState(action, { status: 'idle', message: null });
 */
export async function updateExperience(
  id: string,
  _prevState: ExperienceFormState,
  formData: FormData
): Promise<ExperienceFormState> {
  const fields = readFields(formData);
  const validationError = validate(fields);
  if (validationError) {
    return { status: 'error', message: validationError };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('experience')
    .update({
      title: fields.title,
      title_bn: fields.titleBn || null,
      organization: fields.organization,
      organization_bn: fields.organizationBn || null,
      description: fields.description || null,
      description_bn: fields.descriptionBn || null,
      start_date: fields.startDate,
      end_date: fields.isCurrent ? null : fields.endDate || null,
      is_current: fields.isCurrent,
      display_order: fields.displayOrder,
    })
    .eq('id', id);

  if (error) {
    console.error('[experience] updateExperience failed:', error);
    return {
      status: 'error',
      message: 'Something went wrong saving the experience entry.',
    };
  }

  revalidatePath('/admin/experience');
  revalidatePath('/');
  redirect('/admin/experience');
}

/**
 * Delete an experience entry. Called directly from a client component (not
 * via a <form>) - the confirm-before-delete step happens client-side first.
 */
export async function deleteExperience(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('experience').delete().eq('id', id);

  if (error) {
    console.error('[experience] deleteExperience failed:', error);
    return;
  }

  revalidatePath('/admin/experience');
  revalidatePath('/');
}

/**
 * Move an experience entry up or down one position in the admin list's
 * display order - see the identical note in server/actions/skills.ts's
 * moveSkill for why every row gets re-numbered rather than swapping raw
 * values. Note this only reorders the *admin* list: the public Experience
 * section sorts by start_date instead (a timeline, not a manually curated
 * order), so this button doesn't change visitor-facing order.
 */
export async function moveExperience(
  id: string,
  direction: 'up' | 'down'
): Promise<void> {
  const supabase = await createClient();
  const { data: entries, error } = await supabase
    .from('experience')
    .select('id, display_order')
    .order('display_order', { ascending: true })
    .order('id', { ascending: true });

  if (error || !entries) {
    console.error('[experience] moveExperience failed to load list:', error);
    return;
  }

  const index = entries.findIndex((entry) => entry.id === id);
  const swapIndex = direction === 'up' ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= entries.length) {
    return; // not found, or already at the top/bottom - nothing to do
  }

  const reordered = [...entries];
  [reordered[index], reordered[swapIndex]] = [
    reordered[swapIndex],
    reordered[index],
  ];

  for (const [i, entry] of reordered.entries()) {
    if (entry.display_order === i) continue;
    const { error: updateError } = await supabase
      .from('experience')
      .update({ display_order: i })
      .eq('id', entry.id);
    if (updateError) {
      console.error(
        '[experience] moveExperience failed to update order:',
        updateError
      );
      return;
    }
  }

  revalidatePath('/admin/experience');
  revalidatePath('/');
}
