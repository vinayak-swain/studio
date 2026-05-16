import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getFirestore, collection, addDoc, serverTimestamp, setDoc, getDoc } from 'firebase/firestore';
import { analyzeCliPush } from '@/ai/flows/cli-code-analysis';
import { verifyCliToken } from '@/lib/cli-auth';

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

  const { files, message, repoId } = await req.json();

  if (!repoId || !files) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const { firebaseApp } = initializeFirebase();
    const db = getFirestore(firebaseApp);

    // Verify repository ownership
    const repoRef = doc(db, 'users', userData.userId, 'repositories', repoId);
    const repoSnap = await getDoc(repoRef);
    if (!repoSnap.exists()) {
      return NextResponse.json({ error: 'Repository not found' }, { status: 404 });
    }

    // AI Analysis
    const analysis = await analyzeCliPush({ files, message });

    // 1. Update Files subcollection
    for (const file of files) {
      const fileId = file.path.replace(/\//g, '_');
      const fileDocRef = doc(repoRef, 'files', fileId);
      await setDoc(fileDocRef, {
        path: file.path,
        content: file.content,
        updatedAt: serverTimestamp(),
      });
    }

    // 2. Create Commit Record
    const commitRef = await addDoc(collection(repoRef, 'commits'), {
      message: message || 'Update from CLI',
      fileCount: files.length,
      createdAt: serverTimestamp(),
      author: userData.email,
      authorId: userData.userId,
      aiAnalysis: analysis,
      hash: Math.random().toString(36).substring(2, 10),
    });

    return NextResponse.json({ 
      success: true, 
      commitId: commitRef.id,
      fileCount: files.length,
      aiAnalysis: analysis 
    });
  } catch (error: any) {
    console.error('CLI Push Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
