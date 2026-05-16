
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUser, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Book } from 'lucide-react';
import {
  collection,
  serverTimestamp,
  addDoc,
} from 'firebase/firestore';
import { useState } from 'react';

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Repository name must be at least 2 characters.' }),
  description: z.string().optional(),
});

export function CreateRepositoryForm() {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !firestore) return;

    setIsSubmitting(true);
    try {
      const repositoriesRef = collection(firestore, 'users', user.uid, 'repositories');
      const docRef = await addDoc(repositoriesRef, {
        ...values,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
        stars: 0,
        forks: 0,
        defaultBranch: 'main',
      });
      
      router.push(`/repo/${docRef.id}?owner=${user.uid}`);
    } catch (error) {
      console.error('Error creating repository:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Book className="h-6 w-6" /> Create a new repository
        </h1>
        <p className="mt-2 text-muted-foreground">
          A repository contains all project files, including the revision
          history.
        </p>
      </div>
      <div className="w-full rounded-lg border bg-card p-8 shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-end gap-2">
              <div className="space-y-2">
                <FormLabel>Owner</FormLabel>
                <Input
                  disabled
                  value={user?.displayName || user?.email?.split('@')[0] || 'user'}
                  className="w-32"
                />
              </div>
              <span className="mb-2 text-xl text-muted-foreground">/</span>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Repository name</FormLabel>
                    <FormControl>
                      <Input placeholder="my-awesome-project" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A short description of your project."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <hr className="border-border" />

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                {isSubmitting ? 'Creating...' : 'Create repository'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
