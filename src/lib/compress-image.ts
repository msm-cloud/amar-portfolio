/**
 * lib/compress-image.ts
 * ----------------------
 * Client-only: resizes/re-encodes an image file via <canvas> before
 * upload, so we're not storing unnecessarily huge photos in Supabase
 * Storage (a modern phone photo can easily be several MB at a resolution
 * far bigger than anything this site ever displays a profile photo at -
 * a 128-160px circle). Best-effort - if anything here fails (unsupported
 * API, decode error) or the "compressed" result isn't actually smaller,
 * the original file is returned unchanged rather than blocking the
 * upload entirely.
 */
export async function compressImage(
  file: File,
  {
    maxDimension = 800,
    quality = 0.85,
  }: { maxDimension?: number; quality?: number } = {}
): Promise<File> {
  // Animated GIFs would lose their animation (canvas only ever captures
  // one frame) - leave those alone entirely rather than "compressing"
  // away something the admin may have picked on purpose.
  if (file.type === 'image/gif') return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(
      1,
      maxDimension / Math.max(bitmap.width, bitmap.height)
    );
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality)
    );
    if (!blob || blob.size >= file.size) return file;

    return new File([blob], file.name.replace(/\.\w+$/, '.jpg'), {
      type: 'image/jpeg',
    });
  } catch (error) {
    console.error('[compress-image] falling back to the original file:', error);
    return file;
  }
}
