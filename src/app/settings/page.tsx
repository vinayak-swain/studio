
'use client';

import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useFirebase, useUser } from '@/firebase';
import { Pencil, User as UserIcon } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const profileFormSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  bio: z.string().optional(),
  company: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function EditProfilePage() {
  const { user } = useUser();
  const { auth, firestore, firebaseApp } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();

  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(
    user?.photoURL || null
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.displayName || '',
      bio: '',
      company: '',
    },
  });

  React.useEffect(() => {
    if (user) {
      form.reset({
        name: user.displayName || '',
        bio: '', // Will be loaded from Firestore
        company: '', // Will be loaded from Firestore
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
    if (!auth?.currentUser || !firebaseApp || !firestore) return;

    setIsSubmitting(true);

    try {
      let photoURLToUpdate = auth.currentUser.photoURL;

      if (avatarFile) {
        const storage = getStorage(firebaseApp);
        const storageRef = ref(
          storage,
          `profile-pictures/${auth.currentUser.uid}`
        );
        await uploadBytes(storageRef, avatarFile);
        photoURLToUpdate = await getDownloadURL(storageRef);
      } else if (avatarPreview === null) {
        photoURLToUpdate = null;
      }

      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: data.name,
        photoURL: photoURLToUpdate,
      });

      // Update Firestore document
      const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
      await setDoc(userDocRef, {
        id: auth.currentUser.uid,
        displayName: data.name,
        email: auth.currentUser.email,
        bio: data.bio,
        company: data.company,
        photoURL: photoURLToUpdate,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });
      router.push('/profile');
      router.refresh();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description:
          error instanceof Error ? error.message : 'Could not update profile.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      <div>
        <h3 className="text-lg font-medium">Public profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={avatarPreview || ''}
                  alt={user?.email || 'User'}
                />
                <AvatarFallback>
                  <UserIcon className="h-10 w-10 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute -bottom-2 -right-2 h-7 w-7 rounded-full bg-background/70 backdrop-blur-sm"
                    type="button"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit profile picture</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={handleUploadClick}
                    onSelect={(e) => e.preventDefault()}
                  >
                    Upload a photo
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleRemovePhoto}
                    onSelect={(e) => e.preventDefault()}
                    className="text-destructive focus:text-destructive"
                  >
                    Remove photo
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-xs text-muted-foreground">
              Pick a photo, or remove the existing one.
            </p>
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} className="max-w-sm" />
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
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little about yourself"
                    {...field}
                    className="max-w-lg"
                  />
                </FormControl>
                <p className="mt-1 text-xs text-muted-foreground">
                  You can @mention other users and organizations to link to
                  them.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input {...field} className="max-w-sm" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Update profile'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
