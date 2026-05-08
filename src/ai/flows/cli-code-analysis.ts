
'use server';
/**
 * @fileOverview AI Analysis for CLI pushed code.
 *
 * This flow analyzes code snippets pushed via the CLI to provide 
 * immediate feedback on quality, bugs, and security.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CodeAnalysisInputSchema = z.object({
  files: z.array(z.object({
    path: z.string(),
    content: z.string(),
  })),
  message: z.string().optional(),
});
export type CodeAnalysisInput = z.infer<typeof CodeAnalysisInputSchema>;

const CodeAnalysisOutputSchema = z.object({
  summary: z.string().describe('A high-level summary of the changes.'),
  suggestions: z.array(z.string()).describe('Specific actionable suggestions for the code.'),
  riskLevel: z.enum(['low', 'medium', 'high']).describe('The potential risk of these changes.'),
});
export type CodeAnalysisOutput = z.infer<typeof CodeAnalysisOutputSchema>;

export async function analyzeCliPush(input: CodeAnalysisInput): Promise<CodeAnalysisOutput> {
  const { output } = await analysisPrompt(input);
  if (!output) throw new Error('AI analysis failed.');
  return output;
}

const analysisPrompt = ai.definePrompt({
  name: 'cliAnalysisPrompt',
  input: { schema: CodeAnalysisInputSchema },
  output: { schema: CodeAnalysisOutputSchema },
  prompt: `You are the DevNest Code Architect. You just received a code push from a developer via the CLI.

  ### Context:
  Commit Message: {{{message}}}
  
  ### Files to Analyze:
  {{#each files}}
  File: {{{path}}}
  Content:
  {{{content}}}
  ---
  {{/each}}

  ### Tasks:
  1. Provide a concise summary of what was changed.
  2. Identify any potential bugs, security flaws, or performance issues.
  3. Offer 2-3 specific improvements.
  4. Determine the risk level.

  Be encouraging but technically rigorous.
  `,
});
