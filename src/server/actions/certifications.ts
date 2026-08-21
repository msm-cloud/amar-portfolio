'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export interface CertificationFormState {
  status: 'idle' | 'error';
  message: string | null;
}

const TITLE_MAX_LENGTH = 200;

function readFields(formData: FormData) {
  return {
    title: String(formData.get('title') ?? '').trim(),
    titleBn: String(formData.get('title_bn') ?? '').trim(),
    issuingOrganization: String(
      formData.get('issuing_organization') ?? ''
    ).trim(),
    issuingOrganizationBn: String(
      formData.get('issuing_organization_bn') ?? ''
    ).trim(),
    issueDate: String(formData.get('issue_date') ?? '').trim(),
    credentialUrl: String(formData.get('credential_url') ?? '').trim(),
    imageUrl: String(formData.get('image_url') ?? '').trim(),
    displayOrder: Number(formData.get('display_order') ?? 0),
  };
}

function validate(fields: ReturnType<typeof readFields>): string | null {
  if (!fields.title || fields.title.length > TITLE_MAX_LENGTH) {
    return `Title is required (max ${TITLE_MAX_LENGTH} characters).`;
  }
  if (
    !fields.issuingOrganization ||
    fields.issuingOrganization.length > TITLE_MAX_LENGTH
  ) {
    return `Issuing organization is required (max ${TITLE_MAX_LENGTH} characters).`;
  }
  if (!Number.isFinite(fields.displayOrder)) {
    return 'Display order must be a number.';
  }
  return null;
}

/**
 * Create a certification. Designed for React's useActionState:
 *   const [state, formAction] = useActionState(createCertification, { status: 'idle', message: null });
 */
export async function createCertification(
  _prevState: CertificationFormState,
  formData: FormData
): Promise<CertificationFormState> {
  const fields = readFields(formData);
  const validationError = validate(fields);
  if (validationError) {
    return { status: 'error', message: validationError };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('certifications').insert({
    title: fields.title,
    title_bn: fields.titleBn || null,
    issuing_organization: fields.issuingOrganization,
    issuing_organization_bn: fields.issuingOrganizationBn || null,
    issue_date: fields.issueDate || null,
    credential_url: fields.credentialUrl || null,
    image_url: fields.imageUrl || null,
    display_order: fields.displayOrder,
  });

  if (error) {
    console.error('[certifications] createCertification failed:', error);
    return {
      status: 'error',
      message: 'Something went wrong creating the certification.',
    };
  }

  revalidatePath('/admin/certifications');
  revalidatePath('/');
  redirect('/admin/certifications');
}

/**
 * Update a certification. `id` is pre-bound by the caller:
 *   const action = updateCertification.bind(null, cert.id);
 *   const [state, formAction] = useActionState(action, { status: 'idle', message: null });
 */
export async function updateCertification(
  id: string,
  _prevState: CertificationFormState,
  formData: FormData
): Promise<CertificationFormState> {
  const fields = readFields(formData);
  const validationError = validate(fields);
  if (validationError) {
    return { status: 'error', message: validationError };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('certifications')
    .update({
      title: fields.title,
      title_bn: fields.titleBn || null,
      issuing_organization: fields.issuingOrganization,
      issuing_organization_bn: fields.issuingOrganizationBn || null,
      issue_date: fields.issueDate || null,
      credential_url: fields.credentialUrl || null,
      image_url: fields.imageUrl || null,
      display_order: fields.displayOrder,
    })
    .eq('id', id);

  if (error) {
    console.error('[certifications] updateCertification failed:', error);
    return {
      status: 'error',
      message: 'Something went wrong saving the certification.',
    };
  }

  revalidatePath('/admin/certifications');
  revalidatePath('/');
  redirect('/admin/certifications');
}

/**
 * Delete a certification. Called directly from a client component (not
 * via a <form>) - the confirm-before-delete step happens client-side first.
 */
export async function deleteCertification(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('certifications')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[certifications] deleteCertification failed:', error);
    return;
  }

  revalidatePath('/admin/certifications');
  revalidatePath('/');
}

/**
 * Move a certification up or down one position in display order - see the
 * identical note in server/actions/skills.ts's moveSkill for why every row
 * gets re-numbered rather than swapping raw values.
 */
export async function moveCertification(
  id: string,
  direction: 'up' | 'down'
): Promise<void> {
  const supabase = await createClient();
  const { data: certifications, error } = await supabase
    .from('certifications')
    .select('id, display_order')
    .order('display_order', { ascending: true })
    .order('id', { ascending: true });

  if (error || !certifications) {
    console.error(
      '[certifications] moveCertification failed to load list:',
      error
    );
    return;
  }

  const index = certifications.findIndex((cert) => cert.id === id);
  const swapIndex = direction === 'up' ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= certifications.length) {
    return; // not found, or already at the top/bottom - nothing to do
  }

  const reordered = [...certifications];
  [reordered[index], reordered[swapIndex]] = [
    reordered[swapIndex],
    reordered[index],
  ];

  for (const [i, cert] of reordered.entries()) {
    if (cert.display_order === i) continue;
    const { error: updateError } = await supabase
      .from('certifications')
      .update({ display_order: i })
      .eq('id', cert.id);
    if (updateError) {
      console.error(
        '[certifications] moveCertification failed to update order:',
        updateError
      );
      return;
    }
  }

  revalidatePath('/admin/certifications');
  revalidatePath('/');
}
