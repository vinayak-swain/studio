'use client';

import Link from 'next/link';
import {
  Bell,
  GitPullRequest,
  Plus,
  Menu,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Logo } from '../icons/logo';
import { useUser } from '@/firebase';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function DashboardHeader() {
  const { user } = useUser();
  const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar-4');

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b border-[#30363d] bg-[#161b22] px-4 lg:px-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Menu className="h-4 w-4" />
        </Button>
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Logo className="h-6 w-6" />
        </Link>
      </div>

      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Input
              type="search"
              placeholder="Type / to search"
              className="w-full rounded-lg border-[#30363d] bg-[#0d1117] pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
            <GitPullRequest className="h-4 w-4" />
            <span className="sr-only">Pull requests</span>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
            <Plus className="h-4 w-4" />
            <span className="sr-only">New</span>
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarImage src={userAvatar?.imageUrl} alt={user?.email || 'User'} />
            <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
