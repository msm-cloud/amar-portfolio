import { siteConfig } from '@/config/site';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Skills } from '@/components/sections/Skills';
import { Projects } from '@/components/sections/Projects';

// Simple header/nav placeholder — just enough to keep ThemeToggle visible.
// Real navigation (nav links, mobile menu, etc.) belongs in
// src/components/layout/Header.tsx, built in a later step.
function SiteHeaderPlaceholder() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <span className="text-sm font-semibold text-foreground">
          {siteConfig.name}
        </span>
        <ThemeToggle />
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <>
      <SiteHeaderPlaceholder />
      <main className="flex flex-1 flex-col">
        <Hero />
        <About />
        <Skills />
        <Projects />
      </main>
    </>
  );
}
