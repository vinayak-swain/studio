import { DashboardLayout } from '@/components/repository/dashboard-layout';
import { GitPullRequest } from 'lucide-react';

export default function PullsPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-2xl py-8">
        <div className="mb-6">
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <GitPullRequest className="h-6 w-6" /> Pull Requests
          </h1>
          <p className="mt-2 text-muted-foreground">
            Review and merge code changes.
          </p>
        </div>
        <div className="w-full rounded-lg border bg-card p-8 shadow-sm">
          <p>Pull Requests page coming soon!</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
