
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

  if (!repoId || !files || !Array.isArray(files)) {
    return NextResponse.json({ error: 'Missing repository ID or files' }, { status: 400 });
  }

  try {
    const { adminDb } = initializeAdmin();

    // 1. Verify Repository Existence and Ownership
    let repoRef = adminDb.collection('users').doc(userData.userId).collection('repositories').doc(repoId);
    let repoSnap = await repoRef.get();
    
    if (!repoSnap.exists) {
      const reposByName = await adminDb.collection('users').doc(userData.userId).collection('repositories')
        .where('name', '==', repoId)
        .limit(1)
        .get();
      
      if (!reposByName.empty) {
        repoRef = reposByName.docs[0].ref;
        repoSnap = reposByName.docs[0];
      } else {
        return NextResponse.json({ error: `Repository '${repoId}' not found.` }, { status: 404 });
      }
    }

    // 2. AI Analysis on changes (Safe Trimming)
    // We only send the first 10 files and the first 1000 chars of each to avoid token limits/500s
    const analysisFiles = files.slice(0, 10).map(f => ({
      path: f.path,
      content: f.content.substring(0, 1000)
    }));
    
    let analysis = {
      changeType: 'chore',
      intentSummary: 'Update from CLI',
      affectedModules: [],
      breakingChange: false,
      riskScore: 0,
      architecturalImpact: 'Minimal',
      behaviorChange: 'None'
    };

    try {
      analysis = await analyzeCliPush({ files: analysisFiles, message });
    } catch (aiError) {
      console.warn('AI Analysis failed, proceeding with defaults:', aiError);
    }

    // 3. Batch Update Files (Chunked for Firestore limits)
    // Firestore has a 500-operation limit per batch.
    const BATCH_LIMIT = 450;
    for (let i = 0; i < files.length; i += BATCH_LIMIT) {
      const chunk = files.slice(i, i + BATCH_LIMIT);
      const batch = adminDb.batch();
      
      for (const file of chunk) {
        const fileId = file.path.replace(/\//g, '_');
        const fileDocRef = repoRef.collection('files').doc(fileId);
        batch.set(fileDocRef, {
          path: file.path,
          content: file.content,
          updatedAt: FieldValue.serverTimestamp(),
        }, { merge: true });
      }
      await batch.commit();
    }

    // 4. Create Commit Record
    const hash = Math.random().toString(36).substring(2, 15);
    const commitRef = repoRef.collection('commits').doc();
    
    await commitRef.set({
      message: message || 'Update from terminal',
      fileCount: files.length,
      createdAt: FieldValue.serverTimestamp(),
      author: userData.name || userData.email,
      authorId: userData.userId,
      aiAnalysis: analysis,
      hash,
    });

    return NextResponse.json({ 
      success: true, 
      repoId: repoRef.id,
      commitId: commitRef.id,
      hash,
      fileCount: files.length,
      aiAnalysis: analysis 
    });
  } catch (error: any) {
    console.error('CLI Push Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
