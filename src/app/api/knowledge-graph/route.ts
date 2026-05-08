
import { NextResponse } from 'next/server';
import { scanCodebase } from '@/lib/graph-scanner';

export async function GET() {
  try {
    // Returning the scanned data directly for the prototype
    const data = await scanCodebase();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch graph' }, { status: 500 });
  }
}
