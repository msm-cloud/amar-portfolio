'use client';

import Image from 'next/image';
import { User } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { GlassCard } from '@/components/ui/GlassCard';
import { useHasMounted } from '@/hooks/useHasMounted';
import { getInitials } from '@/lib/utils';

function greetingFor(hour: number): string {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function AdminWelcomeCard({
  displayName,
  role,
  photoUrl,
}: {
  displayName: string;
  role: string;
  photoUrl: string | null;
}) {
  // A server-rendered greeting would use the server's clock, not the
  // admin's actual local time (Vercel functions typically run in UTC) -
  // "Welcome back" renders first (matches on both server and client, no
  // hydration mismatch), then swaps to the time-of-day greeting once
  // mounted and the browser's own clock is available. Reads the clock
  // directly during render (gated on useHasMounted) rather than via
  // useEffect + setState - see that hook's own comment on why.
  const hasMounted = useHasMounted();
  const greeting = hasMounted
    ? greetingFor(new Date().getHours())
    : 'Welcome back';

  return (
    <GlassCard className="flex items-center gap-4">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-muted">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt=""
            fill
            sizes="4rem"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 via-accent/10 to-transparent text-lg font-semibold text-primary">
            {displayName.trim() ? (
              getInitials(displayName)
            ) : (
              <User className="h-6 w-6" aria-hidden />
            )}
          </div>
        )}
      </div>

      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{greeting},</p>
        <div className="mt-0.5 flex flex-wrap items-center gap-2">
          <h1 className="truncate text-xl font-semibold text-foreground">
            {displayName}
          </h1>
          <Badge className="capitalize">{role}</Badge>
        </div>
      </div>
    </GlassCard>
  );
}
