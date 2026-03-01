'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { InteractiveBackground } from '@/components/interactive-background';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, GitBranch, Users } from 'lucide-react';

export default function HeroPage() {
  return (
    <div className="relative w-full flex-col items-center justify-center bg-background">
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden">
        <InteractiveBackground />

        <header className="fixed top-0 z-20 flex h-20 w-full items-center justify-start px-6 md:px-12 lg:px-20">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold text-foreground"
          >
            <span className="font-bold">DevNest</span>
          </Link>
        </header>

        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl px-6">
          <div className="mb-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
            Introducing DevNest
          </div>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tighter text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            A cozy space for developers to collaborate and build something amazing.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-600 md:text-xl">
            Join the community where creativity meets code. Build, share, and grow together in your new digital home.
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
      <section className="w-full py-20 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Manage Repositories
                </CardTitle>
                <Code className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Organize your code with ease and maintain full control.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Collaborate
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Work together with your team seamlessly in a focused environment.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Deploy</CardTitle>
                <GitBranch className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Ship your projects with confidence using integrated tools.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="w-full py-20 lg:py-32 bg-muted">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Ready to Build Something Amazing?
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Sign up today and start collaborating in the coziest corner of the web.
          </p>
          <div className="mt-8">
            <Button size="lg" className="rounded-full" asChild>
              <Link href="/signup">Sign Up Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
