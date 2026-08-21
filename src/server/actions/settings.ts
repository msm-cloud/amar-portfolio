'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { ALLOWED_PHOTO_TYPES, MAX_PHOTO_BYTES } from '@/lib/profile-photo';
import { ALLOWED_RESUME_TYPES, MAX_RESUME_BYTES } from '@/lib/resume';

export interface SettingsFormState {
  status: 'idle' | 'success' | 'error';
  message: string | null;
}

const FULL_NAME_MAX_LENGTH = 150;

function readFields(formData: FormData) {
  return {
    fullName: String(formData.get('full_name') ?? '').trim(),
    fullNameBn: String(formData.get('full_name_bn') ?? '').trim(),
    tagline: String(formData.get('tagline') ?? '').trim(),
    taglineBn: String(formData.get('tagline_bn') ?? '').trim(),
    heroDescription: String(formData.get('hero_description') ?? '').trim(),
    heroDescriptionBn: String(
      formData.get('hero_description_bn') ?? ''
    ).trim(),
    aboutBio: String(formData.get('about_bio') ?? '').trim(),
    aboutBioBn: String(formData.get('about_bio_bn') ?? '').trim(),
    stat1Value: String(formData.get('stat_1_value') ?? '').trim(),
    stat1Label: String(formData.get('stat_1_label') ?? '').trim(),
    stat1ValueBn: String(formData.get('stat_1_value_bn') ?? '').trim(),
    stat1LabelBn: String(formData.get('stat_1_label_bn') ?? '').trim(),
    stat2Value: String(formData.get('stat_2_value') ?? '').trim(),
    stat2Label: String(formData.get('stat_2_label') ?? '').trim(),
    stat2ValueBn: String(formData.get('stat_2_value_bn') ?? '').trim(),
    stat2LabelBn: String(formData.get('stat_2_label_bn') ?? '').trim(),
    stat3Value: String(formData.get('stat_3_value') ?? '').trim(),
    stat3Label: String(formData.get('stat_3_label') ?? '').trim(),
    stat3ValueBn: String(formData.get('stat_3_value_bn') ?? '').trim(),
    stat3LabelBn: String(formData.get('stat_3_label_bn') ?? '').trim(),
  };
}

function validate(fields: ReturnType<typeof readFields>): string | null {
  if (!fields.fullName || fields.fullName.length > FULL_NAME_MAX_LENGTH) {
    return `Full name is required (max ${FULL_NAME_MAX_LENGTH} characters).`;
  }
  return null;
}

/**
 * Update the singleton site_settings row (id = 1). Designed for React's
 * useActionState:
 *   const [state, formAction] = useActionState(updateSiteSettings, { status: 'idle', message: null });
 *
 * Unlike the other admin forms in this app, there's no list page to
 * redirect to afterward - settings IS the page - so this returns a
 * 'success' state for the form to show an inline message instead
 * (same idea as the Contact form's inline success state).
 */
export async function updateSiteSettings(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const fields = readFields(formData);
  const validationError = validate(fields);
  if (validationError) {
    return { status: 'error', message: validationError };
  }

  const supabase = await createClient();

  // Photo upload is optional - only touches Storage/profile_photo_url if
  // a new file was actually chosen; leaving the field empty keeps
  // whatever photo is already saved.
  const photo = formData.get('photo');
  let profilePhotoUrl: string | undefined;

  if (photo instanceof File && photo.size > 0) {
    if (!ALLOWED_PHOTO_TYPES.includes(photo.type)) {
      return {
        status: 'error',
        message: 'Photo must be a JPEG, PNG, WebP, or GIF image.',
      };
    }
    if (photo.size > MAX_PHOTO_BYTES) {
      return { status: 'error', message: 'Photo must be smaller than 5MB.' };
    }

    // Fixed filename (not the original name) - this is a singleton photo,
    // so every upload replaces it (upsert: true) rather than
    // accumulating old files. If the extension changes between uploads
    // (e.g. .jpg -> .png), the old file is simply left orphaned in
    // Storage - harmless, just a little untidy, not worth the extra
    // complexity of tracking/deleting it for what's a single photo.
    const ext = photo.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `profile.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('profile-photos')
      .upload(path, photo, { upsert: true, contentType: photo.type });

    if (uploadError) {
      console.error('[settings] photo upload failed:', uploadError);
      return {
        status: 'error',
        message: 'Something went wrong uploading the photo.',
      };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('profile-photos').getPublicUrl(path);
    // Cache-bust with a query string so the new photo shows immediately
    // instead of a stale cached copy at the same URL (upsert keeps the
    // path identical across uploads).
    profilePhotoUrl = `${publicUrl}?t=${Date.now()}`;
  }

  // Resume upload is optional too - same "only touch it if a new file
  // was actually chosen" behavior as the photo above.
  const resume = formData.get('resume');
  let resumeUrl: string | undefined;

  if (resume instanceof File && resume.size > 0) {
    if (!ALLOWED_RESUME_TYPES.includes(resume.type)) {
      return { status: 'error', message: 'Resume must be a PDF file.' };
    }
    if (resume.size > MAX_RESUME_BYTES) {
      return {
        status: 'error',
        message: 'Resume must be smaller than 5MB.',
      };
    }

    // Fixed filename + upsert: true, same singleton-file reasoning as
    // the profile photo above - there's only ever one resume.
    const path = 'resume.pdf';

    const { error: uploadError } = await supabase.storage
      .from('resume')
      .upload(path, resume, { upsert: true, contentType: resume.type });

    if (uploadError) {
      console.error('[settings] resume upload failed:', uploadError);
      return {
        status: 'error',
        message: 'Something went wrong uploading the resume.',
      };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('resume').getPublicUrl(path);
    // Cache-bust - same reasoning as the photo's URL above.
    resumeUrl = `${publicUrl}?t=${Date.now()}`;
  }

  const { error } = await supabase
    .from('site_settings')
    .update({
      full_name: fields.fullName,
      full_name_bn: fields.fullNameBn || null,
      tagline: fields.tagline || null,
      tagline_bn: fields.taglineBn || null,
      hero_description: fields.heroDescription || null,
      hero_description_bn: fields.heroDescriptionBn || null,
      about_bio: fields.aboutBio || null,
      about_bio_bn: fields.aboutBioBn || null,
      stat_1_value: fields.stat1Value || null,
      stat_1_label: fields.stat1Label || null,
      stat_1_value_bn: fields.stat1ValueBn || null,
      stat_1_label_bn: fields.stat1LabelBn || null,
      stat_2_value: fields.stat2Value || null,
      stat_2_label: fields.stat2Label || null,
      stat_2_value_bn: fields.stat2ValueBn || null,
      stat_2_label_bn: fields.stat2LabelBn || null,
      stat_3_value: fields.stat3Value || null,
      stat_3_label: fields.stat3Label || null,
      stat_3_value_bn: fields.stat3ValueBn || null,
      stat_3_label_bn: fields.stat3LabelBn || null,
      ...(profilePhotoUrl ? { profile_photo_url: profilePhotoUrl } : {}),
      ...(resumeUrl ? { resume_url: resumeUrl } : {}),
    })
    .eq('id', 1);

  if (error) {
    console.error('[settings] updateSiteSettings failed:', error);
    return {
      status: 'error',
      message: 'Something went wrong saving settings.',
    };
  }

  revalidatePath('/admin/settings');
  revalidatePath('/');
  return { status: 'success', message: 'Settings saved.' };
}
