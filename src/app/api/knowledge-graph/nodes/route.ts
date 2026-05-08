
import { NextResponse } from 'next/server';
import { scanCodebase } from '@/lib/graph-scanner';

export async function GET() {
  const data = await scanCodebase();
  return NextResponse.json(data.map(n => ({ id: n.id, type: n.type, label: n.label })));
}
