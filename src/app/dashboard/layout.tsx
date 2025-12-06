import { FirebaseClientProvider } from '@/firebase/client-provider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body>
        <FirebaseClientProvider>
          <div className="min-h-screen bg-[#0d1117] text-white">{children}</div>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
