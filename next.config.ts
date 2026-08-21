import type { NextConfig } from 'next';

// Profile photos (site_settings.profile_photo_url) are uploaded to a
// public Supabase Storage bucket, a real external host - next/image
// refuses to optimize an external image unless its host is explicitly
// allow-listed here. Derived from the same env var the Supabase clients
// already use, rather than hardcoding one project's hostname, so this
// keeps working if the project is ever migrated to a different Supabase
// project/URL.
const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: 'https',
            hostname: supabaseHostname,
            pathname: '/storage/v1/object/public/**',
          },
        ]
      : [],
  },
  // Server Actions cap request bodies at 1MB by default - too small for
  // the Settings form's profile photo upload (server/actions/settings.ts
  // already rejects anything over 5MB on its own terms, via
  // MAX_PHOTO_BYTES in lib/profile-photo.ts; this just lets a
  // within-limit photo's request body actually reach that check instead
  // of being rejected earlier by Next.js itself).
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
};

export default nextConfig;
