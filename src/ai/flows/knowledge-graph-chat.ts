'use server';
/**
 * @fileOverview Knowledge Graph Chatbot flow for DevNest.
 * 
 * This flow uses tools to scan repository metadata, issues, and docs
 * to answer complex architectural and dependency questions.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getFirestore } from 'firebase-admin/firestore'; // Note: In a real environment, use server-side admin SDK or tools to fetch Firestore data

// Input/Output Schemas
const GraphChatInputSchema = z.object({
  query: z.string().describe('The user question about the codebase, issues, or docs.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional(),
});

const GraphChatOutputSchema = z.object({
  answer: z.string().describe('The AI response based on the knowledge graph discovery.'),
  sources: z.array(z.string()).describe('List of files or entities referenced.'),
});

// Tools for discovery
const searchCodebaseMetadata = ai.defineTool(
  {
    name: 'searchCodebaseMetadata',
    description: 'Searches repository metadata for file paths, modules, and basic descriptions.',
    inputSchema: z.object({ query: z.string() }),
    outputSchema: z.array(z.object({ path: z.string(), description: z.string(), dependencies: z.array(z.string()) })),
  },
  async (input) => {
    // Simulated metadata search based on project structure
    // In a real app, this would query a Firestore collection of "indexed_files"
    const mockMetadata = [
      { path: 'src/firebase/index.ts', description: 'Core Firebase initialization and SDK exports.', dependencies: ['firebase/app', 'firebase/auth', 'firebase/firestore'] },
      { path: 'src/app/login/page.tsx', description: 'Login page for authentication.', dependencies: ['src/components/auth/auth-form.tsx'] },
      { path: 'src/components/auth/auth-form.tsx', description: 'Form component for sign-in/up.', dependencies: ['src/firebase/non-blocking-login.tsx'] },
      { path: 'src/ai/genkit.ts', description: 'Genkit AI initialization.', dependencies: ['genkit', '@genkit-ai/google-genai'] },
      { path: 'src/app/dashboard/page.tsx', description: 'Main user dashboard.', dependencies: ['src/components/dashboard/header.tsx', 'src/firebase/index.ts'] },
    ];
    return mockMetadata.filter(m => m.path.includes(input.query) || m.description.toLowerCase().includes(input.query.toLowerCase()));
  }
);

const fetchIssues = ai.defineTool(
  {
    name: 'fetchIssues',
    description: 'Fetches list of issues related to a specific topic (e.g., payments, auth).',
    inputSchema: z.object({ topic: z.string() }),
    outputSchema: z.array(z.object({ id: z.string(), title: z.string(), status: z.string(), relatedFiles: z.array(z.string()) })),
  },
  async (input) => {
    const mockIssues = [
      { id: 'ISSUE-101', title: 'Fix login redirection loop', status: 'open', relatedFiles: ['src/app/login/page.tsx'] },
      { id: 'ISSUE-102', title: 'Database connection timeout on production', status: 'closed', relatedFiles: ['src/firebase/index.ts'] },
    ];
    return mockIssues.filter(i => i.title.toLowerCase().includes(input.topic.toLowerCase()));
  }
);

// Define Prompt
const graphChatPrompt = ai.definePrompt({
  name: 'graphChatPrompt',
  tools: [searchCodebaseMetadata, fetchIssues],
  input: { schema: GraphChatInputSchema },
  output: { schema: GraphChatOutputSchema },
  prompt: `You are the DevNest Insight Bot, an expert at analyzing codebases and project metadata.
  
  Your goal is to answer technical questions by exploring the knowledge graph of this project.
  Use the provided tools to search for modules, files, dependencies, and issues.
  
  When asked about dependencies:
  1. Use searchCodebaseMetadata to find the files.
  2. Cross-reference their dependencies.
  
  When asked about issues:
  1. Use fetchIssues to find related tasks.
  
  Current User Query: {{{query}}}
  
  Context:
  DevNest is built with Next.js, Firebase (Auth/Firestore), and Genkit.
  `,
});

// Define Flow
export const knowledgeGraphChat = ai.defineFlow(
  {
    name: 'knowledgeGraphChat',
    inputSchema: GraphChatInputSchema,
    outputSchema: GraphChatOutputSchema,
  },
  async (input) => {
    const { output } = await graphChatPrompt(input);
    return output!;
  }
);
