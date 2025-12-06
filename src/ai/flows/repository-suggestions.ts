'use server';
/**
 * @fileOverview Provides AI-powered repository suggestions for the dashboard.
 *
 * - suggestRepositories - A function that suggests relevant repositories based on a description.
 * - RepositorySuggestionsInput - The input type for the suggestRepositories function.
 * - RepositorySuggestionsOutput - The return type for the suggestRepositories function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RepositorySuggestionsInputSchema = z.object({
  description: z.string().describe('The description of the user or their interests.'),
});
export type RepositorySuggestionsInput = z.infer<typeof RepositorySuggestionsInputSchema>;

const RepositorySuggestionSchema = z.object({
  repoName: z.string().describe('The name of the repository.'),
  description: z.string().describe('A short description of the repository.'),
  url: z.string().url().describe('The URL of the repository.'),
});

const RepositorySuggestionsOutputSchema = z.array(RepositorySuggestionSchema).describe('An array of repository suggestions.');
export type RepositorySuggestionsOutput = z.infer<typeof RepositorySuggestionsOutputSchema>;

export async function suggestRepositories(input: RepositorySuggestionsInput): Promise<RepositorySuggestionsOutput> {
  return suggestRepositoriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'repositorySuggestionsPrompt',
  input: {schema: RepositorySuggestionsInputSchema},
  output: {schema: RepositorySuggestionsOutputSchema},
  prompt: `You are a helpful assistant that suggests relevant repositories based on the user's description.

  Suggest repositories that are closely related to the user's interests and would be valuable additions to their dashboard.
  Provide the repository name, a short description, and the URL of the repository. Make sure the URL is a valid URL.

  User Description: {{{description}}}
  `,
});

const suggestRepositoriesFlow = ai.defineFlow(
  {
    name: 'suggestRepositoriesFlow',
    inputSchema: RepositorySuggestionsInputSchema,
    outputSchema: RepositorySuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
