'use server';

import { ALLOWED_PHOTO_TYPES, MAX_PHOTO_BYTES } from '@/lib/profile-photo';
import { createClient } from '@/lib/supabase/server';

export type UploadImageResult =
  { status: 'success'; url: string } | { status: 'error'; message: string };

const BUCKET = 'content-images';
const ALLOWED_FOLDERS = ['projects', 'blog'] as const;

/**
 * Uploads one image to the public "content-images" bucket and returns its
 * public URL. Used by the admin panel's "Upload image" buttons (project
 * cover image, images inside rich-text content).
 *
 * Authorization is enforced by the bucket's RLS policies (admin/editor
 * only); the explicit user check below just gives a clearer error message.
 */
export async function uploadContentImage(
  formData: FormData
): Promise<UploadImageResult> {
  const file = formData.get('file');
  const folderRaw = String(formData.get('folder') ?? 'projects');
  const folder = (ALLOWED_FOLDERS as readonly string[]).includes(folderRaw)
    ? folderRaw
    : 'projects';

  if (!(file instanceof File) || file.size === 0) {
    return { status: 'error', message: 'No image was selected.' };
  }
  if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
    return {
      status: 'error',
      message: 'Image must be a JPEG, PNG, WebP, or GIF file.',
    };
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return { status: 'error', message: 'Image must be smaller than 5MB.' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { status: 'error', message: 'You must be signed in to upload.' };
  }

  // Unique name per upload so images never overwrite each other.
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${folder}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type });

  if (error) {
    console.error('[uploads] image upload failed:', error);
    return {
      status: 'error',
      message: 'Something went wrong uploading the image.',
    };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return { status: 'success', url: publicUrl };
}
