'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export interface SkillFormState {
  status: 'idle' | 'error';
  message: string | null;
}

const NAME_MAX_LENGTH = 100;

function readFields(formData: FormData) {
  return {
    name: String(formData.get('name') ?? '').trim(),
    category: String(formData.get('category') ?? '').trim(),
    proficiencyLevel: Number(formData.get('proficiency_level') ?? 0),
    iconName: String(formData.get('icon_name') ?? '').trim(),
    displayOrder: Number(formData.get('display_order') ?? 0),
  };
}

function validate(fields: ReturnType<typeof readFields>): string | null {
  if (!fields.name || fields.name.length > NAME_MAX_LENGTH) {
    return `Name is required (max ${NAME_MAX_LENGTH} characters).`;
  }
  if (
    !Number.isInteger(fields.proficiencyLevel) ||
    fields.proficiencyLevel < 1 ||
    fields.proficiencyLevel > 5
  ) {
    return 'Proficiency level must be a whole number from 1 to 5.';
  }
  if (!Number.isFinite(fields.displayOrder)) {
    return 'Display order must be a number.';
  }
  return null;
}

/**
 * Create a skill. Designed for React's useActionState:
 *   const [state, formAction] = useActionState(createSkill, { status: 'idle', message: null });
 */
export async function createSkill(
  _prevState: SkillFormState,
  formData: FormData
): Promise<SkillFormState> {
  const fields = readFields(formData);
  const validationError = validate(fields);
  if (validationError) {
    return { status: 'error', message: validationError };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('skills').insert({
    name: fields.name,
    category: fields.category || null,
    proficiency_level: fields.proficiencyLevel,
    icon_name: fields.iconName || null,
    display_order: fields.displayOrder,
  });

  if (error) {
    console.error('[skills] createSkill failed:', error);
    return {
      status: 'error',
      message: 'Something went wrong creating the skill.',
    };
  }

  revalidatePath('/admin/skills');
  revalidatePath('/');
  redirect('/admin/skills');
}

/**
 * Update a skill. `id` is pre-bound by the caller:
 *   const action = updateSkill.bind(null, skill.id);
 *   const [state, formAction] = useActionState(action, { status: 'idle', message: null });
 */
export async function updateSkill(
  id: string,
  _prevState: SkillFormState,
  formData: FormData
): Promise<SkillFormState> {
  const fields = readFields(formData);
  const validationError = validate(fields);
  if (validationError) {
    return { status: 'error', message: validationError };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('skills')
    .update({
      name: fields.name,
      category: fields.category || null,
      proficiency_level: fields.proficiencyLevel,
      icon_name: fields.iconName || null,
      display_order: fields.displayOrder,
    })
    .eq('id', id);

  if (error) {
    console.error('[skills] updateSkill failed:', error);
    return {
      status: 'error',
      message: 'Something went wrong saving the skill.',
    };
  }

  revalidatePath('/admin/skills');
  revalidatePath('/');
  redirect('/admin/skills');
}

/**
 * Delete a skill. Called directly from a client component (not via a
 * <form>) - the confirm-before-delete step happens client-side first.
 */
export async function deleteSkill(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('skills').delete().eq('id', id);

  if (error) {
    console.error('[skills] deleteSkill failed:', error);
    return;
  }

  revalidatePath('/admin/skills');
  revalidatePath('/');
}

/**
 * Move a skill up or down one position in display order. Re-numbers every
 * row's display_order to its new index (0, 1, 2, ...) rather than just
 * swapping the two rows' existing values - a plain value-swap is a no-op
 * whenever two rows already share the same display_order (e.g. freshly
 * created skills, which all default to 0). `id` is the secondary sort key
 * (skills has no created_at column to tie-break with, unlike projects).
 *
 * Called directly from a client component, like deleteSkill above.
 */
export async function moveSkill(
  id: string,
  direction: 'up' | 'down'
): Promise<void> {
  const supabase = await createClient();
  const { data: skills, error } = await supabase
    .from('skills')
    .select('id, display_order')
    .order('display_order', { ascending: true })
    .order('id', { ascending: true });

  if (error || !skills) {
    console.error('[skills] moveSkill failed to load list:', error);
    return;
  }

  const index = skills.findIndex((skill) => skill.id === id);
  const swapIndex = direction === 'up' ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= skills.length) {
    return; // not found, or already at the top/bottom - nothing to do
  }

  const reordered = [...skills];
  [reordered[index], reordered[swapIndex]] = [
    reordered[swapIndex],
    reordered[index],
  ];

  for (const [i, skill] of reordered.entries()) {
    if (skill.display_order === i) continue;
    const { error: updateError } = await supabase
      .from('skills')
      .update({ display_order: i })
      .eq('id', skill.id);
    if (updateError) {
      console.error('[skills] moveSkill failed to update order:', updateError);
      return;
    }
  }

  revalidatePath('/admin/skills');
  revalidatePath('/');
}
