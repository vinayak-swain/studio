'use client';

import * as React from 'react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { useAuth, useUser } from '@/firebase';
import { popularRepositories, contributionData } from '@/lib/data';
import Link from 'next/link';
import { ContributionGraph } from '@/components/profile/contribution-graph';
import { MoreVertical, Pencil, User as UserIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { updateProfile } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeFirebase } from '@/firebase';

const profileFormSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  bio: z.string().optional(),
  pronouns: z.string().optional(),
  company: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().or(z.literal('')).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

function EditProfilePageContent() {
  const { user } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(
    user?.photoURL || null
  );
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.displayName || '',
      bio: 'Building the future of code collaboration.',
      pronouns: '',
      company: '',
      location: '',
      website: '',
    },
  });

  React.useEffect(() => {
    if (user) {
      form.reset({
        name: user.displayName || '',
        bio: 'Building the future of code collaboration.',
        pronouns: '',
        company: '',
        location: '',
        website: '',
      });
      setAvatarPreview(user.photoURL || null);
    }
  }, [user, form]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleRemovePhoto = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  async function onSubmit(data: ProfileFormValues) {
    if (!auth?.currentUser) return;

    try {
      let photoURL = auth.currentUser.photoURL;

      if (avatarFile) {
        const { firebaseApp } = initializeFirebase();
        const storage = getStorage(firebaseApp);
        const storageRef = ref(storage, `profile-pictures/${auth.currentUser.uid}`);
        await uploadBytes(storageRef, avatarFile);
        photoURL = await getDownloadURL(storageRef);
      } else if (avatarPreview === null) {
        photoURL = null;
      }

      await updateProfile(auth.currentUser, {
        displayName: data.name,
        photoURL: photoURL,
      });

      // In a real app, you would also update the bio in Firestore.
      // e.g., await updateDoc(doc(firestore, 'users', user.uid), { bio: data.bio });

      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });
      router.push('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
    }
  }


  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left Column: Edit Form */}
        <aside className="col-span-1">
          <div className="flex flex-col items-center md:items-start">
            <div className="relative">
              <Avatar className="h-48 w-48 md:h-64 md:w-64">
                <AvatarImage
                  src={avatarPreview || ''}
                  alt={user?.email || 'User'}
                />
                <AvatarFallback>
                  <UserIcon className="h-24 w-24 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute bottom-4 right-4 h-10 w-10 rounded-full bg-background/70 backdrop-blur-sm"
                  >
                    <MoreVertical className="h-5 w-5" />
                    <span className="sr-only">Edit profile picture</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleUploadClick}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Upload a photo
                  </DropdownMenuItem>
                   <DropdownMenuItem onClick={handleUploadClick}>
                    Change photo
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleRemovePhoto}
                    className="text-destructive"
                  >
                    Remove photo
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 w-full space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                <FormItem>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us a little about yourself"
                    {...field}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    You can @mention other users and organizations to link to
                    them.
                  </p>
                  <FormMessage />
                </FormItem>
                )}
              />
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
                <Button type="submit" className="bg-green-600 text-white hover:bg-green-700">
                  Save
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/profile">Cancel</Link>
                </Button>
              </div>
            </form>
            </Form>
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
                  {contributionData.totalContributions} contributions in the
                  last year
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
