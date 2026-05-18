import { FirebaseClientProvider } from '@/firebase/client-provider';
import { InteractiveBackground } from '@/components/interactive-background';

/**
 * @fileOverview Dashboard layout component.
 * 
 * Refactored to a Server Component to improve stability and avoid ChunkLoadErrors.
 * This is the preferred pattern for Next.js layouts that wrap client-side providers.
 */
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
