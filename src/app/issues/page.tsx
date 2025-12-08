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
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarMenuBadge,
} from '@/components/ui/sidebar';
import {
  Plus,
  AlertCircle,
  Clock,
  Search,
  User,
  Smile,
  AtSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DashboardHeader } from '@/components/dashboard/header';
import { FirebaseClientProvider } from '@/firebase/client-provider';

const issuesNav = [
  { name: 'Assigned', icon: User, count: 0 },
  { name: 'Created by me', icon: Smile, count: 0 },
  { name: 'Mentioned', icon: AtSign, count: 0 },
  { name: 'Recent activity', icon: Clock, count: 0 },
];

function IssuesPageContent() {
  return (
    <div className="flex h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1 overflow-hidden">
        <SidebarProvider defaultOpen={true}>
          <Sidebar
            variant="sidebar"
            className="hidden md:flex"
          >
            <SidebarHeader>
              <Input
                className="h-9"
                placeholder="Find or create a view..."
                icon={<Search />}
              />
            </SidebarHeader>
            <SidebarContent className="p-0">
              <SidebarGroup>
                <SidebarMenu>
                  {issuesNav.map((item, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton
                        isActive={item.name === 'Assigned'}
                        className="data-[active=true]:border-l-2 data-[active=true]:border-blue-500 data-[active=true]:rounded-none"
                      >
                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center gap-2">
                            <item.icon className="h-5 w-5 text-muted-foreground" />
                            <span>{item.name}</span>
                          </div>
                          <SidebarMenuBadge>{item.count}</SidebarMenuBadge>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel className="flex items-center">
                  Views
                </SidebarGroupLabel>
                <SidebarGroupAction asChild>
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
