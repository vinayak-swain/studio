
'use client';

import { DashboardLayout } from '@/components/repository/dashboard-layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/firebase';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { popularRepositories, contributionData } from '@/lib/data';
import Link from 'next/link';
import { ContributionGraph } from '@/components/profile/contribution-graph';

function ProfilePageContent() {
  const { user } = useUser();
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar-4');
  const profileTabs = ['Overview', 'Repositories', 'Projects', 'Packages', 'Stars'];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        {/* Left Sidebar */}
        <aside className="col-span-1">
          <div className="flex flex-col items-center md:items-start">
            <Avatar className="h-48 w-48 md:h-64 md:w-64">
              <AvatarImage src={userAvatar?.imageUrl} alt={user?.email || 'User'} />
              <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="mt-4 text-center md:text-left">
              <h1 className="text-2xl font-bold">{user?.displayName || user?.email?.split('@')[0]}</h1>
              <p className="text-lg text-muted-foreground">{user?.email}</p>
              <p className="mt-2 text-sm">Building the future of code collaboration.</p>
              <Button variant="outline" className="mt-4 w-full" asChild>
                <Link href="/profile/edit">Edit profile</Link>
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="col-span-3">
          <div className="border-b border-border">
            <nav className="-mb-px flex space-x-6">
              {profileTabs.map((tab, index) => (
                <Link
                  key={tab}
                  href="#"
                  className={`whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium ${
                    index === 0
                      ? 'border-primary text-foreground'
                      : 'border-transparent text-muted-foreground hover:border-gray-500 hover:text-foreground'
                  }`}
                >
                  {tab}
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Popular repositories</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {popularRepositories.map((repo) => (
                  <div key={repo.name} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <Link href="#" className="font-semibold text-blue-500 hover:underline">
                        {repo.name}
                      </Link>
                      <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                        Public
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{repo.description}</p>
                    <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <span className={`h-3 w-3 rounded-full ${repo.languageColor}`}></span>
                      <span>{repo.language}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold">
                  {contributionData.totalContributions} contributions in the last year
                </CardTitle>
                <Button variant="outline" size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                  2025
                </Button>
              </CardHeader>
              <CardContent>
                <ContributionGraph contributionDays={contributionData.contributionDays} />
              </CardContent>
            </Card>

            <div>
              <h2 className="text-base font-semibold">Contribution activity</h2>
              <div className="mt-4 rounded-lg border p-6">
                <p className="text-sm font-medium">December 2025</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Created 2 repositories
                </p>
                <div className="mt-4 border-t border-border pt-4">
                   <Button variant="outline" className="w-full">Show more activity</Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <ProfilePageContent />
    </DashboardLayout>
  );
}
