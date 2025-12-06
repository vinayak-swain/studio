'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { InteractiveBackground } from '@/components/interactive-background';

export default function HeroPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
      <InteractiveBackground />

      <header className="fixed top-0 z-20 flex h-20 w-full items-center justify-start px-6 md:px-12 lg:px-20">
        <Link
          href="#"
          className="flex items-center gap-2 text-lg font-semibold text-foreground"
        >
          <span className="font-bold">CodeHub</span>
        </Link>
      </header>

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl px-6">
        <div className="mb-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
          Introducing CodeHub
        </div>
        <h1 className="text-6xl font-extrabold leading-tight tracking-tighter text-foreground sm:text-7xl md:text-8xl">
          A New Force in UI
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-gray-600 md:text-xl">
          Experience a revolutionary particle-based interface that defies
          convention and brings your projects to life.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="rounded-full bg-blue-600 px-8 py-6 text-lg font-bold text-white shadow-lg shadow-blue-500/20 transition-transform duration-300 hover:-translate-y-1"
            asChild
          >
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="rounded-full px-8 py-6 text-lg font-bold text-gray-600 transition-colors duration-300 hover:text-gray-900"
            asChild
          >
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
