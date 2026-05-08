
'use server';
/**
 * @fileOverview AI Analysis for CLI pushed code.
 *
 * This flow analyzes code changes and returns structured insights
 * about intent, risk, and architectural impact.
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
  changeType: z.enum(['feature', 'fix', 'refactor', 'breaking', 'chore']).describe('The primary nature of the changes.'),
  intentSummary: z.string().describe('A one-line description of what changed.'),
  affectedModules: z.array(z.string()).describe('List of key modules or files impacted.'),
  breakingChange: z.boolean().describe('Whether this introduces any breaking changes.'),
  riskScore: z.number().min(0).max(100).describe('A risk score from 0-100 based on complexity and impact.'),
  architecturalImpact: z.string().describe('A brief description of structural consequences.'),
  behaviorChange: z.string().describe('What behavior changed if any.'),
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
  prompt: `You are a code analysis AI for a version control system. 
  Analyze the following files and return ONLY valid JSON.
  
  Files changed: {{files.length}}
  
  ### Files to Analyze:
  {{#each files}}
  File: {{{path}}}
  Content:
  {{{content}}}
  ---
  {{/each}}
  
  Commit Message: {{{message}}}
  
  Tasks:
  1. Determine the change type (feature, fix, refactor, breaking, chore).
  2. Provide a one-line intent summary.
  3. Identify affected modules.
  4. Flag breaking changes.
  5. Calculate a risk score (0-100).
  6. Describe architectural impact.
  7. Explain behavior changes.
  `,
});
