'use client';

import { FirebaseClientProvider } from '@/firebase/client-provider';
import { DashboardHeader } from '../dashboard/header';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [isUserLoading, user, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <FirebaseClientProvider>
      <div className="min-h-screen bg-background text-foreground">
        <DashboardHeader />
        {children}
      </div>
    </FirebaseClientProvider>
  );
}
