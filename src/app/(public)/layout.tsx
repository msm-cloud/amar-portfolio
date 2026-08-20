import type { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

// Wraps every public-facing page (homepage, /projects/[slug], ...) with
// the site Header/Footer. Deliberately NOT the root layout — /admin/*
// lives outside this (public) route group and has its own layout, so it
// never picks up the public Header/Footer.
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
