'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export interface BlogFormState {
  status: 'idle' | 'error';
  message: string | null;
}

const TITLE_MAX_LENGTH = 200;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function readFields(formData: FormData) {
  return {
    title: String(formData.get('title') ?? '').trim(),
    slugInput: String(formData.get('slug') ?? '').trim(),
    excerpt: String(formData.get('excerpt') ?? '').trim(),
    coverImageUrl: String(formData.get('cover_image_url') ?? '').trim(),
    content: String(formData.get('content') ?? '').trim(),
    status:
      String(formData.get('status') ?? 'draft') === 'published'
        ? ('published' as const)
        : ('draft' as const),
  };
}

function validate(fields: ReturnType<typeof readFields>): string | null {
  if (!fields.title || fields.title.length > TITLE_MAX_LENGTH) {
    return `Title is required (max ${TITLE_MAX_LENGTH} characters).`;
  }
  // Tiptap's empty-document HTML is "<p></p>" - treat that as empty too.
  if (!fields.content || fields.content === '<p></p>') {
    return 'Content is required.';
  }
  return null;
}

/**
 * Create a blog post. Designed for React's useActionState:
 *   const [state, formAction] = useActionState(createBlogPost, { status: 'idle', message: null });
 */
export async function createBlogPost(
  _prevState: BlogFormState,
  formData: FormData
): Promise<BlogFormState> {
  const fields = readFields(formData);
  const validationError = validate(fields);
  if (validationError) {
    return { status: 'error', message: validationError };
  }

  const slug = slugify(fields.slugInput || fields.title);
  if (!slug) {
    return {
      status: 'error',
      message: 'Could not generate a valid slug from the title.',
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from('blog_posts').insert({
    title: fields.title,
    slug,
    excerpt: fields.excerpt || null,
    content: fields.content,
    cover_image_url: fields.coverImageUrl || null,
    status: fields.status,
    published_at:
      fields.status === 'published' ? new Date().toISOString() : null,
    author: user?.id ?? null,
  });

  if (error) {
    console.error('[blog] createBlogPost failed:', error);
    if (error.code === '23505') {
      return {
        status: 'error',
        message: 'That slug is already in use — please choose a different one.',
      };
    }
    return {
      status: 'error',
      message: 'Something went wrong creating the post.',
    };
  }

  revalidatePath('/admin/blog');
  revalidatePath('/blog');
  redirect('/admin/blog');
}

/**
 * Update a blog post. `id` is pre-bound by the caller:
 *   const action = updateBlogPost.bind(null, post.id);
 *   const [state, formAction] = useActionState(action, { status: 'idle', message: null });
 */
export async function updateBlogPost(
  id: string,
  _prevState: BlogFormState,
  formData: FormData
): Promise<BlogFormState> {
  const fields = readFields(formData);
  const validationError = validate(fields);
  if (validationError) {
    return { status: 'error', message: validationError };
  }

  const slug = slugify(fields.slugInput || fields.title);
  if (!slug) {
    return {
      status: 'error',
      message: 'Could not generate a valid slug from the title.',
    };
  }

  const supabase = await createClient();

  // published_at is set exactly once - the first time a post transitions
  // to 'published'. Later draft <-> published toggles never touch it
  // again, so re-publishing doesn't look like a brand new post.
  const { data: existing } = await supabase
    .from('blog_posts')
    .select('published_at')
    .eq('id', id)
    .maybeSingle();

  const publishedAt = existing?.published_at
    ? existing.published_at
    : fields.status === 'published'
      ? new Date().toISOString()
      : null;

  const { error } = await supabase
    .from('blog_posts')
    .update({
      title: fields.title,
      slug,
      excerpt: fields.excerpt || null,
      content: fields.content,
      cover_image_url: fields.coverImageUrl || null,
      status: fields.status,
      published_at: publishedAt,
    })
    .eq('id', id);

  if (error) {
    console.error('[blog] updateBlogPost failed:', error);
    if (error.code === '23505') {
      return {
        status: 'error',
        message: 'That slug is already in use — please choose a different one.',
      };
    }
    return {
      status: 'error',
      message: 'Something went wrong saving the post.',
    };
  }

  revalidatePath('/admin/blog');
  revalidatePath('/blog');
  revalidatePath(`/blog/${slug}`);
  redirect('/admin/blog');
}

/**
 * Delete a blog post. Called directly from a client component (not via a
 * <form>) - the confirm-before-delete step happens client-side first.
 */
export async function deleteBlogPost(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('blog_posts').delete().eq('id', id);

  if (error) {
    console.error('[blog] deleteBlogPost failed:', error);
    return;
  }

  revalidatePath('/admin/blog');
  revalidatePath('/blog');
}
