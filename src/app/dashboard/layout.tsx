'use client';

import { FirebaseClientProvider } from '@/firebase/client-provider';
import { InteractiveBackground } from '@/components/interactive-background';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseClientProvider>
      <div className="relative min-h-screen bg-background text-foreground">
        <InteractiveBackground />
        <div className="relative z-10">{children}</div>
      </div>
    </FirebaseClientProvider>
  );
}
