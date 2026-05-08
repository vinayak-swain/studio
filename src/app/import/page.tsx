'use client';

import { DashboardLayout } from '@/components/repository/dashboard-layout';
import { ImportIcon, Info } from 'lucide-react';
import { ImportTabs } from '@/components/import/ImportTabs';
import { SessionProvider } from 'next-auth/react';
import { Card } from '@/components/ui/card';

export default function ImportRepositoryPage() {
  return (
    <SessionProvider>
      <DashboardLayout>
        <div className="container mx-auto max-w-3xl py-12 px-4">
          <div className="mb-10 text-center sm:text-left">
            <h1 className="flex items-center justify-center sm:justify-start gap-3 text-3xl font-extrabold tracking-tight">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ImportIcon className="h-7 w-7 text-primary" />
              </div>
              Import a repository
            </h1>
            <p className="mt-4 text-muted-foreground text-lg">
              Import an existing repository from GitHub, GitLab, or any Git-compatible version control system.
            </p>
          </div>

          <Card className="w-full border-border bg-card/50 backdrop-blur-sm p-6 sm:p-8 shadow-xl">
            <ImportTabs />
          </Card>

          <div className="mt-8 p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 flex items-start gap-4">
            <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-blue-400">Pro Tip</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Importing larger repositories might take a few minutes. We'll automatically run an AI audit on your code structure to give you immediate insights into complexity and stability.
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </SessionProvider>
  );
}
