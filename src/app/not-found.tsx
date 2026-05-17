
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons/logo';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="mb-8">
        <Logo className="h-12 w-12 text-primary mx-auto" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground">404</h1>
      <h2 className="mt-4 text-2xl font-bold text-foreground">Page not found</h2>
      <p className="mt-6 text-lg text-muted-foreground max-w-md">
        Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
      </p>
      <div className="mt-10">
        <Button asChild size="lg" className="rounded-full px-8">
          <Link href="/dashboard">Go back home</Link>
        </Button>
      </div>
    </div>
  );
}
