import { notFound, redirect } from 'next/navigation';
import { BlogPostForm } from '@/components/admin/BlogPostForm';
import { createClient } from '@/lib/supabase/server';

export default async function EditBlogPostPage({
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

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!post) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Edit Post</h1>
      <div className="mt-6 max-w-3xl">
        <BlogPostForm mode="edit" post={post} />
      </div>
    </div>
  );
}
