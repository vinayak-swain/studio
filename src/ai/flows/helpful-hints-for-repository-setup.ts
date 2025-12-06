'use server';
/**
 * @fileOverview Provides AI-generated suggestions for files and spaces to add to a repository.
 *
 * - `getHelpfulHints`: A function that takes a repository description and returns file and space suggestions.
 * - `HelpfulHintsInput`: The input type for the `getHelpfulHints` function.
 * - `HelpfulHintsOutput`: The return type for the `getHelpfulHints` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HelpfulHintsInputSchema = z.object({
  repositoryDescription: z
    .string()
    .describe('A description of the repository for which to generate suggestions.'),
});
export type HelpfulHintsInput = z.infer<typeof HelpfulHintsInputSchema>;

const HelpfulHintsOutputSchema = z.object({
  suggestedFiles: z
    .array(z.string())
    .describe('A list of suggested files to add to the repository.'),
  suggestedSpaces: z
    .array(z.string())
    .describe('A list of suggested spaces to add to the repository.'),
});
export type HelpfulHintsOutput = z.infer<typeof HelpfulHintsOutputSchema>;

export async function getHelpfulHints(input: HelpfulHintsInput): Promise<HelpfulHintsOutput> {
  return helpfulHintsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'helpfulHintsPrompt',
  input: {schema: HelpfulHintsInputSchema},
  output: {schema: HelpfulHintsOutputSchema},
  prompt: `You are an AI assistant that provides helpful hints for setting up a new repository.

  Given the following repository description, suggest a list of files and spaces that would be helpful to add to the repository.

  Repository Description: {{{repositoryDescription}}}

  Format your answer as a JSON object with two fields: suggestedFiles and suggestedSpaces.  Each field should be an array of strings.
  Do not include any explanation, only the JSON object.
  `,
});

const helpfulHintsFlow = ai.defineFlow(
  {
    name: 'helpfulHintsFlow',
    inputSchema: HelpfulHintsInputSchema,
    outputSchema: HelpfulHintsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
