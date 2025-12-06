'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/header';
import { LeftSidebar } from '@/components/dashboard/left-sidebar';
import { RightSidebar } from '@/components/dashboard/right-sidebar';
import { Feed } from '@/components/dashboard/feed';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sparkles, Milestone, GitPullRequest } from 'lucide-react';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [isUserLoading, user, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <div className="container mx-auto flex gap-8 px-4 py-8">
          <LeftSidebar />
          <main className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">Home</h1>
              <a href="#" className="text-xs text-blue-600 hover:underline">
                Try the new dashboard experience
              </a>
            </div>
            <Card>
              <CardContent className="p-4">
                <Input
                  placeholder="Ask anything"
                  className="border-none bg-transparent placeholder-muted-foreground focus:ring-0"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Add repositories, files, and spaces
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Milestone className="mr-2 h-4 w-4" />
                    Task (New)
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <GitPullRequest className="mr-2 h-4 w-4" />
                    Create issue
                  </Button>
                   <Button variant="default" size="sm" className="rounded-full bg-blue-500 text-white hover:bg-blue-600">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Spark
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Feed />
          </main>
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
