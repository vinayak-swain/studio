'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getAuth, signOut } from 'firebase/auth';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [isUserLoading, user, router]);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      router.push('/');
    });
  };

  if (isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null; // or a redirect component
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Welcome to your Dashboard</h1>
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </header>
        <div className="rounded-lg border bg-card p-6 text-center">
          <p className="text-lg">You are signed in as {user.email}</p>
        </div>
      </div>
    </div>
  );
}
