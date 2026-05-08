
'use server';
/**
 * @fileOverview Analyzes an imported repository to provide architectural insights.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ImportAnalysisInputSchema = z.object({
  repoName: z.string(),
  fileCount: z.number(),
  languages: z.array(z.string()),
  sampleContent: z.string().describe('Snippets from key files like package.json or README.'),
});
export type ImportAnalysisInput = z.infer<typeof ImportAnalysisInputSchema>;

const ImportAnalysisOutputSchema = z.object({
  projectType: z.string().describe('e.g., web app, library, cli, etc.'),
  techStack: z.array(z.string()).describe('List of detected technologies.'),
  stabilityScore: z.number().min(0).max(100),
  complexityScore: z.number().min(0).max(100),
  summary: z.string().describe('A brief overview of what this project does.'),
  recommendations: z.array(z.string()).describe('Actionable suggestions for the project.'),
});
export type ImportAnalysisOutput = z.infer<typeof ImportAnalysisOutputSchema>;

export async function analyzeImportedRepo(input: ImportAnalysisInput): Promise<ImportAnalysisOutput> {
  const { output } = await analysisPrompt(input);
  if (!output) throw new Error('AI analysis failed.');
  return output;
}

const analysisPrompt = ai.definePrompt({
  name: 'importAnalysisPrompt',
  input: { schema: ImportAnalysisInputSchema },
  output: { schema: ImportAnalysisOutputSchema },
  prompt: `You are an expert software architect. Analyze this imported repository and provide a deep technical summary.
  
  Repository: {{{repoName}}}
  Files: {{fileCount}}
  Languages: {{#each languages}}{{{this}}}, {{/each}}
  
  ### Sample Content Analysis:
  {{{sampleContent}}}
  
  Provide a structured assessment including project type, tech stack, and scores for stability and complexity.
  `,
});
