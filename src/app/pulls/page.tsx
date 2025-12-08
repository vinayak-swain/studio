'use client';

import { DashboardLayout } from '@/components/repository/dashboard-layout';
import { Button } from '@/components/ui/button';
import {
  GitPullRequest,
  CheckCircle2,
  ChevronDown,
  Loader,
  Lightbulb,
} from 'lucide-react';
import Link from 'next/link';

function PullsPageContent() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-4">
        <h1 className="text-xl font-semibold">Pull Requests</h1>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button className="rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold text-white hover:bg-blue-700">
              Created
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-gray-700 px-4 py-1 text-sm font-semibold text-gray-400 hover:border-gray-500 hover:bg-gray-800 hover:text-white"
            >
              Assigned
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-gray-700 px-4 py-1 text-sm font-semibold text-gray-400 hover:border-gray-500 hover:bg-gray-800 hover:text-white"
            >
              Mentioned
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-gray-700 px-4 py-1 text-sm font-semibold text-gray-400 hover:border-gray-500 hover:bg-gray-800 hover:text-white"
            >
              Review requests
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-border">
          <div className="flex items-center justify-between border-b border-border p-3">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1 font-medium">
                <GitPullRequest className="h-4 w-4" />0 Open
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" />0 Closed
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <Button
                variant="ghost"
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
              >
                Visibility <ChevronDown className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
              >
                Organization <ChevronDown className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
              >
                Sort <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="border-b border-border p-3">
            <input
              type="text"
              placeholder="is:open is:pr author:@me archived:false "
              className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm placeholder-muted-foreground"
            />
          </div>

          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
            <h2 className="mt-6 text-xl font-semibold">
              No results matched your search.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You could try refining your search query, or{' '}
              <Link href="#" className="text-blue-500 hover:underline">
                advanced search
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
      <PullsPageFooter />
    </div>
  );
}

function PullsPageFooter() {
  return (
    <footer className="mt-16 text-center text-xs text-muted-foreground">
      <p className="mb-4 flex items-center justify-center gap-2">
        <Lightbulb className="h-4 w-4 text-yellow-400" />
        <span className="font-semibold">ProTip!</span> The pull request screen
        is waiting for you.
      </p>
      <div className="flex justify-center gap-4">
        <Link href="#" className="hover:text-blue-500 hover:underline">
          Terms
        </Link>
        <Link href="#" className="hover:text-blue-500 hover:underline">
          Privacy
        </Link>
        <Link href="#" className="hover:text-blue-500 hover:underline">
          Security
        </Link>
        <Link href="#" className="hover:text-blue-500 hover:underline">
          Status
        </Link>
        <Link href="#" className="hover:text-blue-500 hover:underline">
          Docs
        </Link>
        <span>© 2024 CodeHub, Inc.</span>
        <Link href="#" className="hover:text-blue-500 hover:underline">
          Contact
        </Link>
      </div>
    </footer>
  );
}

export default function PullsPage() {
  return (
    <DashboardLayout>
      <PullsPageContent />
    </DashboardLayout>
  );
}
