'use server';
/**
 * @fileOverview Knowledge Graph Chatbot flow for DevNest.
 * 
 * This flow uses tools to scan repository metadata, issues, and docs
 * to answer complex architectural and dependency questions.
 * 
 * - knowledgeGraphChat: The main flow function exported for use in the UI.
 * - GraphChatInputSchema: Input schema for the chatbot.
 * - GraphChatOutputSchema: Structured output schema for the chatbot response.
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
export type GraphChatInput = z.infer<typeof GraphChatInputSchema>;

const GraphChatOutputSchema = z.object({
  answer: z.string().describe('The AI response based on the knowledge graph discovery. Be helpful and precise.'),
  sources: z.array(z.string()).describe('List of files or entities referenced in the answer.'),
});
export type GraphChatOutput = z.infer<typeof GraphChatOutputSchema>;

// Tool to fetch the current graph state
const getFullKnowledgeGraph = ai.defineTool(
  {
    name: 'getFullKnowledgeGraph',
    description: 'Fetches the entire knowledge graph including files, imports, issues, and their relations.',
    inputSchema: z.object({}),
    outputSchema: z.any(),
  },
  async () => {
    // This scans the real src directory of the project
    return await scanCodebase();
  }
);

// Define the Prompt with specialized instructions for graph traversal
const graphChatPrompt = ai.definePrompt({
  name: 'graphChatPrompt',
  tools: [getFullKnowledgeGraph],
  input: { schema: GraphChatInputSchema },
  output: { schema: GraphChatOutputSchema },
  prompt: `You are the DevNest Insight Bot, an expert at analyzing codebase architecture and project dependencies.
  
  Your goal is to answer technical questions about this project using the knowledge graph provided by the tools.
  
  ### Instructions:
  1. ALWAYS call the 'getFullKnowledgeGraph' tool first to understand the current project structure.
  2. The graph contains nodes (files, issues, etc.) and relations (depends_on, relates_to).
  3. For "What depends on X?": Find all nodes that have a 'depends_on' relation targeting X.
  4. For "Where is X used?": Look for calls or imports pointing to X.
  5. For "What issues relate to X?": Look for 'issue' type nodes with 'relates_to' pointing to X.
  6. For "Most connected modules": Identify nodes with the highest number of relations.
  7. If you find multiple related files, list them in the 'sources' field using their full path from the graph.
  
  Be precise and technical. If a module isn't in the graph, state that clearly.
  
  User Query: {{{query}}}
  `,
});

// The exported flow function
export async function knowledgeGraphChat(input: GraphChatInput): Promise<GraphChatOutput> {
  const { output } = await graphChatPrompt(input);
  if (!output) {
    throw new Error('AI failed to generate a response for the graph query.');
  }
  return output;
}
