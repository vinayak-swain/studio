import { DashboardLayout } from '@/components/repository/dashboard-layout';
import { ImportIcon } from 'lucide-react';

export default function ImportRepositoryPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-2xl py-8">
        <div className="mb-6">
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <ImportIcon className="h-6 w-6" /> Import a repository
          </h1>
          <p className="mt-2 text-muted-foreground">
            Import an existing repository from another version control system.
          </p>
        </div>
        <div className="w-full rounded-lg border bg-card p-8 shadow-sm">
          <p>Import functionality coming soon!</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
