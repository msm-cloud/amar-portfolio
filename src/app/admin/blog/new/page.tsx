import { redirect } from 'next/navigation';
import { BlogPostForm } from '@/components/admin/BlogPostForm';
import { createClient } from '@/lib/supabase/server';

export default async function NewBlogPostPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defense in depth - see the same note in admin/dashboard/page.tsx.
  // Both 'admin' and 'editor' roles reach this page fine: the form itself
  // has no role-specific UI, and the actual write is authorized by RLS
  // (blog_posts_write_admin_editor), not by anything checked here.
  if (!user) {
    redirect('/admin/login');
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">New Post</h1>
      <div className="mt-6 max-w-3xl">
        <BlogPostForm mode="create" />
      </div>
    </div>
  );
}
