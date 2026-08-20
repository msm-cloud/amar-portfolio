import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Pencil, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { buttonVariants } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/server';
import { DeletePostButton } from './delete-post-button';

export default async function AdminBlogListPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defense in depth - see the same note in admin/dashboard/page.tsx.
  if (!user) {
    redirect('/admin/login');
  }

  // No status filter here (unlike the public /blog page) - RLS's
  // blog_posts_select_admin_editor policy already lets any admin/editor
  // session see drafts too, which is the whole point of this list.
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, status, updated_at')
    .order('updated_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Blog</h1>
        <Link
          href="/admin/blog/new"
          className={buttonVariants({ variant: 'primary', size: 'sm' })}
        >
          <Plus className="mr-1.5 h-4 w-4" aria-hidden />
          New Post
        </Link>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">
          Failed to load posts. Please refresh and try again.
        </p>
      )}

      {!error && (posts?.length ?? 0) === 0 && (
        <p className="mt-6 text-sm text-muted-foreground">
          No posts yet — click &quot;New Post&quot; to write the first one.
        </p>
      )}

      {!error && (posts?.length ?? 0) > 0 && (
        <ul className="mt-6 flex flex-col divide-y divide-border">
          {posts!.map((post) => (
            <li
              key={post.id}
              className="flex items-center justify-between gap-4 py-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium text-foreground">
                    {post.title}
                  </span>
                  <Badge
                    className={
                      post.status === 'published'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }
                  >
                    {post.status === 'published' ? 'Published' : 'Draft'}
                  </Badge>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Updated {new Date(post.updated_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/admin/blog/${post.id}/edit`}
                  className={buttonVariants({
                    variant: 'outline',
                    size: 'sm',
                  })}
                >
                  <Pencil className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                  Edit
                </Link>
                <DeletePostButton id={post.id} title={post.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
