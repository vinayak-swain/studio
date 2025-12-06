'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { repositories } from '@/lib/data';
import Link from 'next/link';

export function LeftSidebar() {
  return (
    <aside className="hidden w-64 flex-col gap-6 md:flex">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="flex flex-row items-center justify-between p-0 mb-2">
          <CardTitle className="text-sm font-semibold">Top Repositories</CardTitle>
          <Button variant="outline" size="sm" className="h-6 rounded-md bg-green-600 px-2 text-xs text-white hover:bg-green-700">
            New
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Input
            placeholder="Find a repository..."
            className="mb-4 h-8 rounded-md bg-muted"
          />
          <ul className="space-y-2">
            {repositories.map((repo) => (
              <li key={repo.name}>
                <Link href="#" className="flex items-center gap-2 text-sm hover:underline">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={repo.avatar} />
                    <AvatarFallback>{repo.owner[0]}</AvatarFallback>
                  </Avatar>
                  <span>{repo.owner}/{repo.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </aside>
  );
}
