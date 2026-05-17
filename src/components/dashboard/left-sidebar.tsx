'use client';
import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import {
  useUser,
  useFirestore,
  useCollection,
  useMemoFirebase,
} from '@/firebase/hooks';
import { collection, query, orderBy, DocumentData } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';

interface Repository {
  id: string;
  name: string;
  ownerId: string;
}

const RepoListItem = React.memo(({ repo, userDisplayName }: { repo: Repository, userDisplayName: string }) => (
  <li key={repo.id}>
    <Link
      href={`/repo/${repo.id}?owner=${repo.ownerId}`}
      className="flex items-center gap-2 text-sm hover:underline"
    >
      <Avatar className="h-5 w-5">
        <AvatarFallback className="text-[10px]">
          {userDisplayName[0] || 'U'}
        </AvatarFallback>
      </Avatar>
      <span className="truncate">
        {userDisplayName}/{repo.name}
      </span>
    </Link>
  </li>
));
RepoListItem.displayName = 'RepoListItem';

export function LeftSidebar() {
  const { user } = useUser();
  const firestore = useFirestore();

  const reposQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    const reposRef = collection(firestore, 'users', user.uid, 'repositories');
    return query(reposRef, orderBy('createdAt', 'desc'));
  }, [user?.uid, firestore]);

  const { data: repositories, isLoading } = useCollection<Repository>(reposQuery);

  const userDisplayName = useMemo(() => {
    if (!user) return '';
    return user.displayName || user.email?.split('@')[0] || 'user';
  }, [user]);

  const renderedRepos = useMemo(() => {
    return repositories?.map((repo) => (
      <RepoListItem key={repo.id} repo={repo} userDisplayName={userDisplayName} />
    ));
  }, [repositories, userDisplayName]);

  return (
    <aside className="hidden w-64 flex-col gap-6 md:flex">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="flex flex-row items-center justify-between p-0 mb-2">
          <CardTitle className="text-sm font-semibold">Top Repositories</CardTitle>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-6 rounded-md bg-green-600 px-2 text-xs text-white hover:bg-green-700"
          >
            <Link href="/new">New</Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Input
            placeholder="Find a repository..."
            className="mb-4 h-8 rounded-md bg-muted"
          />
          {isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5" />
            </div>
          )}
          <ul className="space-y-2">
            {renderedRepos}
          </ul>
        </CardContent>
      </Card>
    </aside>
  );
}
