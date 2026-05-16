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
import { useAuth, useUser } from '@/firebase/hooks';
import {
  initiateEmailSignUp,
  initiateEmailSignIn,
} from '@/firebase';
import { useRouter } from 'next/navigation';
import { Logo } from '../icons/logo';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().optional(),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
});

type AuthFormProps = {
  isSignUp: boolean;
};

export function AuthForm({ isSignUp }: AuthFormProps) {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema.refine(
      (data) => !isSignUp || (data.name && data.name.length > 0), {
        message: 'Name is required.',
        path: ['name'],
      }
    )),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!auth) return;
    setIsLoading(true);
    try {
      if (isSignUp) {
        await initiateEmailSignUp(auth, values.email, values.password, values.name || '');
        toast({
          title: "Account created!",
          description: "Welcome to DevNest.",
        });
      } else {
        await initiateEmailSignIn(auth, values.email, values.password);
        toast({
          title: "Welcome back!",
          description: "Successfully signed in.",
        });
      }
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Authentication error:', error);
      let message = "An error occurred during authentication.";
      
      if (error.code === 'auth/wrong-password') {
        message = "Incorrect password. Please try again.";
      } else if (error.code === 'auth/user-not-found') {
        message = "No account found with this email.";
      } else if (error.code === 'auth/email-already-in-use') {
        message = "This email is already registered.";
      } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-email') {
        message = "Invalid email or password.";
      } else if (error.code === 'auth/too-many-requests') {
        message = "Too many failed attempts. Please try again later.";
      }
      
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-lg border bg-card p-8 shadow-lg">
        <div className="mb-8 flex justify-center">
          <Link href="/" className="flex items-center gap-3 text-2xl font-semibold">
            <Logo className="h-8 w-8 text-primary" />
            <span>DevNest</span>
          </Link>
        </div>
        <h2 className="mb-6 text-center text-2xl font-bold">
          {isSignUp ? 'Create an account' : 'Sign in to your account'}
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {isSignUp && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </Button>
          </form>
        </Form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isSignUp ? (
            <>
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary">
                Sign In
              </Link>
            </>
          ) : (
            <>
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-semibold text-primary">
                Sign Up
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
