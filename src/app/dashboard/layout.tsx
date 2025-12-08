'use client';

import { FirebaseClientProvider } from '@/firebase/client-provider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseClientProvider>
      <div className="min-h-screen bg-background text-foreground">{children}</div>
    </FirebaseClientProvider>
  );
}
