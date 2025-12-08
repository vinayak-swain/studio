'use client';

import * as React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarMenuBadge,
} from '@/components/ui/sidebar';
import {
  Book,
  Plus,
  AlertCircle,
  Archive,
  ArrowRightLeft,
  CheckCircle,
  ChevronsLeft,
  Clock,
  Copy,
  Dot,
  File,
  GitCommit,
  GitPullRequest,
  Heart,
  Home,
  Laptop,
  MessageCircle,
  MoreVertical,
  Search,
  Star,
  Tag,
  Users,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DashboardHeader } from '@/components/dashboard/header';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { FirebaseClientProvider } from '@/firebase/client-provider';

const issuesNav = [
  { name: 'Assigned', icon: CheckCircle, count: 0 },
  { name: 'Created', icon: Edit, count: 0 },
  { name: 'Mentioned', icon: MessageCircle, count: 0 },
  { name: 'Review requests', icon: ArrowRightLeft, count: 0 },
  { name: 'Recent activity', icon: Clock, count: 0 },
];

function IssuesPageContent() {
  const isMobile = useIsMobile();
  return (
    <div className="flex h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1 overflow-hidden">
        <SidebarProvider>
          <Sidebar
            collapsible="icon"
            variant="sidebar"
            className="hidden md:flex"
          >
            <SidebarContent className="p-0">
              <SidebarGroup>
                <SidebarGroupLabel className="flex items-center">
                  <Book className="mr-2" />
                  Issues
                </SidebarGroupLabel>
                <SidebarMenu>
                  {issuesNav.map((item, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton
                        isActive={item.name === 'Assigned'}
                        tooltip={{
                          children: item.name,
                        }}
                      >
                        <item.icon />
                        <span>{item.name}</span>
                        <SidebarMenuBadge>{item.count}</SidebarMenuBadge>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel className="flex items-center">
                  Views
                </SidebarGroupLabel>
                <SidebarGroupAction>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Plus />
                  </Button>
                </SidebarGroupAction>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          <SidebarInset className="max-w-full">
            <div className="p-4 md:p-8">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Assigned</h1>
                <Button className="bg-green-600 text-white hover:bg-green-700">
                  New issue
                </Button>
              </div>

              <div className="mt-4 rounded-lg border">
                <div className="flex items-center justify-between border-b p-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold">0 Results</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      Updated <Dot />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <AlertCircle className="h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">
                    No results matched your search.
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You can try searching for something else.
                  </p>
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
}

export default function IssuesPage() {
  return (
    <FirebaseClientProvider>
      <IssuesPageContent />
    </FirebaseClientProvider>
  );
}


function Edit(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}