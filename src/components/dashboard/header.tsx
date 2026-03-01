'use client';

import Link from 'next/link';
import {
  Bell,
  GitPullRequest,
  Plus,
  Menu,
  Book,
  Import,
  X,
  Home,
  Box,
  MessageSquare,
  Rocket,
  Cpu,
  Compass,
  Store,
  Container,
  Search,
  Github,
  User as UserIcon,
  Star,
  Settings,
  LogOut,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Logo } from '../icons/logo';
import { useAuth, useUser } from '@/firebase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';
import { repositories } from '@/lib/data';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const primaryNav = [
  { name: 'Home', icon: Home, href: '/dashboard', current: true },
  { name: 'Issues', icon: Book, href: '/issues', current: false },
  {
    name: 'Pull requests',
    icon: GitPullRequest,
    href: '/pulls',
    current: false,
  },
  { name: 'Projects', icon: Box, href: '/projects', current: false },
  {
    name: 'Discussions',
    icon: MessageSquare,
    href: '/discussions',
    current: false,
  },
  { name: 'Codespaces', icon: Rocket, href: '/codespaces', current: false },
  { name: 'Copilot', icon: Cpu, href: '#', current: false },
];

const secondaryNav = [
  { name: 'Explore', icon: Compass, href: '/explore' },
  { name: 'Marketplace', icon: Store, href: '/marketplace' },
  { name: 'MCP registry', icon: Container, href: '/mcp-registry' },
];

export function DashboardHeader() {
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const signOut = () => {
    if (auth) {
      firebaseSignOut(auth);
      router.push('/login');
    }
  };

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <div className="flex items-center gap-2">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Menu className="h-4 w-4" />
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
                  <Logo className="h-8 w-8 text-primary" />
                  <SheetTitle>
                    <span className="text-sm font-semibold">DevNest</span>
                  </SheetTitle>
                  <SheetDescription className="sr-only">
                    A sidebar with the main navigation links for the dashboard.
                  </SheetDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  className="h-8 w-8"
                >
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
                      <h2 className="text-xs font-semibold uppercase text-muted-foreground">
                        Top Repositories
                      </h2>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                    <ul className="mt-2 space-y-2">
                      {repositories.slice(0, 4).map((repo) => (
                        <li key={repo.name}>
                          <Link
                            href="#"
                            className="flex items-center gap-3 text-sm font-medium hover:underline"
                          >
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={repo.avatar} />
                              <AvatarFallback>
                                {repo.owner.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span>
                              {repo.owner}/{repo.name}
                            </span>
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
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          <Logo className="h-6 w-6" />
          <span className="hidden md:inline-block">DevNest</span>
        </Link>
      </div>

      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Input
              type="search"
              placeholder="Type / to search"
              className="w-full rounded-lg bg-muted pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </div>
        <TooltipProvider>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                >
                  <Bell className="h-4 w-4" />
                  <span className="sr-only">Toggle notifications</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">New</span>
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Create new...</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/new">
                    <Book className="mr-2 h-4 w-4" />
                    New repository
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/import">
                    <Import className="mr-2 h-4 w-4" />
                    Import repository
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                >
                  <Link href="/pulls">
                    <GitPullRequest className="h-4 w-4" />
                    <span className="sr-only">Pull requests</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Pull requests</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                >
                  <Link href="/issues">
                    <Book className="h-4 w-4" />
                    <span className="sr-only">Issues</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Issues</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage
                    src={user?.photoURL || ''}
                    alt={user?.email || 'User'}
                  />
                  <AvatarFallback>
                    <UserIcon className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Signed in as
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Your profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Book className="mr-2 h-4 w-4" />
                  <span>Your repositories</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Star className="mr-2 h-4 w-4" />
                  <span>Your stars</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TooltipProvider>
      </div>
    </header>
  );
}
