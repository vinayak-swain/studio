
import { NextResponse } from 'next/server';
import { initializeAdmin } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { analyzeCliPush } from '@/ai/flows/cli-code-analysis';
import { verifyCliToken } from '@/lib/cli-auth';

/**
 * Receives batch file updates from the CLI.
 * Uses Firebase Admin SDK to bypass security rules for server-side push.
 */
export async function POST(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const userData = await verifyCliToken(token);

  if (!userData) {
    return NextResponse.json({ error: 'Invalid or expired CLI token' }, { status: 401 });
  }

  const { files, message, repoId } = await req.json();

  if (!repoId || !files) {
    return NextResponse.json({ error: 'Missing repository ID or files' }, { status: 400 });
  }

  try {
    const { adminDb } = initializeAdmin();

    // 1. Verify Repository Existence and Ownership
    const repoRef = adminDb.collection('users').doc(userData.userId).collection('repositories').doc(repoId);
    const repoSnap = await repoRef.get();
    
    if (!repoSnap.exists) {
      return NextResponse.json({ error: 'Repository not found or permission denied' }, { status: 404 });
    }

    // 2. AI Analysis on changes
    const analysis = await analyzeCliPush({ files, message });

    // 3. Batch Update Files
    const batch = adminDb.batch();
    for (const file of files) {
      const fileId = file.path.replace(/\//g, '_');
      const fileDocRef = repoRef.collection('files').doc(fileId);
      batch.set(fileDocRef, {
        path: file.path,
        content: file.content,
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
    }

    // 4. Create Commit Record
    const commitRef = repoRef.collection('commits').doc();
    const hash = Math.random().toString(36).substring(2, 15);
    
    batch.set(commitRef, {
      message: message || 'Update from terminal',
      fileCount: files.length,
      createdAt: FieldValue.serverTimestamp(),
      author: userData.name || userData.email,
      authorId: userData.userId,
      aiAnalysis: analysis,
      hash,
    });

    await batch.commit();

    return NextResponse.json({ 
      success: true, 
      commitId: commitRef.id,
      hash,
      fileCount: files.length,
      aiAnalysis: analysis 
    });
  } catch (error: any) {
    console.error('CLI Push Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
