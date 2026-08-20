import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { MessagesList } from './messages-list';

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defense in depth - see the same note in admin/dashboard/page.tsx.
  if (!user) {
    redirect('/admin/login');
  }

  const { data: messages, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  const count = messages?.length ?? 0;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Messages</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {count} message{count === 1 ? '' : 's'}
      </p>

      {error && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">
          Failed to load messages. Please refresh and try again.
        </p>
      )}

      <div className="mt-6">
        <MessagesList messages={messages ?? []} />
      </div>
    </div>
  );
}
