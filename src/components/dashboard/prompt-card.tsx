'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getHelpfulHints } from '@/ai/flows/helpful-hints-for-repository-setup';
import { suggestRepositories } from '@/ai/flows/repository-suggestions';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { WandSparkles, Loader2, GitBranch, File, Box } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const formSchema = z.object({
  prompt: z.string().min(10, {
    message: 'Please enter at least 10 characters.',
  }),
});

type SuggestionResult = {
  type: 'repo' | 'hint';
  data: any[];
};

export function PromptCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SuggestionResult | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const promptText = values.prompt.toLowerCase();
      if (promptText.includes('repo') || promptText.includes('project')) {
        const suggestions = await suggestRepositories({ description: values.prompt });
        setResult({ type: 'repo', data: suggestions });
      } else {
        const hints = await getHelpfulHints({ repositoryDescription: values.prompt });
        setResult({ type: 'hint', data: [hints] }); // Wrap in array for consistent mapping
      }
    } catch (error) {
      console.error('AI action failed:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not get suggestions from AI. Please try again.',
      });
    }
    setIsLoading(false);
  }

  return (
    <Card className="border-border/60 bg-card/50 transition-colors hover:border-primary/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <WandSparkles className="h-5 w-5 text-primary" />
          Ask anything
        </CardTitle>
        <CardDescription>
          Add repositories, files, and spaces with an AI-powered prompt.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'Suggest some popular repositories for React state management' or 'What files should I add to a new Python web server project?'"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <WandSparkles className="mr-2 h-4 w-4" />
              )}
              Generate
            </Button>
          </CardFooter>
        </form>
      </Form>
      {result && (
        <CardContent>
          {result.type === 'repo' && (
            <Alert>
              <GitBranch className="h-4 w-4" />
              <AlertTitle>Repository Suggestions</AlertTitle>
              <AlertDescription>
                <ul className="mt-2 list-disc space-y-2 pl-5">
                  {result.data.map((repo: any) => (
                    <li key={repo.repoName}>
                      <a href={repo.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
                        {repo.repoName}
                      </a>: {repo.description}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          {result.type === 'hint' && result.data[0] && (
            <div className="grid gap-4 md:grid-cols-2">
              <Alert>
                <File className="h-4 w-4" />
                <AlertTitle>Suggested Files</AlertTitle>
                <AlertDescription>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {result.data[0].suggestedFiles.map((file: string) => <li key={file}>{file}</li>)}
                  </ul>
                </AlertDescription>
              </Alert>
              <Alert>
                <Box className="h-4 w-4" />
                <AlertTitle>Suggested Spaces</AlertTitle>
                <AlertDescription>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {result.data[0].suggestedSpaces.map((space: string) => <li key={space}>{space}</li>)}
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
