
import { NextResponse } from 'next/server';
import { scanCodebase } from '@/lib/graph-scanner';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const data = await scanCodebase();
  const node = data.find(n => n.id === decodeURIComponent(params.id));
  
  if (!node) return NextResponse.json({ error: 'Node not found' }, { status: 404 });
  
  return NextResponse.json(node.relations);
}
