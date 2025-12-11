'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/firebase';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { popularRepositories, contributionData } from '@/lib/data';
import Link from 'next/link';
import { ContributionGraph } from '@/components/profile/contribution-graph';
import { Pencil } from 'lucide-react';

function EditProfilePageContent() {
  const { user } = useUser();
  const userAvatar = PlaceHolderImages.find(
    (img) => img.id === 'user-avatar-4'
  );

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left Column: Edit Form */}
        <aside className="col-span-1">
          <div className="flex flex-col items-center md:items-start">
            <div className="relative group">
              <Avatar className="h-48 w-48 md:h-64 md:w-64">
                <AvatarImage
                  src={userAvatar?.imageUrl}
                  alt={user?.email || 'User'}
                />
                <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
              </Avatar>
               <Button
                variant="outline"
                size="icon"
                className="absolute bottom-4 right-4 h-10 w-10 rounded-full bg-background/70 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
              >
                <Pencil className="h-5 w-5" />
                <span className="sr-only">Edit profile picture</span>
              </Button>
            </div>
            <form className="mt-4 w-full space-y-6">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue={user?.displayName || ''} />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us a little about yourself"
                  defaultValue="Building the future of code collaboration."
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  You can @mention other users and organizations to link to them.
                </p>
              </div>
               <div>
                <Label htmlFor="pronouns">Pronouns</Label>
                <Select>
                  <SelectTrigger id="pronouns">
                    <SelectValue placeholder="Don't specify" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="they/them">they/them</SelectItem>
                    <SelectItem value="she/her">she/her</SelectItem>
                    <SelectItem value="he/him">he/him</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input id="company" />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input id="website" type="url" />
              </div>

               <div className="flex items-center space-x-2">
                <Checkbox id="display-time" />
                <Label htmlFor="display-time" className="text-sm font-normal">
                  Display current local time
                </Label>
              </div>

              <div>
                <h3 className="text-sm font-semibold">Social accounts</h3>
                <div className="mt-2 space-y-2">
                    <Input placeholder="Link to social profile" />
                    <Input placeholder="Link to social profile" />
                    <Input placeholder="Link to social profile" />
                    <Input placeholder="Link to social profile" />
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="bg-green-600 text-white hover:bg-green-700">Save</Button>
                <Button variant="outline" asChild>
                    <Link href="/profile">Cancel</Link>
                </Button>
              </div>
            </form>
          </div>
        </aside>

        {/* Right Column: Activity */}
        <main className="col-span-2 mt-10 md:mt-0">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">
                  Popular repositories
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {popularRepositories.map((repo) => (
                  <div key={repo.name} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <Link
                        href="#"
                        className="font-semibold text-blue-500 hover:underline"
                      >
                        {repo.name}
                      </Link>
                      <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                        Public
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {repo.description}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <span
                        className={`h-3 w-3 rounded-full ${repo.languageColor}`}
                      ></span>
                      <span>{repo.language}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold">
                  {contributionData.totalContributions} contributions in the last
                  year
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  2025
                </Button>
              </CardHeader>
              <CardContent>
                <ContributionGraph
                  contributionDays={contributionData.contributionDays}
                />
              </CardContent>
            </Card>

            <div>
              <h2 className="text-base font-semibold">
                Contribution activity
              </h2>
              <div className="mt-4 rounded-lg border p-6">
                <p className="text-sm font-medium">December 2025</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Created 2 repositories
                </p>
                <div className="mt-4 border-t border-border pt-4">
                  <Button variant="outline" className="w-full">
                    Show more activity
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function EditProfilePage() {
    return <EditProfilePageContent />;
}
