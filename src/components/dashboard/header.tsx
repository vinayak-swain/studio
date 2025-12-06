'use client';

import Link from 'next/link';
import {
  Bell,
  GitPullRequest,
  Plus,
  Menu,
  Book,
  Import,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Logo } from '../icons/logo';
import { useUser } from '@/firebase';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function DashboardHeader() {
  const { user } = useUser();
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar-4');

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Menu className="h-4 w-4" />
        </Button>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          <Logo className="h-6 w-6" />
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
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <GitPullRequest className="h-4 w-4" />
            <span className="sr-only">Pull requests</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Plus className="h-4 w-4" />
                <span className="sr-only">New</span>
              </Button>
            </DropdownMenuTrigger>
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
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={userAvatar?.imageUrl}
              alt={user?.email || 'User'}
            />
            <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
