import { siteConfig } from '@/config/site';

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {siteConfig.name}
      </h1>
      <p className="max-w-md text-base text-zinc-600 dark:text-zinc-400">
        {siteConfig.description} Content coming soon.
      </p>
    </main>
  );
}
