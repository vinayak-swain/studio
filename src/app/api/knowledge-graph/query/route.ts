
import { NextResponse } from 'next/server';
import { knowledgeGraphChat } from '@/ai/flows/knowledge-graph-chat';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query) return NextResponse.json({ error: 'Query is required' }, { status: 400 });

    const result = await knowledgeGraphChat({ query });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Query failed' }, { status: 500 });
  }
}
