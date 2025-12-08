'use client';

import * as React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  Menu,
  X,
  Home,
  Book,
  GitPullRequest,
  Box,
  MessageSquare,
  Rocket,
  Cpu,
  Compass,
  Store,
  Container,
  Search,
  Github,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { repositories } from '@/lib/data';

const primaryNav = [
  { name: 'Home', icon: Home, href: '#', current: true },
  { name: 'Issues', icon: Book, href: '#', current: false },
  { name: 'Pull requests', icon: GitPullRequest, href: '#', current: false },
  { name: 'Projects', icon: Box, href: '#', current: false },
  { name: 'Discussions', icon: MessageSquare, href: '#', current: false },
  { name: 'Codespaces', icon: Rocket, href: '#', current: false },
  { name: 'Copilot', icon: Cpu, href: '#', current: false },
];

const secondaryNav = [
  { name: 'Explore', icon: Compass, href: '#' },
  { name: 'Marketplace', icon: Store, href: '#' },
  { name: 'MCP registry', icon: Container, href: '#' },
];

export default function SidebarDemoPage() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-background px-4">
        <div className="flex items-center gap-4">
           <Github className="h-8 w-8" />
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[320px] bg-card p-0"
            closeButtonClass="hidden"
          >
            <div className="flex h-full flex-col">
              <SheetHeader className="flex flex-row items-center justify-between border-b border-border p-4">
                  <div className="flex items-center gap-3">
                    <Github className="h-8 w-8 rounded-full" />
                    <SheetTitle>
                      <span className="text-sm font-semibold">Dashboard</span>
                    </SheetTitle>
                    <SheetDescription className="sr-only">
                      A sidebar with the main navigation links for the dashboard.
                    </SheetDescription>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="h-8 w-8">
                     <X className="h-5 w-5" />
                     <span className="sr-only">Close</span>
                  </Button>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto">
                <nav className="flex flex-col gap-4 p-4">
                  <ul className="flex flex-col gap-1">
                    {primaryNav.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
                            item.current
                              ? 'bg-accent text-accent-foreground'
                              : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <Separator className="bg-border" />

                  <ul className="flex flex-col gap-1">
                    {secondaryNav.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>

                   <Separator className="bg-border" />

                   <div className="px-3">
                     <div className="flex items-center justify-between">
                        <h2 className="text-xs font-semibold uppercase text-muted-foreground">Top Repositories</h2>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                            <Search className="h-4 w-4" />
                        </Button>
                     </div>
                      <ul className="mt-2 space-y-2">
                        {repositories.slice(0,4).map((repo) => (
                          <li key={repo.name}>
                            <Link href="#" className="flex items-center gap-3 text-sm font-medium hover:underline">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={repo.avatar} />
                                    <AvatarFallback>{repo.owner.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>{repo.owner}/{repo.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                   </div>
                </nav>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
      <main className="p-8">
        <h1 className="text-2xl font-bold">Page Content</h1>
        <p className="mt-4 text-muted-foreground">
          This is the main content area. The sidebar can be toggled using the
          menu icon in the top navigation bar.
        </p>
      </main>
    </div>
  );
}

declare module '@radix-ui/react-dialog' {
  interface DialogContentProps {
    closeButtonClass?: string;
  }
}
