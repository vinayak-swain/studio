import { DashboardLayout } from '@/components/repository/dashboard-layout';
import { MessageSquare } from 'lucide-react';

export default function DiscussionsPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-2xl py-8">
        <div className="mb-6">
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <MessageSquare className="h-6 w-6" /> Discussions
          </h1>
          <p className="mt-2 text-muted-foreground">
            Collaborate with your community.
          </p>
        </div>
        <div className="w-full rounded-lg border bg-card p-8 shadow-sm">
          <p>Discussions page coming soon!</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
