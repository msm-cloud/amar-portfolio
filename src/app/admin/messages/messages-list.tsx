'use client';

import { useState } from 'react';
import { markContactMessageAsRead } from '@/server/actions/contact';
import { cn } from '@/lib/utils';
import type { Database } from '@/types/database';

type ContactMessage = Database['public']['Tables']['contact_messages']['Row'];

export function MessagesList({
  messages: initialMessages,
}: {
  messages: ContactMessage[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function handleToggle(message: ContactMessage) {
    setExpandedId((current) => (current === message.id ? null : message.id));

    if (!message.is_read) {
      // Optimistic update, then fire the mutation - the DB write is
      // authorized by RLS regardless of what the client believes.
      setMessages((prev) =>
        prev.map((m) => (m.id === message.id ? { ...m, is_read: true } : m))
      );
      void markContactMessageAsRead(message.id);
    }
  }

  if (messages.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No messages yet — they&apos;ll show up here as visitors submit the
        contact form.
      </p>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-border">
      {messages.map((message) => {
        const isExpanded = expandedId === message.id;
        return (
          <li key={message.id}>
            <button
              type="button"
              onClick={() => handleToggle(message)}
              aria-expanded={isExpanded}
              className="flex w-full items-start gap-3 py-4 text-left"
            >
              <span
                aria-hidden
                className={cn(
                  'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                  message.is_read ? 'border border-border' : 'bg-primary'
                )}
              />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span
                    className={cn(
                      'text-sm text-foreground',
                      message.is_read ? 'font-normal' : 'font-semibold'
                    )}
                  >
                    {message.name}
                    <span className="text-muted-foreground">
                      {' '}
                      — {message.subject || '(no subject)'}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {new Date(message.created_at).toLocaleString()}
                  </span>
                </div>

                <div className="mt-0.5 text-xs text-muted-foreground">
                  {message.email}
                </div>

                {isExpanded && (
                  <div className="mt-3 rounded-lg bg-muted p-3 text-sm whitespace-pre-wrap text-foreground">
                    {message.message}
                  </div>
                )}
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
