
import { NextResponse } from 'next/server';
import { initializeAdmin } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { verifyCliToken } from '@/lib/cli-auth';
import { analyzeCliPush } from '@/ai/flows/cli-code-analysis';

/**
 * Records a local commit metadata in the remote repository.
 */
export async function POST(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const userData = await verifyCliToken(token);

  if (!userData) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const { message, repoId, changes } = await req.json();

  try {
    const { adminDb } = initializeAdmin();
    const repoRef = adminDb.collection('users').doc(userData.userId).collection('repositories').doc(repoId);

    // Metadata analysis
    const analysis = await analyzeCliPush({ files: [], message });

    const commitRef = await repoRef.collection('commits').add({
      message,
      changesSummary: changes,
      createdAt: FieldValue.serverTimestamp(),
      aiAnalysis: analysis,
      author: userData.name || userData.email,
      authorId: userData.userId,
    });

    return NextResponse.json({ 
      success: true, 
      commitId: commitRef.id,
      message,
      aiAnalysis: analysis
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
