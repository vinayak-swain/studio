
'use server';
/**
 * @fileOverview Knowledge Graph Chatbot flow for DevNest.
 * 
 * This flow uses tools to scan repository metadata, issues, and docs
 * to answer complex architectural and dependency questions.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { scanCodebase } from '@/lib/graph-scanner';

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
const getFullKnowledgeGraph = ai.defineTool(
  {
    name: 'getFullKnowledgeGraph',
    description: 'Fetches the entire knowledge graph including files, imports, and relations.',
    inputSchema: z.object({}),
    outputSchema: z.any(),
  },
  async () => {
    return await scanCodebase();
  }
);

// Define Prompt
const graphChatPrompt = ai.definePrompt({
  name: 'graphChatPrompt',
  tools: [getFullKnowledgeGraph],
  input: { schema: GraphChatInputSchema },
  output: { schema: GraphChatOutputSchema },
  prompt: `You are the DevNest Insight Bot, an expert at analyzing codebases.
  
  Use the getFullKnowledgeGraph tool to understand the project structure.
  
  When asked about dependencies:
  - Look for "depends_on" relations.
  
  When asked about issues:
  - Look for "issue" type nodes and their "relates_to" relations.
  
  Answer clearly and provide a list of sources (file paths or IDs) you used to find the answer.
  
  Current User Query: {{{query}}}
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
