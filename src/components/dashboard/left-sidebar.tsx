import Link from 'next/link';
import { repositories } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Badge } from '../ui/badge';

export function LeftSidebar() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">
          Top Repositories
        </h2>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          New
        </Button>
      </div>
      <div>
        <Input type="search" placeholder="Find a repository..." />
      </div>
      <div className="flex flex-col gap-2">
        {repositories.map((repo) => (
          <Link
            href="#"
            key={repo.id}
            className="flex items-center gap-3 rounded-md p-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={repo.avatarUrl}
                alt={`${repo.owner} avatar`}
                data-ai-hint="tech logo"
              />
              <AvatarFallback>
                {repo.owner.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span>
              {repo.owner}/<span className="font-semibold text-foreground">{repo.name}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
