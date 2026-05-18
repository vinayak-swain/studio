
import { NextResponse } from 'next/server';
import { initializeAdmin } from '@/lib/firebase-admin';
import { verifyCliToken } from '@/lib/cli-auth';

/**
 * Sends all current repository files to the CLI for local synchronization.
 * Uses Admin SDK to bypass rules for authorized CLI pull requests.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const repoId = searchParams.get('repoId');
  const authHeader = req.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.substring(7).trim();
  const userData = await verifyCliToken(token);

  if (!userData || !repoId) {
    return NextResponse.json({ error: 'Unauthorized or missing parameters' }, { status: 401 });
  }

  try {
    const { adminDb } = initializeAdmin();

    // Try lookup by ID first
    let repoRef = adminDb.collection('users').doc(userData.userId).collection('repositories').doc(repoId);
    let repoSnap = await repoRef.get();
    
    // If not found by ID, try lookup by name
    if (!repoSnap.exists) {
      const reposByName = await adminDb.collection('users').doc(userData.userId).collection('repositories')
        .where('name', '==', repoId)
        .limit(1)
        .get();
      
      if (!reposByName.empty) {
        repoRef = reposByName.docs[0].ref;
        repoSnap = reposByName.docs[0];
      } else {
        return NextResponse.json({ error: 'Repository not found or permission denied' }, { status: 404 });
      }
    }

    const filesSnap = await repoRef.collection('files').get();

    const files = filesSnap.docs.map(doc => ({
      path: doc.data().path,
      content: doc.data().content
    }));

    const commitsSnap = await repoRef.collection('commits').orderBy('createdAt', 'desc').limit(1).get();
    const lastCommit = commitsSnap.docs[0]?.data() || { message: 'Initial state' };

    return NextResponse.json({ 
      success: true, 
      files,
      message: lastCommit.message,
      commitId: commitsSnap.docs[0]?.id || 'initial'
    });
  } catch (error: any) {
    console.error('CLI Pull Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
