'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export interface ProjectFormState {
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
  const tagsRaw = String(formData.get('tags') ?? '');
  const displayOrderRaw = String(formData.get('display_order') ?? '0');

  return {
    title: String(formData.get('title') ?? '').trim(),
    slugInput: String(formData.get('slug') ?? '').trim(),
    titleBn: String(formData.get('title_bn') ?? '').trim(),
    description: String(formData.get('description') ?? '').trim(),
    descriptionBn: String(formData.get('description_bn') ?? '').trim(),
    content: String(formData.get('content') ?? '').trim(),
    category: String(formData.get('category') ?? '').trim(),
    tags: tagsRaw
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
    coverImageUrl: String(formData.get('cover_image_url') ?? '').trim(),
    projectUrl: String(formData.get('project_url') ?? '').trim(),
    githubUrl: String(formData.get('github_url') ?? '').trim(),
    isFeatured: String(formData.get('is_featured') ?? 'false') === 'true',
    displayOrder: Number(displayOrderRaw),
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
  // Tiptap's empty-document HTML is "<p></p>" - treat that as empty too
  // (same convention as blog.ts's validate()).
  if (!fields.content || fields.content === '<p></p>') {
    return 'Content is required.';
  }
  if (!Number.isFinite(fields.displayOrder)) {
    return 'Display order must be a number.';
  }
  return null;
}

/**
 * Create a project. Designed for React's useActionState:
 *   const [state, formAction] = useActionState(createProject, { status: 'idle', message: null });
 */
export async function createProject(
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
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

  const { error } = await supabase.from('projects').insert({
    title: fields.title,
    title_bn: fields.titleBn || null,
    slug,
    description: fields.description || null,
    description_bn: fields.descriptionBn || null,
    content: fields.content,
    category: fields.category || null,
    tags: fields.tags,
    cover_image_url: fields.coverImageUrl || null,
    project_url: fields.projectUrl || null,
    github_url: fields.githubUrl || null,
    is_featured: fields.isFeatured,
    display_order: fields.displayOrder,
    status: fields.status,
    created_by: user?.id ?? null,
  });

  if (error) {
    console.error('[projects] createProject failed:', error);
    if (error.code === '23505') {
      return {
        status: 'error',
        message: 'That slug is already in use — please choose a different one.',
      };
    }
    return {
      status: 'error',
      message: 'Something went wrong creating the project.',
    };
  }

  revalidatePath('/admin/projects');
  revalidatePath('/');
  redirect('/admin/projects');
}

/**
 * Update a project. `id` is pre-bound by the caller:
 *   const action = updateProject.bind(null, project.id);
 *   const [state, formAction] = useActionState(action, { status: 'idle', message: null });
 */
export async function updateProject(
  id: string,
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
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
  const { error } = await supabase
    .from('projects')
    .update({
      title: fields.title,
      title_bn: fields.titleBn || null,
      slug,
      description: fields.description || null,
      description_bn: fields.descriptionBn || null,
      content: fields.content,
      category: fields.category || null,
      tags: fields.tags,
      cover_image_url: fields.coverImageUrl || null,
      project_url: fields.projectUrl || null,
      github_url: fields.githubUrl || null,
      is_featured: fields.isFeatured,
      display_order: fields.displayOrder,
      status: fields.status,
    })
    .eq('id', id);

  if (error) {
    console.error('[projects] updateProject failed:', error);
    if (error.code === '23505') {
      return {
        status: 'error',
        message: 'That slug is already in use — please choose a different one.',
      };
    }
    return {
      status: 'error',
      message: 'Something went wrong saving the project.',
    };
  }

  revalidatePath('/admin/projects');
  revalidatePath('/');
  revalidatePath(`/projects/${slug}`);
  redirect('/admin/projects');
}

/**
 * Delete a project. Called directly from a client component (not via a
 * <form>) - the confirm-before-delete step happens client-side first.
 */
export async function deleteProject(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('projects').delete().eq('id', id);

  if (error) {
    console.error('[projects] deleteProject failed:', error);
    return;
  }

  revalidatePath('/admin/projects');
  revalidatePath('/');
}

/**
 * Move a project up or down one position in display order. Re-numbers
 * every row's `display_order` to its new index (0, 1, 2, ...) rather than
 * just swapping the two rows' existing values - a plain value-swap would
 * be a no-op whenever two rows already share the same display_order
 * (e.g. freshly created projects, which all default to 0), silently
 * failing to move anything.
 *
 * Called directly from a client component, like deleteProject above.
 */
export async function moveProject(
  id: string,
  direction: 'up' | 'down'
): Promise<void> {
  const supabase = await createClient();
  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, display_order')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error || !projects) {
    console.error('[projects] moveProject failed to load list:', error);
    return;
  }

  const index = projects.findIndex((project) => project.id === id);
  const swapIndex = direction === 'up' ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= projects.length) {
    return; // not found, or already at the top/bottom - nothing to do
  }

  const reordered = [...projects];
  [reordered[index], reordered[swapIndex]] = [
    reordered[swapIndex],
    reordered[index],
  ];

  for (const [i, project] of reordered.entries()) {
    if (project.display_order === i) continue;
    const { error: updateError } = await supabase
      .from('projects')
      .update({ display_order: i })
      .eq('id', project.id);
    if (updateError) {
      console.error('[projects] moveProject failed to update order:', updateError);
      return;
    }
  }

  revalidatePath('/admin/projects');
  revalidatePath('/');
}
