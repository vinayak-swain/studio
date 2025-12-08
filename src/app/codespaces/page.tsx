import { DashboardLayout } from '@/components/repository/dashboard-layout';
import { Rocket } from 'lucide-react';

export default function CodespacesPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-2xl py-8">
        <div className="mb-6">
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Rocket className="h-6 w-6" /> Codespaces
          </h1>
          <p className="mt-2 text-muted-foreground">
            Your instant development environment in the cloud.
          </p>
        </div>
        <div className="w-full rounded-lg border bg-card p-8 shadow-sm">
          <p>Codespaces page coming soon!</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
