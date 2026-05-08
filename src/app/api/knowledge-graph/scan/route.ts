
import { NextResponse } from 'next/server';
import { scanCodebase } from '@/lib/graph-scanner';

export async function POST() {
  try {
    const graphData = await scanCodebase();
    // In a real environment, we would persist this to Firestore here.
    // For the prototype, we return the results of the scan.
    return NextResponse.json({ 
      message: 'Scan complete', 
      nodeCount: graphData.length,
      data: graphData 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Scan failed' }, { status: 500 });
  }
}
