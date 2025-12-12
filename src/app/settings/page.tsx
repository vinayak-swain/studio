import { DashboardLayout } from '@/components/repository/dashboard-layout';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-2xl py-8">
        <div className="mb-6">
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Settings className="h-6 w-6" /> Settings
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your account and application settings.
          </p>
        </div>
        <div className="w-full rounded-lg border bg-card p-8 shadow-sm">
          <p>Settings page content coming soon!</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
