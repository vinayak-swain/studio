
'use client';

import { DashboardLayout } from '@/components/repository/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, X } from 'lucide-react';
import Link from 'next/link';

function DiscussionsPageContent() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-3">
        <MessageSquare className="h-6 w-6" />
        <h1 className="text-xl font-semibold">Discussions</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button className="rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold text-white hover:bg-blue-700">
          Created
        </Button>
        <Button
          variant="outline"
          className="rounded-full border-gray-700 px-4 py-1 text-sm font-semibold text-gray-400 hover:border-gray-500 hover:bg-gray-800 hover:text-white"
        >
          Commented
        </Button>
      </div>

      <div className="relative mt-4">
        <Input
          placeholder="is:open"
          className="w-full rounded-md border-border bg-card py-2 pl-4 pr-10 text-sm"
          defaultValue="author:UrvashiPandey-04"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:bg-transparent"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-8 flex-grow">
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card py-24 text-center">
          <MessageSquare className="h-8 w-8 text-muted-foreground" />
          <h2 className="mt-6 text-xl font-semibold">
            No discussions match the selected filters.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Discussions are used to ask questions and have open-ended
            conversations.
          </p>
        </div>
      </div>
      <DiscussionsPageFooter />
    </div>
  );
}

function DiscussionsPageFooter() {
  return (
    <footer className="mt-16 text-center text-xs text-muted-foreground">
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
        <span>© 2025 Company name</span>
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
          Community
        </Link>
        <Link href="#" className="hover:text-blue-500 hover:underline">
          Docs
        </Link>
        <Link href="#" className="hover:text-blue-500 hover:underline">
          Contact
        </Link>
      </div>
    </footer>
  );
}


export default function DiscussionsPage() {
  return (
    <DashboardLayout>
      <div className="flex min-h-[calc(100vh-56px)] flex-col">
        <div className="flex-grow">
          <DiscussionsPageContent />
        </div>
      </div>
    </DashboardLayout>
  );
}
